from service.auth import AuthService
from service.users import UserService
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from models.users import User
from models.orders import Order
from models.apartments import Apartment, ApartmentImage, ApartmentParameter, ApartmentCategory, ApartmentParameterAssociation
from models.houses import House, HouseImage, HouseAddition, HouseAdditionAssociation, HouseImage
from crud.users import UserRepository
from config.database import get_session
from config.auth import oauth2_scheme
from utils.enums import Roles, AuthStatus

def get_user_repository(db: Session = Depends(get_session)):
    return UserRepository(model=User, session=db)

def get_auth_service(user_repository: UserRepository = Depends(get_user_repository)) -> AuthService:
    return AuthService(user_repository=user_repository)

def get_current_user(token: str=Depends(oauth2_scheme), user_repository: UserRepository = Depends(get_user_repository)) -> User:
    service = AuthService(user_repository=user_repository)
    return service.get_user_by_token(token)

def get_current_admin(token: str=Depends(oauth2_scheme), user_repository: UserRepository = Depends(get_user_repository)) -> User:
    service = AuthService(user_repository=user_repository)
    user = service.get_user_by_token(token)
    if user.role != Roles.ADMIN.value:
        raise HTTPException(status_code=403, detail={'status': AuthStatus.FORBIDDEN.value})
    return user

def get_user_service(user_repository: UserRepository = Depends(get_user_repository)) -> UserService:
    return UserService(user_repository=user_repository)
