from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from utils.image import save_image
from dependencies import ApartmentService, get_apartment_service
from utils.enums import Status
from schemas.apartments import *
from schemas.apartments import *

router = APIRouter()

@router.post('/', status_code=201)
async def create_apartment_parameter(data: CreateParameter,
                            apartment_service: ApartmentService = Depends(get_apartment_service)):
    new_parameter = apartment_service.create_parameter(data)
    if new_parameter == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return Status.SUCCESS.value

@router.get('/', status_code=200, response_model=list[ParameterResponse])
async def get_all_apartment_parameters(name: str | None = Query(None), 
                             apartment_service: ApartmentService = Depends(get_apartment_service)):
    filter = {k: v for k, v in locals().items() if v is not None and k != 'apartment_service'}
    parameters = apartment_service.get_all_parameters_filter_by(**filter)
    if not parameters:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = [ParameterResponse(**parameter.__dict__) for parameter in parameters]
    return response

@router.get('/{id}', status_code=200, response_model=ParameterResponse)
async def get_apartment_parameter(id: int, apartment_service: ApartmentService = Depends(get_apartment_service)):
    parameter = apartment_service.get_one_parameter_filter_by(id=id)
    if not parameter:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = ParameterResponse(**parameter.__dict__)
    return response

@router.put('/{id}', status_code=200)
async def update_apartment_parameter(id: int, data: UpdateParameter,
                          apartment_service: ApartmentService = Depends(get_apartment_service)):
    parameter = apartment_service.get_one_parameter_filter_by(id=id)
    if not parameter:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    update_parameter = apartment_service.update_parameter(id, data)
    return update_parameter

@router.delete('/{id}', status_code=200)
async def delete_apartment_parameter(id: int, apartment_service: ApartmentService = Depends(get_apartment_service)):
    parameter = apartment_service.get_one_parameter_filter_by(id=id)
    if not parameter:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    apartment_service.delete_parameter(id)
    return {'status': Status.SUCCESS.value}
