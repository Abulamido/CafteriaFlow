import os
import json
from fastapi import FastAPI, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from openai import AsyncOpenAI
from redis.asyncio import Redis

from database import engine, Base, get_db
from models import Tenant, Order, Menu
from redis_client import get_redis
from api_router import router as api_router
from evolution_client import send_interactive_list, send_text_message

# Initialize DB tables (for scaffolding purposes)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cafteriaflow Webhook Engine")

# Include API routes
app.include_router(api_router, prefix="/api")

# NVIDIA NIM OpenAI-compatible client setup
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "your-nvidia-api-key")
client = AsyncOpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=NVIDIA_API_KEY
)

@app.post("/webhook")
async def webhook(
    request: Request, 
    db: Session = Depends(get_db),
    redis: Redis = Depends(get_redis)
):
    payload = await request.json()
    
    # Extract evolution api instance and remoteJid
    # Assuming standard Evolution API format:
    # {"instance": "pizza_place", "data": {"key": {"remoteJid": "5511999999999@s.whatsapp.net"}, "message": {"conversation": "I want to order!"}}}
    
    instance_name = payload.get("instance")
    event_data = payload.get("data", {})
    if not instance_name or not event_data:
        return {"status": "ignored", "reason": "invalid_payload"}
        
    remote_jid = event_data.get("key", {}).get("remoteJid")
    message_content = event_data.get("message", {}).get("conversation")
    
    if not remote_jid or not message_content:
        return {"status": "ignored", "reason": "no_conversation"}
        
    # 1. Tenant Resolution
    tenant = db.query(Tenant).filter(Tenant.instance_name == instance_name).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
        
    
    # 2. Context Fetching and Cart State
    session_key = f"{tenant.id}:{remote_jid}"
    cart_key = f"{session_key}:cart"
    
    # Check for List Message selection (Evolution API places this in different fields, simplify for example)
    list_response = event_data.get("message", {}).get("listResponseMessage")
    if list_response:
        selected_item_id = list_response.get("singleSelectReply", {}).get("selectedRowId")
        # Logic to add to cart...
        await redis.rpush(cart_key, selected_item_id)
        current_cart = await redis.lrange(cart_key, 0, -1)
        await send_text_message(tenant.instance_name, remote_jid, f"Added! Cart has {len(current_cart)} items. Type 'finalize' to order, or 'menu' for more.")
        return {"status": "cart_updated"}

    # Handle standard text
    message_content = event_data.get("message", {}).get("conversation")
    if not message_content:
        # Might be extended text message or other format
        message_content = event_data.get("message", {}).get("extendedTextMessage", {}).get("text")
        
    if not message_content:
        return {"status": "ignored", "reason": "no_conversation_or_text"}
        
    # Check for trigger words to send Interactive List
    if message_content.lower() in ["hi", "hello", "menu", "start"]:
        # Fetch actual menu categories from DB... (mocking sections here)
        sections = [
            {
                "title": "Main Menu",
                "rows": [
                    {"title": "Pizza Margherita", "rowId": "item_1", "description": "$12.00"},
                    {"title": "Classic Burger", "rowId": "item_2", "description": "$10.00"}
                ]
            }
        ]
        await send_interactive_list(
            instance_name=tenant.instance_name,
            remote_jid=remote_jid,
            title=f"Welcome to {tenant.instance_name}!",
            description="Please select an item to begin your order.",
            button_text="View Menu",
            sections=sections
        )
        return {"status": "list_sent"}
        
    # Standard AI Invocation logic for all other queries
    history = await redis.lrange(session_key, 0, 9)
    sys_prompt = tenant.sys_prompt or "You are a helpful restaurant ordering assistant. If the user wants to finalize an order based on their cart context, output a PLACE_ORDER JSON."
    
    # Inject cart context into system prompt
    current_cart_raw = await redis.lrange(cart_key, 0, -1)
    if current_cart_raw:
        sys_prompt += f"\nUser's current cart items: {', '.join(current_cart_raw)}"
        
    messages = [{"role": "system", "content": sys_prompt}]
    
    for msg in reversed(history):
        messages.append(json.loads(msg))
        
    messages.append({"role": "user", "content": message_content})
    
    # Save the new user message to redis
    await redis.lpush(session_key, json.dumps({"role": "user", "content": message_content}))
    await redis.ltrim(session_key, 0, 9)
    await redis.expire(session_key, 86400) # 24-hour expiration state
    
    # 3. AI Invocation with NVIDIA NIM (kimi-k2.5)
    response = await client.chat.completions.create(
        model="moonshotai/kimi-k2.5",
        messages=messages,
        response_format={"type": "json_object"} # Forced JSON for order extraction
    )
    
    ai_content = response.choices[0].message.content
    
    # Store AI response
    await redis.lpush(session_key, json.dumps({"role": "assistant", "content": ai_content}))
    await redis.ltrim(session_key, 0, 9)
    
    # 4. Action / Processing Place Order Intents
    try:
        ai_data = json.loads(ai_content)
        if ai_data.get("intent") == "PLACE_ORDER":
            new_order = Order(
                tenant_id=tenant.id,
                customer_phone=remote_jid,
                items=ai_data.get("items", current_cart_raw), # Prefer AI generated item list or fallback to cart state
                total=ai_data.get("total", 0.0)
            )
            db.add(new_order)
            db.commit()
            
            # Clear cart
            await redis.delete(cart_key)
            
            # Send Vendor Alert
            # Note: For multi-tenant, vendor would be notified via their own Dashboard socket, or an alert SMS.
            print(f"[ALERT] New order created for Tenant {tenant.id} by {remote_jid}")
            
            # Reply to user
            await send_text_message(tenant.instance_name, remote_jid, "Your order has been placed successfully!")
            return {"status": "order_placed"}
            
    except json.JSONDecodeError:
        # Non-JSON generated by AI somehow, or normal conversational reply
        # Treat as raw text reply to user
        await send_text_message(tenant.instance_name, remote_jid, ai_content)
        
    return {"status": "processed", "reply": "handled"}
