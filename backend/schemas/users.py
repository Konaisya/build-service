from pydantic import BaseModel, Field, field_validator
import re
from typing import Optional
from utils.enums import Roles

class UserCreate(BaseModel):
    name: str = Field(max_length=255)
    org_name: Optional[str] = None
    role: Roles = Field(default=Roles.USER, max_length=255)
    email: str = Field(max_length=255)
    password: str = Field(max_length=32)
    
    @field_validator('name')
    @classmethod
    def name_len_validate(cls, val: str) -> str:
        if (len(val) > 255):
            raise ValueError('Name must be less than 255 characters')
        return val

    @field_validator('email')
    @classmethod
    def validate_email(cls, val: str):
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', val):
            raise ValueError('Invalid email address')
        return val

    @field_validator('password')
    @classmethod
    def validate_password(cls, val: str):
        if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$', val):
            raise ValueError('Invalid password')
        return val 
    
class UserUpdate(BaseModel):
    name: Optional[str] = None
    org_name: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None

    @field_validator('name')
    @classmethod
    def name_len_validate(cls, val: str) -> str:
        if (len(val) > 255):
            raise ValueError('Name must be less than 255 characters')
        return val
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, val: str):
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', val):
            raise ValueError('Invalid email address')
        return val

    @field_validator('password')
    @classmethod
    def validate_password(cls, val: str):
        if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$', val):
            raise ValueError('Invalid password')
        return
    
class UserLogin(BaseModel):
    email: str
    password: str
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, val: str):
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', val):
            raise ValueError('Invalid email address')
        return val

    @field_validator('password')
    @classmethod
    def validate_password(cls, val: str):
        if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$', val):
            raise ValueError('Invalid password')
        return val
    
class User(BaseModel):
    id: int
    name: str
    org_name: Optional[str]
    role: str
    email: str
    password: str