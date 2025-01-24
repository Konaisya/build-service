from utils.abstract_repository import IREpository
from models.users import User
from schemas.users import UserCreate, User, UserLogin, UserUpdate
from utils.enums import Roles, AuthStatus
from dependencies import UserRepository
from fastapi import HTTPException
from passlib.hash import pbkdf2_sha256

class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def get_all_users_filter_by(self, **filter):
        users = self.user_repository.get_all_filter_by(**filter)
        return users
    
    def get_one_user_filter_by(self, **filter):
        user = self.user_repository.get_one_filter_by(**filter)
        return user
    
    def update(self, user_id: int, data: UserUpdate):
        entity = data.model_dump()
        user = self.user_repository.get_one_filter_by(id=user_id)
        if data.password and not pbkdf2_sha256.verify(data.password, user.password):
            raise HTTPException(status_code=403, detail={'status': AuthStatus.INVALID_PASSWORD.value})
        if data.password:
            entity['password'] = pbkdf2_sha256.hash(data.password)
        entity['id'] = user_id
        entity = {k: v for k, v in entity.items() if v is not None}
        return self.user_repository.update(entity)
    
    def delete(self, user_id: int):
        return self.user_repository.delete(user_id)
    
    