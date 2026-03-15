from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID

# Tenant Schemas
class TenantCreate(BaseModel):
    instance_name: str
    api_key: str
    sys_prompt: Optional[str] = None

class TenantResponse(BaseModel):
    id: UUID
    instance_name: str
    sys_prompt: Optional[str]

    class Config:
        orm_mode = True

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
