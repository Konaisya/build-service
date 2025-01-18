from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from schemas.apartments import Apartment

class HouseCreate(BaseModel):
    name: str = Field(max_length=255)
    description: Optional[str] = None
    image: Optional[str] = Field(default="placeholder.png", max_length=255)
    status: str = Field(max_length=255)
    address: str = Field(max_length=255)
    floors: int = Field(ge=1)
    id_addition: int = Field(ge=1)
    id_apartment: int = Field(ge=1)
    max_price: Optional[float] = Field(default=None, ge=0.0)

class HouseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    status: Optional[str] = None
    address: Optional[str] = None
    floors: Optional[int] = None
    id_addition: Optional[int] = None
    id_apartment: Optional[int] = None
    max_price: Optional[float] = None

    @field_validator('name')
    @classmethod
    def name_len_validate(cls, val: str) -> str:
        if (len(val) > 255):
            raise ValueError('Name must be less than 255 characters')
        return val
    
    @field_validator('floors')
    @classmethod
    def floors_validate(cls, val: int) -> int:
        if (val < 1):
            raise ValueError("Floors must be greater than 0")
        return val
    
    @field_validator('id_addition')
    @classmethod
    def id_addition_validate(cls, val: int) -> int:
        if (val < 1):
            raise ValueError("Addition id must be greater than 0")
        return val

    @field_validator('id_apartment')
    @classmethod
    def id_addition_validate(cls, val: int) -> int:
        if (val < 1):
            raise ValueError("Apartment id must be greater than 0")
        return val
    
    @field_validator('max_price')
    @classmethod
    def id_addition_validate(cls, val: float) -> float:
        if (val < 0.0):
            raise ValueError("Max price must be greater than 0.0")
        return val
    
class AdditionCreate(BaseModel):
    name: str = Field(max_length=255)
    description: Optional[str] = None
    price: float = Field(ge=0.0)

class AdditionUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None
    
    @field_validator('name')
    @classmethod
    def name_len_validate(cls, val: str) -> str:
        if (len(val) > 255):
            raise ValueError('Name must be less than 255 characters')
        return val
    
    @field_validator('price')
    @classmethod
    def id_addition_validate(cls, val: float) -> float:
        if (val < 0.0):
            raise ValueError("Price must be greater than 0.0")
        return val

class Addition(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float

class House(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    image: Optional[str] = 'placeholder.png'
    status: str
    address: str
    floors: int
    addition: Addition
    Apartment: Apartment
    max_price: float
