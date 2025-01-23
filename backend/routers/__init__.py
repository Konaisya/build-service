from routers.auth import router as auth_router
from fastapi import APIRouter

routers = APIRouter(prefix='/api')
routers.include_router(auth_router, prefix='/auth', tags=['auth'])