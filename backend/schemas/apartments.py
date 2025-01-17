from pydantic import BaseModel, Field, field_validator
from typing import List, Optional

class CreateApartment(BaseModel):
    name: str = Field(max_length=255)
    description: Optional[str] = None
    image: Optional[str] = Field(default="placeholder.png", max_length=255)
    id_category: int = Field(ge=1)
    rooms: int = Field(ge=1)
    area: float = Field(ge=0.0) 
    id_apartment_parameters: int = Field(ge=1)
    count: int = Field(ge=1)

class UpdateApartment(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None  
    image: Optional[str] = None
    id_category: Optional[int] = None
    rooms: Optional[int] = None
    area: Optional[float] = None
    id_apartment_parameters: Optional[int] = None
    count: Optional[int] = None
    
    @field_validator('name')
    @classmethod
    def name_len_validate(cls, val: str) -> str:
        if (len(val) > 255):
            raise ValueError('Name must be less than 255 characters')
        return val
    
    @field_validator('id_category')
    @classmethod
    def category_id_validate(cls, val: int) -> int:
        if (val < 1):
            raise ValueError("Category id must be greater than 0")
        return val
    
    @field_validator('rooms')
    @classmethod
    def rooms_validate(cls, val: int) -> int:
        if (val < 1):
            raise ValueError("Rooms must be greater than 0")
        return val
    
    @field_validator('area')
    @classmethod
    def area_validate(cls, val: float) -> float:
        if (val < 0.0):
            raise ValueError("Area must be greater than 0.0")
        return val
    
    @field_validator('id_apartment_parameters')
    @classmethod
    def apartment_parameters_id_validate(cls, val: int) -> int:
        if (val < 1):
            raise ValueError("Apartment parameters id must be greater than 0")
        return val
    
    @field_validator('count')
    @classmethod
    def count_validate(cls, val: int) -> int:
        if (val < 1):
            raise ValueError("Count must be greater than 0")
        return val
    
class ApartmentCategoryCreate(BaseModel):
    name: str = Field(max_length=255)

class ApartmentCategoryUpdate(BaseModel):
    name: Optional[str] = None
    
    @field_validator('name')
    @classmethod
    def name_len_validate(cls, val: str) -> str:
        if (len(val) > 255):
            raise ValueError('Name must be less than 255 characters')
        return val
    
class ApartmentParameterCreate(BaseModel):
    name: str = Field(max_length=255)
    status: str = Field(max_length=255)

class ApartmentParameterUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    
    @field_validator('name')
    @classmethod
    def name_len_validate(cls, val: str) -> str:
        if (len(val) > 255):
            raise ValueError('Name must be less than 255 characters')
        return val
    
class ApartmentCategory(BaseModel):
    id: int
    name: str

class ApartmentParameter(BaseModel):
    id: int
    name: str
    status: str

class Apartment(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    image: Optional[str] = 'placeholder.png'
    ApartmentCategory: ApartmentCategory
    rooms: int
    area: float
    ApartmentParameter: ApartmentParameter
    count: int
