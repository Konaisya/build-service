from fastapi import HTTPException
from utils.enums import AuthStatus
from passlib.hash import pbkdf2_sha256
from datetime import datetime, timedelta
import jwt
from config.auth import SECRET_KEY, ALGORITHM

class AuthService:
    def __init__(self, user_repository):
        self.user_repository = user_repository

    def create_user(self, data):
        from crud.users import UserRepository  # Ленивый импорт
        entity = data.model_dump()
        if self.user_repository.get_one_filter_by(email=entity['email']):
            raise HTTPException(status_code=400, detail={'status': AuthStatus.INVALID_EMAIL.value})
        entity['password'] = pbkdf2_sha256.hash(data.password)
        new_user = self.user_repository.create(entity)
        return new_user

    def login(self, name: str, password: str):
        user = self.user_repository.get_one_filter_by(name=name)
        if not user or not pbkdf2_sha256.verify(password, user.password):
            raise HTTPException(status_code=400, detail={'status': AuthStatus.INVALID_CREDENTIALS.value})
        token = self.create_token(user)
        update_token = self.create_update_token(user)
        return token, update_token

    def create_token(self, user):
        payload = {
            "sub": user.id,
            "exp": datetime.utcnow() + timedelta(minutes=30),
            "role": user.role
        }
        return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    def create_update_token(self, user):
        payload = {
            "sub": user.id,
            "exp": datetime.utcnow() + timedelta(days=7),
            "role": user.role
        }
        return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    def refresh_token(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user = self.user_repository.get_one_filter_by(id=payload["sub"])
            new_token = self.create_token(user)
            update_token = self.create_update_token(user)
            return new_token, update_token
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail={'status': AuthStatus.TOKEN_EXPIRED.value})
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail={'status': AuthStatus.INVALID_TOKEN.value})

    def get_user_by_token(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user = self.user_repository.get_one_filter_by(id=payload["sub"])
            return user
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail={'status': AuthStatus.TOKEN_EXPIRED.value})
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail={'status': AuthStatus.INVALID_TOKEN.value})