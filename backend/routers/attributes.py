from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from utils.image import save_image
from dependencies import HouseService, get_house_service
from utils.enums import Status
from schemas.houses import *

router = APIRouter()

@router.post('/', status_code=201)
async def create_house_attribute(data: CreateAttribute,
                            house_service: HouseService = Depends(get_house_service)):
    new_attribute = house_service.create_attribute(data)
    if new_attribute == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return Status.SUCCESS.value

@router.get('/', status_code=200, response_model=list[AttributeResponse])
async def get_all_house_attributes(name: str | None = Query(None), 
                             house_service: HouseService = Depends(get_house_service)):
    filter = {k: v for k, v in locals().items() if v is not None and k != 'house_service'}
    attributes = house_service.get_all_attributes_filter_by(**filter)
    if not attributes:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = [AttributeResponse(**attribute.__dict__) for attribute in attributes]
    return response

@router.get('/{id}', status_code=200, response_model=AttributeResponse)
async def get_house_attribute(id: int, house_service: HouseService = Depends(get_house_service)):
    attribute = house_service.get_one_attribute_filter_by(id=id)
    if not attribute:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = AttributeResponse(**attribute.__dict__)
    return response

@router.put('/{id}', status_code=200)
async def update_house_attribute(id: int, data: UpdateAttribute,
                          house_service: HouseService = Depends(get_house_service)):
    attribute = house_service.get_one_attribute_filter_by(id=id)
    if not attribute:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    update_attribute = house_service.update_attribute(id, data)
    return update_attribute

@router.delete('/{id}', status_code=200)
async def delete_house_attribute(id: int, house_service: HouseService = Depends(get_house_service)):
    attribute = house_service.get_one_attribute_filter_by(id=id)
    if not attribute:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    house_service.delete_attribute(id)
    return {'status': Status.SUCCESS.value}
