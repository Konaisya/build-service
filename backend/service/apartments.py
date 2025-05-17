from utils.enums import Status
from models.apartments import *
from schemas.apartments import *
from dependencies import ApartmentRepository
from sqlalchemy.orm import joinedload

class ApartmentService:
    def __init__(self, apartment_repository: ApartmentRepository,
                 parameter_repository: ApartmentRepository,
                 apartment_category_repository: ApartmentRepository,
                 apartment_parameter_repository: ApartmentRepository,
                 apartment_image_repository: ApartmentRepository):
        self.apartment_repository = apartment_repository
        self.parameter_repository = parameter_repository
        self.apartment_category_repository = apartment_category_repository
        self.apartment_parameter_repository = apartment_parameter_repository
        self.apartment_image_repository = apartment_image_repository

    # ApartmentCategory
    def get_all_apartment_category_filter_by(self, **filter):
        return self.apartment_category_repository.get_all_filter_by(**filter)
    
    def get_one_apartment_category_filter_by(self, **filter):
        return self.apartment_category_repository.get_one_filter_by(**filter)
    
    def create_apartment_category(self, new_apartment_category: CreateApartmentCategory):
        create_apartment_category = self.apartment_category_repository.add(new_apartment_category.model_dump())
        if not create_apartment_category:
            return Status.FAILED.value
        return create_apartment_category
    
    def update_apartment_category(self, id: int, upd_apartment_category: UpdateApartmentCategory):
        entity = upd_apartment_category.model_dump()
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        update_apartment_category = self.apartment_category_repository.update(entity)
        if not update_apartment_category:
            return Status.FAILED.value
        return update_apartment_category
    
    def delete_apartment_category(self, id: int):
        return self.apartment_category_repository.delete(id)
    

    # Parameter
    def get_all_parameters_filter_by(self, **filter):
        return self.parameter_repository.get_all_filter_by(**filter)
    
    def get_one_parameter_filter_by(self, **filter):
        return self.parameter_repository.get_one_filter_by(**filter)
    
    def create_parameter(self, new_parameter: CreateParameter):
        create_parameter = self.parameter_repository.add(new_parameter.model_dump())
        if not create_parameter:
            return Status.FAILED.value
        return create_parameter
    
    def update_parameter(self, id: int, upd_parameter: UpdateParameter):
        entity = upd_parameter.model_dump()
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        update_parameter = self.parameter_repository.update(entity)
        if not update_parameter:
            return Status.FAILED.value
        return update_parameter
    
    def delete_parameter(self, id: int):
        self.apartment_parameter_repository.delete_by_filter(id_parameter=id)
        return self.parameter_repository.delete(id)
    

    # ApartmentParameter
    def get_all_apartment_parameter_filter_by(self, **filter):
        return self.apartment_parameter_repository.get_all_filter_by(**filter)
    
    def get_one_apartment_parameter_filter_by(self, **filter):
        return self.apartment_parameter_repository.get_one_filter_by(**filter)
    
    def create_apartment_parameter(self, new_apartment_parameter: ApartmentParameterForm):
        create_apartment_parameter = self.apartment_parameter_repository.add(new_apartment_parameter.model_dump())
        if not create_apartment_parameter:
            return Status.FAILED.value
        return create_apartment_parameter
    
    def update_apartment_parameter(self, id: int, upd_apartment_parameter: ApartmentParameterForm):
        entity = upd_apartment_parameter.model_dump()
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        update_apartment_parameter = self.apartment_parameter_repository.update(entity)
        if not update_apartment_parameter:
            return Status.FAILED.value
        return update_apartment_parameter
    
    def delete_apartment_parameter(self, id: int):
        return self.apartment_parameter_repository.delete(id)
    

    # ApartmentImage
    def get_all_apartment_image_filter_by(self, **filter):
        return self.apartment_image_repository.get_all_filter_by(**filter)
    
    def get_one_apartment_image_filter_by(self, **filter):
        return self.apartment_image_repository.get_one_filter_by(**filter)
    
    def create_apartment_image(self, new_apartment_image: ApartmentImageForm):
        create_apartment_image = self.apartment_image_repository.add(new_apartment_image.model_dump())
        if not create_apartment_image:
            return Status.FAILED.value
        return create_apartment_image
    
    def update_apartment_image(self, id: int, upd_apartment_image: ApartmentImageForm):
        entity = upd_apartment_image.model_dump()
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        update_apartment_image = self.apartment_image_repository.update(entity)
        if not update_apartment_image:
            return Status.FAILED.value
        return update_apartment_image
    
    def delete_apartment_image(self, id: int):
        return self.apartment_image_repository.delete(id)


    # Apartment
    def get_all_apartments_filter_by(self, id_parameter: int = None, parameter_value: str = None, **filter):
        query = self.apartment_repository.get_all_filter_by(**filter).options(
            joinedload(Apartment.parameters).joinedload(ApartmentParameter.parameter))
        if id_parameter and parameter_value:
            query = query.join(ApartmentParameter).filter(
                ApartmentParameter.id_parameter == id_parameter,
                ApartmentParameter.value == parameter_value
            )
        apartments = query.all()
        return apartments
    
    def get_one_apartment_filter_by(self, **filter):
        return self.apartment_repository.get_one_filter_by(**filter)
    
    def create_apartment(self, new_apartment: CreateApartment):
        new_apartment_dict = new_apartment.model_dump()
        parameters = new_apartment_dict.pop('parameters') or []

        create_apartment = self.apartment_repository.add(new_apartment_dict)
        if not new_apartment:
            return Status.FAILED.value
        
        if parameters:
            for parameter in parameters:
                parameter['id_apartment'] = create_apartment.id
                self.apartment_parameter_repository.add(parameter)
        
        return create_apartment
    
    def update_apartment(self, id: int, upd_apartment: UpdateApartment):
        entity = upd_apartment.model_dump()
        entity['id'] = id

        parameters = entity.pop('parameters') or []
        images = entity.pop('images') or []

        entity = {k: v for k, v in entity.items() if v is not None}
        update_apartment = self.apartment_repository.update(entity)
        if not update_apartment:
            return Status.FAILED.value
        
        if parameters:
            existing_parameters = self.apartment_parameter_repository.get_all_filter_by(id_apartment=id)
            existing_parameters_dict = {p.id_parameter: p for p in existing_parameters}
            for parameter in parameters:
                id_parameter = parameter['id_parameter']
                value = parameter['value']

                if id_parameter in existing_parameters_dict:
                    self.apartment_parameter_repository.update_by_filter(
                        {'id_apartment': id, 'id_parameter': id_parameter},
                        {'value': value})
                else:
                    parameter['id_apartment'] = id
                    self.apartment_parameter_repository.add(parameter)
        return update_apartment
    
    def delete_apartment(self, id: int):
        self.apartment_parameter_repository.delete_by_filter(id_apartment=id)
        self.apartment_image_repository.delete_by_filter(id_apartment=id)
        return self.apartment_repository.delete(id)


