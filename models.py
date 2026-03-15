import uuid
from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from database import Base

class Tenant(Base):
    __tablename__ = "tenants"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    instance_name = Column(String, unique=True, index=True, nullable=False)
    api_key = Column(String, nullable=False)
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
