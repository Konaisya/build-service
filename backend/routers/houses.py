from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from utils.image import save_image, delete_image
from dependencies import HouseService, get_house_service, ApartmentService, get_apartment_service
from utils.enums import Status
from schemas.apartments import *
from schemas.houses import *
from utils.to_dict import to_dict

router = APIRouter()

@router.post('/', status_code=201)
async def create_house(data: CreateHouse,
                        house_service: HouseService = Depends(get_house_service)):
    new_house = house_service.create_house(data)
    if new_house == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return Status.SUCCESS.value

@router.get('/', status_code=200, response_model=list[HouseResponse])
async def get_all_houses(
    name: str | None = Query(None),
    status: HouseStatus | None = Query(None),
    is_order: bool | None = Query(None),
    district: str | None = Query(None),
    address: str | None = Query(None),
    floors: int | None = Query(None),
    entrances: int | None = Query(None),
    begin_date: date | None = Query(None),
    end_date: date | None = Query(None),
    start_price: float | None = Query(None),
    final_price: float | None = Query(None),
    id_attribute: int | None = Query(None),
    attribute_value: str | None = Query(None),
    house_service: HouseService = Depends(get_house_service),
    apartment_service: ApartmentService = Depends(get_apartment_service),
):
    filter = {k: v for k, v in locals().items() if v is not None and k not in ['house_service', 'apartment_service']}
    houses = house_service.get_all_houses_filter_by(**filter, id_attribute=id_attribute, attribute_value=attribute_value)

    if not houses:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})

    response = []
    for house in houses:
        images = house_service.get_all_house_image_filter_by(id_house=house.id)
        images_list = [HouseImageResponse(**to_dict(image)) for image in images]

        attributes_assoc = house_service.get_all_house_attribute_filter_by(id_house=house.id)
        attributes_list = []
        for attr_assoc in attributes_assoc:
            attribute = house_service.get_one_attribute_filter_by(id=attr_assoc.id_attribute)
            attribute_resp = AttributeResponse(**to_dict(attribute))

            attributes_list.append(HouseAttributeResponse(
                attribute=attribute_resp,
                value=attr_assoc.value
            ))

        apartments = apartment_service.get_all_apartments_filter_by(id_house=house.id)
        apartments_list = []
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
            apartments_list.append(apartment_resp)
        
        house_resp = to_dict(house)
        house_resp.update({
            'images': images_list,
            'attributes': attributes_list,
            'apartments': apartments_list
        })
        response.append(HouseResponse(**house_resp))
    return response

@router.get('/{id}', status_code=200, response_model=HouseResponse)
async def get_one_house(id: int,
                        house_service: HouseService = Depends(get_house_service),
                        apartment_service: ApartmentService = Depends(get_apartment_service)):
    house = house_service.get_one_house_filter_by(id=id)
    if not house:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    images = house_service.get_all_house_image_filter_by(id_house=house.id)
    images_list = [HouseImageResponse(**to_dict(image)) for image in images]

    attributes_assoc = house_service.get_all_house_attribute_filter_by(id_house=house.id)
    attributes_list = []
    for attr_assoc in attributes_assoc:
        attribute = house_service.get_one_attribute_filter_by(id=attr_assoc.id_attribute)
        attribute_resp = AttributeResponse(**to_dict(attribute))

        attributes_list.append(HouseAttributeResponse(
            attribute=attribute_resp,
            value=attr_assoc.value
        ))

    apartments = apartment_service.get_all_apartments_filter_by(id_house=house.id)
    apartments_list = []
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
        apartments_list.append(apartment_resp)
    
    house_resp = to_dict(house)
    house_resp.update({
        'images': images_list,
        'attributes': attributes_list,
        'apartments': apartments_list
    })
    return HouseResponse(**house_resp)

@router.put('/{id}', status_code=200)
async def update_house(id: int,
                        data: UpdateHouse,
                        house_service: HouseService = Depends(get_house_service)):
    house = house_service.get_one_house_filter_by(id=id)
    if not house:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    updated_house = house_service.update_house(id, data)
    if updated_house == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return Status.SUCCESS.value

@router.delete('/{id}', status_code=200)
async def delete_house(id: int,
                       house_service: HouseService = Depends(get_house_service),
                       apartment_service: ApartmentService = Depends(get_apartment_service)):
    house = house_service.get_one_house_filter_by(id=id)
    if not house:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    apartments = apartment_service.get_all_apartments_filter_by(id_house=id)
    if apartments:
        for apartment in apartments:
            apartment_service.delete_apartment(apartment.id)
    house_service.delete_house(id)
    return Status.SUCCESS.value

# Images
@router.patch('/{id}/images', status_code=200)
async def update_house_main_image(id: int,
                                  main_image: UploadFile = File(...),
                                  house_service: HouseService = Depends(get_house_service)):
    house = house_service.get_one_house_filter_by(id=id)
    if not house:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    delete_image(house.main_image)
    house_service.update_house(id, UpdateHouse(main_image=main_image.filename))
    save_image(main_image)
    return Status.SUCCESS.value
    
@router.post('/{id}/images', status_code=201)
async def add_house_image(id: int,
                          images: list[UploadFile] | None = File(None),
                          house_service: HouseService = Depends(get_house_service)):
    house = house_service.get_one_house_filter_by(id=id)
    if not house:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    if images:
        for image in images:
            house_image = HouseImageForm(id_house=id, image=image.filename)
            house_service.create_house_image(house_image)
            save_image(image)
    return Status.SUCCESS.value

@router.delete('/{id}/images', status_code=200)
async def delete_house_image(id: int,
                             images: ImageToDelete,
                             house_service: HouseService = Depends(get_house_service)):
    house = house_service.get_one_house_filter_by(id=id)
    if not house:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    ids_images = images.ids_images
    if ids_images:
        for id_image in ids_images:
            image = house_service.get_one_house_image_filter_by(id=id_image)
            if not image:
                continue
            house_service.delete_house_image(id_image)
            delete_image(image.image)
    return Status.SUCCESS.value