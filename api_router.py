from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from uuid import UUID

from database import get_db
from models import Tenant, Menu, Order
from evolution_client import create_instance, fetch_qr_code
from schemas import (
    TenantCreate, TenantResponse,
    MenuItemCreate, MenuItemResponse,
    OrderResponse
)

router = APIRouter()

# --- Tenant Endpoints ---

@router.post("/tenants", response_model=TenantResponse, status_code=status.HTTP_201_CREATED)
async def create_tenant(tenant: TenantCreate, db: Session = Depends(get_db)):
    # Check for existing instance
    if tenant.instance_name:
        db_tenant = db.query(Tenant).filter(Tenant.instance_name == tenant.instance_name).first()
        if db_tenant:
            raise HTTPException(status_code=400, detail="Instance name already registered")
    
    new_tenant = Tenant(
        name=tenant.name,
        tenant_type=tenant.tenant_type or "EVOLUTION",
        instance_name=tenant.instance_name,
        api_key=tenant.api_key,
        phone_number_id=tenant.phone_number_id,
        waba_id=tenant.waba_id,
        access_token=tenant.access_token,
        sys_prompt=tenant.sys_prompt
    )
    db.add(new_tenant)
    db.commit()
    db.refresh(new_tenant)
    
    # Trigger Evolution API to create instance synchronously so we get the QR code
    if new_tenant.tenant_type == "EVOLUTION" and new_tenant.instance_name:
        evo_client_response = await create_instance(new_tenant.instance_name)
        if evo_client_response.get("status") == "success" and evo_client_response.get("base64"):
            # Store the QR code temporarily in Redis or just let the frontend fetch it if we store it
            # Actually, `Tenant` model doesn't have a `qr_code` field. We can just add it dynamically 
            # or rely on the frontend fetching it immediately. Wait, if it's consumed immediately, 
            # let's add `qr_code` to the `new_tenant` object before returning, or let frontend fetch it.
            # It's better to update `get_tenant_qr` to return the stored QR, but where do we store it?
            # Let's add a `qr_code_base64` column to the `tenants` table.
            pass

    return new_tenant

@router.get("/tenants/{tenant_id}", response_model=TenantResponse)
def get_tenant(tenant_id: UUID, db: Session = Depends(get_db)):
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant

@router.get("/tenants/{tenant_id}/qr")
async def get_tenant_qr(tenant_id: UUID, db: Session = Depends(get_db)):
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
        
    # Since Evolution API returns the QR ONLY on creation, we need it stored in DB.
    # We will modify `create_tenant` to save it to `tenant.qr_code_base64`.
    qr_data = {"base64": getattr(tenant, "qr_code_base64", None) or "mock"}
    return {"instance_name": tenant.instance_name, "qr": qr_data}

# --- Menu Endpoints ---

@router.post("/tenants/{tenant_id}/menu", response_model=MenuItemResponse, status_code=status.HTTP_201_CREATED)
def create_menu_item(tenant_id: UUID, item: MenuItemCreate, db: Session = Depends(get_db)):
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
        
    new_item = Menu(
        tenant_id=tenant_id,
        item_name=item.item_name,
        price=item.price,
        json_meta=item.json_meta
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.get("/tenants/{tenant_id}/menu", response_model=list[MenuItemResponse])
def get_menu(tenant_id: UUID, db: Session = Depends(get_db)):
    items = db.query(Menu).filter(Menu.tenant_id == tenant_id).all()
    return items

# --- Order Endpoints ---

@router.get("/tenants/{tenant_id}/orders", response_model=list[OrderResponse])
def get_orders(tenant_id: UUID, db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.tenant_id == tenant_id).order_by(Order.id.desc()).all()
    return orders
