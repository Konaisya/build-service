from routers.auth import router as auth_router
from routers.users import router as user_router
from routers.apartments import router as apartment_router
from routers.houses import router as house_router
from routers.orders import router as order_router
from routers.attributes import router as attribute_router
from routers.parameters import router as parameter_router
from routers.apartment_category import router as apartment_category_router
from fastapi import APIRouter

routers = APIRouter(prefix='/api')
routers.include_router(auth_router, prefix='/auth', tags=['auth'])
routers.include_router(user_router, prefix='/users', tags=['users'])
routers.include_router(apartment_router, prefix='/apartments', tags=['apartments'])
routers.include_router(house_router, prefix='/houses', tags=['houses'])
routers.include_router(order_router, prefix='/orders', tags=['orders'])
routers.include_router(attribute_router, prefix='/house_attributes', tags=['house_attributes'])
routers.include_router(parameter_router, prefix='/apartment_parameters', tags=['apartment_parameters'])
routers.include_router(apartment_category_router, prefix='/apartment_category', tags=['apartment_category'])