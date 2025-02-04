from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from utils.image import save_image
from dependencies import ApartmentService, get_apartment_service
from utils.enums import Status
from schemas.apartments import *
import os

router = APIRouter()

# Apartment Category
@router.get('/categories', status_code=200)
async def get_all_category(name: str | None = Query(None),
                           apartment_service: ApartmentService = Depends(get_apartment_service)):
    filter = {}
    if name:
        filter['name'] = name
    return apartment_service.get_all_apartment_category_filter_by(**filter)

@router.get('/categories/{id}', status_code=200)
async def get_category(id_category: int, apartment_service: ApartmentService = Depends(get_apartment_service)):
    category = apartment_service.get_one_apartment_category_filter_by(id=id_category)
    if not category:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    return category

@router.post('/categories', status_code=201)
async def create_category(new_category: ApartmentCategoryCreate, 
                          apartment_service: ApartmentService = Depends(get_apartment_service)):
    service, category = apartment_service.create_apartment_category(new_category)
    if service == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return {'status': Status.SUCCESS.value, 'category': category}

@router.patch('/categories/{id}', status_code=200)
async def update_category(id_category: int, update_data: ApartmentCategoryUpdate, 
                          apartment_service: ApartmentService = Depends(get_apartment_service)):
    category = apartment_service.get_one_apartment_category_filter_by(id=id_category)
    if not category:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    update_category = apartment_service.update_apartment_category(id=id_category, data=update_data)
    return {'status': Status.SUCCESS.value, 'category': update_category}

@router.delete('/categories/{id}', status_code=200)
async def delete_category(id: int, apartment_service: ApartmentService = Depends(get_apartment_service)):
    category = apartment_service.get_one_apartment_category_filter_by(id=id)
    if not category:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    apartment_service.delete_apartment_category(id)
    return {'status': Status.SUCCESS.value}


# Apartment Parameters
@router.get('/parameters', status_code=200)
async def get_all_parameters(name: str | None = Query(None),
                             apartment_service: ApartmentService = Depends(get_apartment_service)):
    filter = {}
    if name:
        filter['name'] = name
    return apartment_service.get_all_apartment_parameters_filter_by(**filter)

@router.get('/parameters{id}', status_code=200)
async def get_parameter(id_parameter: int, apartment_service: ApartmentService = Depends(get_apartment_service)):
    parameter = apartment_service.get_one_apartment_parameter_filter_by(id=id_parameter)
    if not parameter:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    return parameter

@router.post('/parameters', status_code=201)
async def create_parameter(new_parameter: ApartmentParameterCreate,
                           apartment_service: ApartmentService = Depends(get_apartment_service)):
    service, parameter = apartment_service.create_apartment_parameter(new_parameter)
    if service == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return parameter

@router.patch('/parameters/{id}', status_code=200)
async def update_parameter(id_parameter: int, update_data: ApartmentParameterUpdate,
                           apartment_service: ApartmentService = Depends(get_apartment_service)):
    parameter = apartment_service.get_one_apartment_parameter_filter_by(id=id_parameter)
    if not parameter:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    update_parameter = apartment_service.update_apartment_parameter(id_parameter, update_data)
    return {'status': Status.SUCCESS.value, 'parameter': parameter}

@router.delete('/parameter/{id}', status_code=200)
async def delete_parameter(id_parameter: int, apartment_service: ApartmentService = Depends(get_apartment_service)):
    parameter = apartment_service.get_one_apartment_parameter_filter_by(id=id_parameter)
    if not parameter:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    apartment_service.delete_apartment_parameter(id=id_parameter)
    return {'status': Status.SUCCESS.value}


# Apartment
@router.get('/', status_code=200)
async def get_all_apartments(name: str | None = Query(None),
                             id_category: int | None = Query(None),
                             rooms: int | None = Query(None),
                             area: float | None = Query(None),
                             id_house: int | None = Query(None),
                             apartment_service: ApartmentService = Depends(get_apartment_service)):
    filter = {k: v for k, v in {
        "name": name,
        "id_category": id_category,
        "rooms": rooms,
        "area": area,
        "id_house": id_house,
    }.items() if v is not None}
    apartments = apartment_service.get_all_apartment_filter_by(**filter)
    response = []
    for apart in apartments:
        category = apartment_service.get_one_apartment_category_filter_by(id=apart.id_category)
        parameters = apartment_service.get_apartment_parameters_by_apartment(id_apartment=apart.id)
        parameters_list = [ApartmentParameter(id=param.id, name=param.name, status=param.status) for param in parameters]
        response.append(Apartment(id=apart.id,
                                  name=apart.name,
                                  description=apart.description,
                                  category=ApartmentCategory(id=category.id, name=category.name),
                                  rooms=apart.rooms,
                                  area=apart.area,
                                  parameters=parameters_list,
                                  id_house=apart.id_house,
                                  count=apart.count,
                                  image=[]))
    return response

@router.get('/{id}', status_code=200)
async def get_apartment(id: int, apartment_service: ApartmentService = Depends(get_apartment_service)):
    apartment = apartment_service.get_one_apartment_filter_by(id=id)
    if not apartment:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    category = apartment_service.get_one_apartment_category_filter_by(id=apartment.id_category)
    parameters = apartment_service.get_apartment_parameters_by_apartment(id_apartment=apartment.id)
    parameters_list = [ApartmentParameter(id=param.id, name=param.name, status=param.status) for param in parameters]
    return Apartment(id=apartment.id,
                                  name=apartment.name,
                                  description=apartment.description,
                                  category=ApartmentCategory(id=category.id, name=category.name),
                                  rooms=apartment.rooms,
                                  area=apartment.area,
                                  parameters=parameters_list,
                                  id_house=apartment.id_house,
                                  count=apartment.count,
                                  image=[])
    
@router.post('/', status_code=201)
async def create_apartment(new_apartment: CreateApartment, 
                           apartment_service: ApartmentService = Depends(get_apartment_service)):
    apartment = apartment_service.create_apartment(new_apartment)
    if apartment == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return {'status': Status.SUCCESS.value, 'apartment': apartment}

@router.put('/{id}', status_code=200)
async def update_apartment(id: int, update_data: UpdateApartment,
                           apartment_service: ApartmentService = Depends(get_apartment_service)):
    apartment = apartment_service.get_one_apartment_filter_by(id=id)
    if not apartment:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    apartment_service.update_apartment(id, update_data)
    return 

@router.delete('/{id}', status_code=200)
async def delete_apartment(id: int, apartment_service: ApartmentService = Depends(get_apartment_service)):
    apartment = apartment_service.get_one_apartment_filter_by(id=id)
    if not apartment:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    apartment_service.delete_apartment(id)
    return {'status': Status.SUCCESS.value}


# Apartment Image under development
