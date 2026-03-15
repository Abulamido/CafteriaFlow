import httpx
import os
from typing import List, Dict, Any

EVOLUTION_API_URL = os.getenv("EVOLUTION_API_URL", "http://localhost:8080")
EVOLUTION_GLOBAL_API_KEY = os.getenv("EVOLUTION_GLOBAL_API_KEY", "your_global_key")

async def create_instance(instance_name: str) -> dict:
    """Mock call to create a new Evolution API instance for a tenant."""
    async with httpx.AsyncClient() as client:
        try:
            payload = {
                "instanceName": instance_name,
                "token": "generated_token_or_none",
                "qrcode": True
            }
            headers = {"apikey": EVOLUTION_GLOBAL_API_KEY}
            response = await client.post(f"{EVOLUTION_API_URL}/instance/create", json=payload, headers=headers)
            if response.status_code == 404:
                return {"status": "mocked", "message": "Hit evolution api placeholder"}
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Evolution API Error: {e}")
            return {"status": "error", "message": str(e)}

async def fetch_qr_code(instance_name: str) -> dict:
    """Mock call to fetch base64 QR code to render on frontend."""
    async with httpx.AsyncClient() as client:
        try:
            headers = {"apikey": EVOLUTION_GLOBAL_API_KEY}
            response = await client.get(f"{EVOLUTION_API_URL}/instance/connect/{instance_name}", headers=headers)
            if response.status_code == 404:
                return {"base64": "mock_base64_string", "status": "mocked"}
            response.raise_for_status()
            return response.json()
        except Exception as e:
             return {"status": "error", "message": str(e)}

async def send_interactive_list(instance_name: str, remote_jid: str, title: str, description: str, button_text: str, sections: List[Dict[str, Any]]):
    """Sends a WhatsApp interactive list message."""
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
            if response.status_code == 404:
                return {"status": "mocked", "message": "Hit evolution api placeholder for list"}
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error sending list message: {e}")
            return {"status": "error", "message": str(e)}

async def send_text_message(instance_name: str, remote_jid: str, text: str):
    """Sends a generic WhatsApp text message."""
    async with httpx.AsyncClient() as client:
        try:
            headers = {"apikey": EVOLUTION_GLOBAL_API_KEY}
            payload = {
                "number": remote_jid,
                "text": text
            }
            response = await client.post(f"{EVOLUTION_API_URL}/message/sendText/{instance_name}", json=payload, headers=headers)
            if response.status_code == 404:
                return {"status": "mocked", "message": "Hit evolution api placeholder for text"}
            response.raise_for_status()
            return response.json()
        except Exception as e:
             return {"status": "error", "message": str(e)}
