from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from schemas.apartments import ApartmentResponse
from datetime import date
from utils.enums import HouseStatus

class AttributeResponse(BaseModel):
    id: int
    name: str
    description: str

class CreateAttribute(BaseModel):
    name: str
    description: str

class UpdateAttribute(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class HouseAttributeResponse(BaseModel):
    attribute: AttributeResponse
    value: str

class HouseAttributeForm(BaseModel):
    id_attribute: int
    value: str


class HouseImageResponse(BaseModel):
    id: int
    image: str

class HouseImageForm(BaseModel):
    id_house: int
    image: str

class ImageToDelete(BaseModel):
    ids_images: List[int]


class HouseResponse(BaseModel):
    id: int
    name: str
    description: str
    main_image: str
    status: HouseStatus
    is_order: bool
    district: str
    address: str
    floors: int
    entrances: int
    begin_date: date
    end_date: date
    start_price: float
    final_price: float
    attributes: List[HouseAttributeResponse]
    images: List[HouseImageResponse]
    apartments: List[ApartmentResponse]

class CreateHouse(BaseModel):
    name: str
    description: str
    status: HouseStatus
    is_order: bool = False
    district: str
    address: str
    floors: int
    entrances: int
    begin_date: date
    end_date: date
    start_price: float
    final_price: Optional[float] = None
    attributes: List[HouseAttributeForm]

class UpdateHouse(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    main_image: Optional[str] = None
    status: Optional[HouseStatus] = None
    is_order: Optional[bool] = None
    district: Optional[str] = None
    address: Optional[str] = None
    floors: Optional[int] = None
    entrances: Optional[int] = None
    begin_date: Optional[date] = None
    end_date: Optional[date] = None
    start_price: Optional[float] = None
    final_price: Optional[float] = None
    attributes: List[HouseAttributeForm] = []
    images: List[HouseImageForm] = []

class ShortHouseResponse(BaseModel):
    id: int
    name: str
    main_image: str
    status: HouseStatus
    is_order: bool
    district: str
    address: str
    floors: int
    entrances: int
    begin_date: date
    end_date: date
    start_price: float
    final_price: float