from pydantic import BaseModel, Field, field_validator
from typing import List, Optional

class ApartmentParameter(BaseModel):
    id: int
    name: str
    status: str

class ApartmentCategory(BaseModel): 
    id: int
    name: str    

class ApartmentImage(BaseModel):
    id: int
    image: str
    id_apartment: int

class Apartment(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    category: ApartmentCategory
    rooms: int
    area: float
    parameters: List[ApartmentParameter]
    id_house: int
    count: int
    images: List[ApartmentImage] = []


class ApartmentImageCreate(BaseModel):
    image: str = Field(max_length=255)
    id_apartment: int = Field(ge=1)

class ApartmentImageUpdate(BaseModel):
    image: Optional[str] = None
    id_apartment: Optional[int] = None


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

class CreateApartment(BaseModel):
    name: str = Field(max_length=255)
    description: Optional[str] = None
    id_category: int = Field(ge=1)
    rooms: int = Field(ge=1)
    area: float = Field(ge=0.0) 
    id_house: int = Field(ge=1)
    parameter_ids: List[int] = Field(default_factory=list)
    count: int = Field(ge=1)

class UpdateApartment(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None  
    id_category: Optional[int] = None
    rooms: Optional[int] = None
    area: Optional[float] = None
    id_house: Optional[int] = None
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
    
    @field_validator('id_house')
    @classmethod
    def house_id_validate(cls, val: int) -> int:
        if (val < 1):
            raise ValueError("House id must be greater than 0")
        return val
    
    @field_validator('count')
    @classmethod
    def count_validate(cls, val: int) -> int:
        if (val < 1):
            raise ValueError("Count must be greater than 0")
        return val
