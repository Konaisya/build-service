from pydantic import BaseModel, Field, field_validator
from datetime import date
from utils.enums import OrderStatus
from typing import Optional
import pytz
from schemas.users import UserResponse
from schemas.houses import ShortHouseResponse, CreateHouse

class OrderResponse(BaseModel):
    id: int
    user: UserResponse
    house: ShortHouseResponse
    status: OrderStatus
    contract_price: float
    create_date: date
    update_date: Optional[date] = None

class CreateOrder(BaseModel):
    house: CreateHouse
    contract_price: float

class UpdateOrder(BaseModel):
    status: OrderStatus
    contract_price: Optional[float] = None
    
