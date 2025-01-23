from schemas.users import UserCreate, User, UserLogin
from dependencies import UserRepository
from passlib.hash import pbkdf2_sha256
from config.auth import EXPIRATION_TIME, SECRET_KEY, UPDATE_EXPIRATION_TIME
import jwt
from datetime import datetime
from utils.enums import AuthStatus
from fastapi import HTTPException

class AuthService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def create_user(self, user: UserCreate):
        user.password = pbkdf2_sha256.hash(user.password)
        return self.user_repository.create(user)
    
    def get_user_filter_by(self, **filter):
        return self.user_repository.filter_by(**filter)
    
    def gen_token(self, user: User):
        payload = {
            "sub": user.id,
            "exp": datetime.now() + EXPIRATION_TIME,
            'role': user.role
        }
        return jwt.encode(payload, SECRET_KEY, algorithm="HS256")\
    
    def decode_token(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail={'status': AuthStatus.TOKEN_EXPIRED.value})
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail={'status': AuthStatus.INVALID_TOKEN.value})
        
    def get_user_by_token(self, token: str):
        payload = self.decode_token(token)
        user = self.get_user_filter_by(id=payload['sub'])
        if not user:
            raise HTTPException(status_code=401, detail={'status': AuthStatus.USER_NOT_FOUND.value})
        return user
    
    def gen_update_token(self, user: User):
        payload = {
            "sub": user.id,
            "exp": datetime.now() + UPDATE_EXPIRATION_TIME,
        }
        return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    
    def login(self, user: UserLogin):
        user = self.get_user_filter_by(email=user.email)
        if not user:
            raise HTTPException(status_code=401, detail={'status': AuthStatus.INVALID_EMAIL_OR_PASSWORD.value})
        if not pbkdf2_sha256.verify(user.password, user.password):
            raise HTTPException(status_code=401, detail={'status': AuthStatus.INVALID_EMAIL_OR_PASSWORD.value})
        token = self.gen_token(user)
        return {
            'access_token': token,
            'token_type': 'bearer',
            'expires': EXPIRATION_TIME.total_seconds()
        }, self.gen_update_token(user)
    
    def refresh_token(self, token: str):
        payload = self.decode_token(token)
        user = self.get_user_filter_by(id=payload['sub'])
        if not user:
            raise HTTPException(status_code=401, detail={'status': AuthStatus.USER_NOT_FOUND.value})
        self.gen_token(user)
        return {
            'access_token': token,
            'token_type': 'bearer',
            'expires': EXPIRATION_TIME.total_seconds()
        }, self.gen_update_token(user)