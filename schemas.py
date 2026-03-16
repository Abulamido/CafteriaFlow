from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID

# Tenant Schemas
class TenantCreate(BaseModel):
    name: str # Friendly name
    tenant_type: str # "EVOLUTION" or "META"
    instance_name: Optional[str] = None # For Evolution API
    api_key: Optional[str] = None # For Evolution API
    phone_number_id: Optional[str] = None # For Meta API
    waba_id: Optional[str] = None # For Meta API
    access_token: Optional[str] = None # For Meta API
    sys_prompt: Optional[str] = None

class TenantResponse(BaseModel):
    id: UUID
    name: str
    tenant_type: str
    sys_prompt: Optional[str]

    class Config:
        orm_mode = True

# Message Schemas (Unified)
class NormalizedMessage(BaseModel):
    tenant_id: UUID
    customer_phone: str
    content: str
    message_type: str = "text" # text, image, list_response
    raw_payload: Dict[str, Any]
    metadata: Dict[str, Any] = {}

# Menu Schemas
class MenuItemCreate(BaseModel):
    item_name: str
    price: float
    json_meta: Optional[Dict[str, Any]] = None

class MenuItemResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    item_name: str
    price: float
    json_meta: Optional[Dict[str, Any]]

    class Config:
        orm_mode = True

# Order Schemas
class OrderResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    customer_phone: str
    items: List[Dict[str, Any]]
    total: float

    class Config:
        orm_mode = True
