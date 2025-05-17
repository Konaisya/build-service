from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from typing import List
from utils.image import save_image
from dependencies import OrderService, get_order_service, HouseService, get_house_service, UserService, get_user_service
from utils.enums import Status, OrderStatus, HouseStatus
from schemas.orders import *
from schemas.houses import UpdateHouse
from datetime import datetime

router = APIRouter()

@router.post('/', status_code=201)
async def create_order(data: CreateOrder,
                       order_service: OrderService = Depends(get_order_service),
                       house_service: HouseService = Depends(get_house_service)):
    data = data.model_dump()
    data['id_user'] = 1
    data['status'] = OrderStatus.PENDING.value
    data['create_date'] = datetime.now().strftime('%Y-%m-%d')

    house = data.pop('house')
    house['status'] = HouseStatus.PROJECT.value
    house['is_order'] = True
    create_house = house_service.create_house(CreateHouse(**house))
    if not create_house:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value, 'message': 'House not created'})
    data['id_house'] = create_house.id
    create_order = order_service.create_order(data)
    if not create_order:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value, 'message': 'Order not created'})
    return Status.SUCCESS.value

@router.get('/', status_code=200, response_model=List[OrderResponse])
async def get_all_orders(id_user: int | None = Query(None),
                         id_house: int | None = Query(None),
                         status: OrderStatus | None = Query(None),
                         contract_price: float | None = Query(None),
                         create_date: date | None = Query(None),
                         update_date: date | None = Query(None),
                         order_service: OrderService = Depends(get_order_service),
                         house_service: HouseService = Depends(get_house_service),
                         user_service: UserService = Depends(get_user_service),
                         ):
    filter = {k: v for k, v in locals().items() if v is not None and k 
                not in {'order_service', 'house_service', 'user_service', 'user'}}
    orders = order_service.get_all_orders_filter_by(**filter)
    if not orders:
        raise HTTPException(status_code=404, detail={'status': Status.FAILED.value})
    response = []
    for order in orders:
        user = user_service.get_user_filter_by(id=order.id_user)
        user_resp = UserResponse(**user.__dict__)

        house = house_service.get_one_house_filter_by(id=order.id_house)
        house_resp = ShortHouseResponse(**house.__dict__)

        order_resp = order.__dict__
        order_resp.update({
            'user': user_resp,
            'house': house_resp
        })
        response.append(OrderResponse(**order_resp))
    return response

@router.get('/{id}', status_code=200, response_model=OrderResponse)
async def get_one_order(id: int,
                        order_service: OrderService = Depends(get_order_service),
                        house_service: HouseService = Depends(get_house_service),
                        user_service: UserService = Depends(get_user_service)):
    order = order_service.get_one_order_filter_by(id=id)
    if not order:
        raise HTTPException(status_code=404, detail={'status': Status.FAILED.value})
    user = user_service.get_user_filter_by(id=order.id_user)
    user_resp = UserResponse(**user.__dict__)

    house = house_service.get_one_house_filter_by(id=order.id_house)
    house_resp = ShortHouseResponse(**house.__dict__)

    order_resp = order.__dict__
    order_resp.update({
        'user': user_resp,
        'house': house_resp
    })
    return OrderResponse(**order_resp)

@router.put('/{id}', status_code=200)
async def update_order(id: int,
                       data: UpdateOrder,
                       order_service: OrderService = Depends(get_order_service),
                       house_service: HouseService = Depends(get_house_service)):
    order = order_service.get_one_order_filter_by(id=id)
    if not order:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    data = data.model_dump()
    data['update_date'] = datetime.now().strftime('%Y-%m-%d')
    if 'status' in data:
        new_status = data['status']
        if new_status == OrderStatus.PAID.value:
            data['payment_date'] = datetime.now().strftime('%Y-%m-%d')
        elif new_status == OrderStatus.COMPLETED.value:
            data['completion_date'] = datetime.now().strftime('%Y-%m-%d')
            house_service.update_house(order.id_house, UpdateHouse(status=HouseStatus.BUILT.value))
        elif new_status == OrderStatus.SIGNED.value:
            data['sign_off_date'] = datetime.now().strftime('%Y-%m-%d')
    order_service.update_order(id, data)
    return Status.SUCCESS.value

@router.delete('/{id}', status_code=200)
async def delete_order(id: int,
                        order_service: OrderService = Depends(get_order_service)):
    order = order_service.get_one_order_filter_by(id=id)
    if not order:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    order_service.delete_order(id)
    return Status.SUCCESS.value