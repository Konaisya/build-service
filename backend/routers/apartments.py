from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from utils.image import save_image, delete_image
from dependencies import ApartmentService, get_apartment_service
from utils.enums import Status
from schemas.apartments import *
from utils.to_dict import to_dict

router = APIRouter()

@router.post('/', status_code=201)
async def create_apartment(data: CreateApartment,
                            apartment_service: ApartmentService = Depends(get_apartment_service)):
    new_apartment = apartment_service.create_apartment(data)
    if new_apartment == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return Status.SUCCESS.value

@router.get('/', status_code=200, response_model=list[ApartmentResponse])
async def get_all_apartments(name: str | None = Query(None),
                             id_category: int | None = Query(None),
                             rooms: int | None = Query(None),
                             area: float | None = Query(None),
                             id_house: int | None = Query(None),
                             count: int | None = Query(None),
                             id_parameter: int | None = Query(None),
                             parameter_value: str | None = Query(None),
                             apartment_service: ApartmentService = Depends(get_apartment_service)):
    filter = {k: v for k, v in locals().items() if v is not None 
              and k not in {'apartment_service', 'parameter_value', 'id_parameter'}}
    apartments = apartment_service.get_all_apartments_filter_by(**filter, id_parameter=id_parameter, parameter_value=parameter_value)
    if not apartments:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = []
    for apartment in apartments:
        category = apartment_service.get_one_apartment_category_filter_by(id=apartment.id_category)
        category_resp = ApartmentCategoryResponse(**to_dict(category))

        parameter_assoc = apartment_service.get_all_apartment_parameter_filter_by(id_apartment=apartment.id)
        parameters_list = []
        for param_assoc in parameter_assoc:
            parameter = apartment_service.get_one_parameter_filter_by(id=param_assoc.id_parameter)
            parameter_resp = ParameterResponse(**to_dict(parameter))

            parameters_list.append(ApartmentParameterResponse(
                parameter=parameter_resp,
                value=param_assoc.value
            ))

        apart_images = apartment_service.get_all_apartment_image_filter_by(id_apartment=apartment.id)
        apart_images_list = [ApartmentImageResponse(**to_dict(image)) for image in apart_images]

        apartment_resp = to_dict(apartment)
        apartment_resp.update({
            'category': category_resp,
            'parameters': parameters_list,
            'images': apart_images_list
        })
        response.append(ApartmentResponse(**apartment_resp))
    return response

@router.get('/{id}', status_code=200, response_model=ApartmentResponse)
async def get_apartment(id: int,
                              apartment_service: ApartmentService = Depends(get_apartment_service)):
    apartment = apartment_service.get_one_apartment_filter_by(id=id)
    if not apartment:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    category = apartment_service.get_one_apartment_category_filter_by(id=apartment.id_category)
    category_resp = ApartmentCategoryResponse(**to_dict(category))

    parameter_assoc = apartment_service.get_all_apartment_parameter_filter_by(id_apartment=apartment.id)
    parameters_list = []
    for param_assoc in parameter_assoc:
        parameter = apartment_service.get_one_parameter_filter_by(id=param_assoc.id_parameter)
        parameter_resp = ParameterResponse(**to_dict(parameter))

        parameters_list.append(ApartmentParameterResponse(
            parameter=parameter_resp,
            value=param_assoc.value
        ))

    apart_images = apartment_service.get_all_apartment_image_filter_by(id_apartment=apartment.id)
    apart_images_list = [ApartmentImageResponse(**to_dict(image)) for image in apart_images]

    apartment_resp = to_dict(apartment)
    apartment_resp.update({
        'category': category_resp,
        'parameters': parameters_list,
        'images': apart_images_list
    })
    return ApartmentResponse(**apartment_resp)

@router.put('/{id}', status_code=200)
async def update_apartment(id: int,
                           data: UpdateApartment,
                           apartment_service: ApartmentService = Depends(get_apartment_service)): 
    apartment = apartment_service.get_one_apartment_filter_by(id=id)
    if not apartment:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    updated_apartment = apartment_service.update_apartment(id, data)
    if updated_apartment == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return Status.SUCCESS.value

@router.delete('/{id}', status_code=200)
async def delete_apartment(id: int,
                            apartment_service: ApartmentService = Depends(get_apartment_service)):
    apartment = apartment_service.get_one_apartment_filter_by(id=id)
    if not apartment:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    apartment_service.delete_apartment(id)
    return Status.SUCCESS.value

# Apartment images
@router.patch('/{id}/images', status_code=200)
async def update_apartment_main_image(id: int,
                                  main_image: UploadFile = File(...),
                                  apartment_service: ApartmentService = Depends(get_apartment_service)):
    apartment = apartment_service.get_one_apartment_filter_by(id=id)
    if not apartment:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    delete_image(apartment.main_image)
    apartment_service.update_apartment(id, UpdateApartment(main_image=main_image.filename))
    save_image(main_image)
    return Status.SUCCESS.value
    
@router.post('/{id}/images', status_code=201)
async def add_apartment_image(id: int,
                          images: list[UploadFile] | None = File(None),
                          apartment_service: ApartmentService = Depends(get_apartment_service)):
    apartment = apartment_service.get_one_apartment_filter_by(id=id)
    if not apartment:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    if images:
        for image in images:
            apartment_image = ApartmentImageForm(id_apartment=id, image=image.filename)
            apartment_service.create_apartment_image(apartment_image)
            save_image(image)
    return Status.SUCCESS.value

@router.delete('/{id}/images', status_code=200)
async def delete_apartment_image(id: int,
                             images: ImageToDelete,
                             apartment_service: ApartmentService = Depends(get_apartment_service)):
    apartment = apartment_service.get_one_apartment_filter_by(id=id)
    if not apartment:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    ids_images = images.ids_images
    if ids_images:
        for id_image in ids_images:
            image = apartment_service.get_one_apartment_image_filter_by(id=id_image)
            if not image:
                continue
            apartment_service.delete_apartment_image(id_image)
            delete_image(image.image)
    return Status.SUCCESS.value