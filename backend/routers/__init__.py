from routers.auth import router as auth_router
from routers.users import router as user_router
from routers.apartments import router as apartment_router
from fastapi import APIRouter

routers = APIRouter(prefix='/api')
routers.include_router(auth_router, prefix='/auth', tags=['auth'])
routers.include_router(user_router, prefix='/users', tags=['users'])
routers.include_router(apartment_router, prefix='/apartments', tags=['apartments'])