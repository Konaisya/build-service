from fastapi import APIRouter, Depends, HTTPException, Query
from dependencies import UserService, get_user_service, get_current_user
from schemas.users import UserResponse, UserUpdate
from utils.enums import AuthStatus, Roles, Status

router = APIRouter()

@router.get('/me')
async def get_me(user_service: UserService = Depends(get_user_service), user = Depends(get_current_user)):
    user_info = user_service.get_user_filter_by(id=user.id)
    if not user_info:
        raise HTTPException(status_code=404, detail={'status': AuthStatus.USER_NOT_FOUND.value})
    return UserResponse(**user_info.__dict__) 

@router.put('/')
async def update_user(data: UserUpdate, user_id: int = Query(None), user_service: UserService = Depends(get_user_service), user = Depends(get_current_user)):
    if not user_id:
        user_id = user.id
    if not user_id == user.id and user.role != Roles.ADMIN.value:
        raise HTTPException(status_code=403, detail={'status': AuthStatus.FORBIDDEN.value})
    update_user = user_service.update(user_id, data)
    return {'status': Status.SUCCESS.value, 'data': update_user}

@router.get('/all')
async def get_all_users(user_service: UserService = Depends(get_user_service), user = Depends(get_current_user)):
    if user.role != Roles.ADMIN.value:
        raise HTTPException(status_code=403, detail={'status': AuthStatus.FORBIDDEN.value})
    users = user_service.get_all_users_filter_by()
    response = []
    for user in users:
        response.append(UserResponse(**user.__dict__))
    return response

@router.put('/updatename')
async def update_current_user(name: str, user_service: UserService = Depends(get_user_service), user = Depends(get_current_user)):
    data = UserUpdate(name=name)
    updated_user = user_service.update(user.id, data)
    return {'status': Status.SUCCESS.value, 'data': updated_user}

@router.delete('/')
async def delete_user(user_id: int = Query(None), user_service: UserService = Depends(get_user_service), user = Depends(get_current_user)):
    if not user_id:
        user_id = user.id
    if not user_id == user.id and user.role != Roles.ADMIN.value:
        raise HTTPException(status_code=403, detail={'status': AuthStatus.FORBIDDEN.value})
    user_service.delete_user(user_id)
    return {'status': Status.SUCCESS.value}