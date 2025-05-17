from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from utils.image import save_image
from dependencies import ApartmentService, get_apartment_service
from utils.enums import Status
from schemas.apartments import *
from schemas.houses import *

router = APIRouter()

@router.post('/', status_code=201)
async def create_apartment_category(data: CreateApartmentCategory,
                            apartment_service: ApartmentService = Depends(get_apartment_service)):
    new_apartment_category = apartment_service.create_apartment_category(data)
    if new_apartment_category == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return Status.SUCCESS.value

@router.get('/', status_code=200, response_model=list[ApartmentCategoryResponse])
async def get_all_apartment_categories(name: str | None = Query(None), 
                             apartment_service: ApartmentService = Depends(get_apartment_service)):
    filter = {k: v for k, v in locals().items() if v is not None and k != 'apartment_service'}
    categories = apartment_service.get_all_apartment_category_filter_by(**filter)
    if not categories:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = [ApartmentCategoryResponse(**apartment_category.__dict__) for apartment_category in categories]
    return response

@router.get('/{id}', status_code=200, response_model=ApartmentCategoryResponse)
async def get_apartment_category(id: int, apartment_service: ApartmentService = Depends(get_apartment_service)):
    apartment_category = apartment_service.get_one_apartment_category_filter_by(id=id)
    if not apartment_category:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = ApartmentCategoryResponse(**apartment_category.__dict__)
    return response

@router.put('/{id}', status_code=200)
async def update_apartment_category(id: int, data: UpdateApartmentCategory,
                          apartment_service: ApartmentService = Depends(get_apartment_service)):
    apartment_category = apartment_service.get_one_apartment_category_filter_by(id=id)
    if not apartment_category:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    update_apartment_category = apartment_service.update_apartment_category(id, data)
    return {'status': Status.SUCCESS.value, 'apartment_category': update_apartment_category}

@router.delete('/{id}', status_code=200)
async def delete_apartment_category(id: int, apartment_service: ApartmentService = Depends(get_apartment_service)):
    apartment_category = apartment_service.get_one_apartment_category_filter_by(id=id)
    if not apartment_category:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    apartment_service.delete_apartment_category(id)
    return {'status': Status.SUCCESS.value}