import httpx
import os
from typing import List, Dict, Any

EVOLUTION_API_URL = os.getenv("EVOLUTION_API_URL", "http://localhost:8080")
EVOLUTION_GLOBAL_API_KEY = os.getenv("EVOLUTION_GLOBAL_API_KEY", "cafteriaflow_evo_key")

async def create_instance(instance_name: str) -> dict:
    """Create a new Evolution API instance for a tenant."""
    async with httpx.AsyncClient() as client:
        try:
            payload = {
                "instanceName": instance_name,
                "qrcode": True,
                "integration": "WHATSAPP-BAILEYS"
            }
            headers = {"apikey": EVOLUTION_GLOBAL_API_KEY}
            response = await client.post(f"{EVOLUTION_API_URL}/instance/create", json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Evolution API Error: {e}")
            return {"status": "error", "message": str(e)}

async def fetch_qr_code(instance_name: str) -> dict:
    """Fetch base64 QR code from Evolution API to render on frontend."""
    async with httpx.AsyncClient() as client:
        try:
            headers = {"apikey": EVOLUTION_GLOBAL_API_KEY}
            response = await client.get(f"{EVOLUTION_API_URL}/instance/connect/{instance_name}", headers=headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
             return {"status": "error", "message": str(e)}

async def send_interactive_list(instance_name: str, remote_jid: str, title: str, description: str, button_text: str, sections: List[Dict[str, Any]]):
    """Sends a WhatsApp interactive list message via Evolution API."""
    async with httpx.AsyncClient() as client:
        try:
            headers = {"apikey": EVOLUTION_GLOBAL_API_KEY}
            payload = {
                "number": remote_jid,
                "title": title,
                "description": description,
                "buttonText": button_text,
                "sections": sections
            }
            response = await client.post(f"{EVOLUTION_API_URL}/message/sendList/{instance_name}", json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error sending list message: {e}")
            return {"status": "error", "message": str(e)}

async def send_text_message(instance_name: str, remote_jid: str, text: str):
    """Sends a generic WhatsApp text message via Evolution API."""
    async with httpx.AsyncClient() as client:
        try:
            headers = {"apikey": EVOLUTION_GLOBAL_API_KEY}
            payload = {
                "number": remote_jid,
                "text": text
            }
            response = await client.post(f"{EVOLUTION_API_URL}/message/sendText/{instance_name}", json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
             return {"status": "error", "message": str(e)}

