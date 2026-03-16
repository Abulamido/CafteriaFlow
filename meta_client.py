import os
import httpx
from typing import List, Dict, Any

META_API_VERSION = "v21.0"

async def send_meta_text(phone_number_id: str, access_token: str, to: str, text: str):
    url = f"https://graph.facebook.com/{META_API_VERSION}/{phone_number_id}/messages"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": text}
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=payload)
        return response.json()

async def send_meta_interactive_list(
    phone_number_id: str, 
    access_token: str, 
    to: str, 
    header_text: str,
    body_text: str,
    footer_text: str,
    sections: List[Dict[str, Any]]
):
    url = f"https://graph.facebook.com/{META_API_VERSION}/{phone_number_id}/messages"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "interactive",
        "interactive": {
            "type": "list",
            "header": {"type": "text", "text": header_text},
            "body": {"text": body_text},
            "footer": {"text": footer_text},
            "action": {
                "button": "View Menu",
                "sections": sections
            }
        }
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=payload)
        return response.json()
