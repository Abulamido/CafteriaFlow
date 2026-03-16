import uuid
from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from database import Base

class Tenant(Base):
    __tablename__ = "tenants"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    tenant_type = Column(String, default="EVOLUTION") # EVOLUTION, META
    
    # Evolution Fields
    instance_name = Column(String, unique=True, index=True, nullable=True)
    api_key = Column(String, nullable=True)
    qr_code_base64 = Column(String, nullable=True)
    
    # Meta Fields
    phone_number_id = Column(String, unique=True, index=True, nullable=True)
    waba_id = Column(String, nullable=True)
    access_token = Column(String, nullable=True)
    
    sys_prompt = Column(String, nullable=True)

    menus = relationship("Menu", back_populates="tenant")
    orders = relationship("Order", back_populates="tenant")

class Menu(Base):
    __tablename__ = "menus"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    item_name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    json_meta = Column(JSONB, nullable=True)

    tenant = relationship("Tenant", back_populates="menus")

class Order(Base):
    __tablename__ = "orders"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    customer_phone = Column(String, nullable=False)
    items = Column(JSONB, nullable=False)
    total = Column(Float, nullable=False)

    tenant = relationship("Tenant", back_populates="orders")
