from database import engine, Base
from models import Tenant, Order, Menu
Base.metadata.create_all(bind=engine)
print("Tables created successfully")
