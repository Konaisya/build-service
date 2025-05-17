from pydantic import BaseModel, Field, field_validator
from typing import List, Optional

class ApartmentCategoryResponse(BaseModel):
    id: int
    name: str

class CreateApartmentCategory(BaseModel):
    name: str

class UpdateApartmentCategory(BaseModel):
    name: Optional[str] = None


class ParameterResponse(BaseModel):
    id: int
    name: str

class CreateParameter(BaseModel):
    name: str

class UpdateParameter(BaseModel):
    name: Optional[str] = None


class ApartmentParameterResponse(BaseModel):
    parameter: ParameterResponse
    value: str

class ApartmentParameterForm(BaseModel):
    id_parameter: int
    value: str


class ApartmentImageResponse(BaseModel):
    id: int
    image: str

class ApartmentImageForm(BaseModel):
    id_apartment: int
    image: str

class ImageToDelete(BaseModel):
    ids_images: List[int]


class ApartmentResponse(BaseModel):
    id: int
    name: str
    description: str
    main_image: str
    rooms: int
    area: float
    id_house: int    
    count: int
    category: ApartmentCategoryResponse
    parameters: List[ApartmentParameterResponse]
    images: List[ApartmentImageResponse]

class CreateApartment(BaseModel):
    name: str
    description: str
    id_category: int
    rooms: int
    area: float
    id_house: int    
    count: int
    parameters: List[ApartmentParameterForm]

class UpdateApartment(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    main_image: Optional[str] = None
    id_category: Optional[int] = None
    rooms: Optional[int] = None
    area: Optional[float] = None
    id_house: Optional[int] = None    
    count: Optional[int] = None
    parameters: List[ApartmentParameterForm] = None
    images: List[ApartmentImageForm] = None

