from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from models import *
from crud import *
from config.database import get_session
from config.auth import oauth2_scheme
from utils.enums import Roles, AuthStatus
from service.auth import AuthService
from service.users import UserService
from service.apartments import ApartmentService

# User and Auth
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

# House
def get_house_repository(db: Session = Depends(get_session)):
    return HouseRepository(model=House, session=db)

def get_house_addition_repository(db: Session = Depends(get_session)):
    return HouseRepository(model=HouseAddition, session=db)

def get_house_image_repository(db: Session = Depends(get_session)):
    return HouseRepository(model=HouseImage, session=db)

def get_house_addition_association_repository(db: Session = Depends(get_session)):
    return HouseRepository(model=HouseAdditionAssociation, session=db)

# Apartment
def get_apartment_repository(db: Session = Depends(get_session)):
    return ApartmentRepository(model=Apartment, session=db)

def get_apartment_parameter_repository(db: Session = Depends(get_session)):
    return ApartmentRepository(model=ApartmentParameter, session=db)

def get_apartment_image_repository(db: Session = Depends(get_session)):
    return ApartmentRepository(model=ApartmentImage, session=db)

def get_apartment_parameter_association_repository(db: Session = Depends(get_session)):
    return ApartmentRepository(model=ApartmentParameterAssociation, session=db)

def get_apartment_category_repository(db: Session = Depends(get_session)):
    return ApartmentRepository(model=ApartmentCategory, session=db)

def get_apartment_service(apartment_repository: ApartmentRepository = Depends(get_apartment_repository),
                          apartment_category_repository: ApartmentRepository = Depends(get_apartment_category_repository),
                          apartment_parameter_repository: ApartmentRepository = Depends(get_apartment_parameter_repository),
                          apartment_image_repository: ApartmentRepository = Depends(get_apartment_image_repository),
                          apartment_parameter_association_repository: ApartmentRepository = Depends(get_apartment_parameter_association_repository)) -> ApartmentService:
    return ApartmentService(apartment_repository = apartment_repository,
                            apartment_category_repository=apartment_category_repository,
                            apartment_parameter_repository=apartment_parameter_repository,
                            apartment_image_repository=apartment_image_repository,
                            apartment_parameter_association_repository=apartment_parameter_association_repository)


# Order
def get_order_repository(db: Session = Depends(get_session)):
    return OrderRepository(model=Order, session=db)


