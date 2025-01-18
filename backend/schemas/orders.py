from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from utils.enums import OrderStatus
from typing import Optional
import pytz

class OrderCreate(BaseModel):
    id_user: int = Field(ge=1)
    id_house: int = Field(ge=1)
    status: OrderStatus = Field(default=OrderStatus.PENDING)
    min_price: float = Field(ge=0.0)
    max_price: Optional[float] = Field(default=None, ge=0.0)
    begin_date: datetime = Field(default_factory=datetime.now)
    end_date: datetime

    @field_validator("begin_date")
    def validate_begin_date(cls, value):
        if datetime.strptime(value, "%Y-%m-%d").date() < datetime.now().date():
            raise ValueError("Begin date must be greater than or equal to the current date")
        return value
    
    @field_validator("end_date")
    def validate_end_date(cls, value, values):
        if datetime.strptime(value, "%Y-%m-%d").date() < datetime.strptime(values["begin_date"], "%Y-%m-%d").date():
            raise ValueError("End date must be greater than or equal to the begin date")
        return value
    
class OrderUpdate(BaseModel):
    id_user: Optional[int] = None
    id_house: Optional[int] = None
    status: Optional[OrderStatus] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    begin_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

    @field_validator("begin_date")
    def validate_begin_date(cls, value):
        if datetime.strptime(value, "%Y-%m-%d").date() < datetime.now().date():
            raise ValueError("Begin date must be greater than or equal to the current date")
        return value
    
    @field_validator("end_date")
    def validate_end_date(cls, value, values):
        if datetime.strptime(value, "%Y-%m-%d").date() < datetime.strptime(values["begin_date"], "%Y-%m-%d").date():
            raise ValueError("End date must be greater than or equal to the begin date")
        return value
    
class Order(BaseModel):
    id: int
    id_user: int
    id_house: int
    status: OrderStatus
    min_price: float
    max_price: float
    begin_date: str
    end_date: str