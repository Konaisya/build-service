from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from utils.enums import HouseStatus

class HouseImageCreate(BaseModel):
    image: str = Field(max_length=255)
    id_house: int = Field(ge=1)

class HouseImageUpdate(BaseModel):
    image: Optional[str] = None
    id_house: Optional[int] = None

class HouseImage(BaseModel):
    id: int 
    image: str
    id_house: int


class AdditionCreate(BaseModel):
    name: str = Field(max_length=255)
    description: Optional[str] = None
    status: str = Field(max_length=255)
    price: float = Field(ge=0.0)

class AdditionUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
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
    status: str
    price: float


class HouseCreate(BaseModel):
    name: str = Field(max_length=255)
    description: Optional[str] = None
    image: Optional[str] = Field(default="placeholder.png", max_length=255)
    status: HouseStatus
    address: str = Field(max_length=255)
    floors: int = Field(ge=1)
    addition_ids: Optional[List[int]] = Field(None)
 
    max_price: Optional[float] = Field(default=None, ge=0.0)

class HouseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    status: Optional[HouseStatus] = None
    address: Optional[str] = None
    floors: Optional[int] = None
    id_addition: Optional[int] = None
    max_price: Optional[float] = None
    addition_ids: Optional[List[int]] = Field(None)

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
    
    @field_validator('max_price')
    @classmethod
    def id_addition_validate(cls, val: float) -> float:
        if (val < 0.0):
            raise ValueError("Max price must be greater than 0.0")
        return val

class House(BaseModel):
    from schemas.apartments import Apartment

    id: int
    name: str
    description: Optional[str] = None
    status: HouseStatus
    address: str
    floors: int
    max_price: float
    additions: List[Addition]
    apartments: List[Apartment]
    images: List[HouseImage]
