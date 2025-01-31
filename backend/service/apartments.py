from utils.enums import Status
from models.apartments import *
from schemas.apartments import *
from dependencies import ApartmentRepository

class ApartmentService:
    
    def __init__(self, apartment_repository: ApartmentRepository, apartment_category_repository: ApartmentRepository, 
                 apartment_parameter_repository: ApartmentRepository, apartment_image_repository: ApartmentRepository, 
                 apartment_parameter_association_repository: ApartmentRepository):
        self.apartment_repository = apartment_repository
        self.apartment_category_repository = apartment_category_repository
        self.apartment_parameter_repository = apartment_parameter_repository
        self.apartment_image_repository = apartment_image_repository
        self.apartment_parameter_association_repository = apartment_parameter_association_repository


    # Apartment
    def get_all_apartment_filter_by(self, **filter):
        return self.apartment_repository.get_all_filter_by(**filter)
    
    def get_one_apartment_filter_by(self, **filter):
        return self.apartment_repository.get_one_filter_by(**filter)
    
    def create_apartment(self, data: CreateApartment):
        new_apartment_data = data.model_dump()
        parameter_ids = new_apartment_data.pop('parameter_ids', [])
        new_apartment = self.apartment_repository.add(new_apartment_data)

        for param_id in parameter_ids:
            association_data = {
                "id_apartment": new_apartment.id,
                "id_parameter": param_id
            }
            self.apartment_parameter_association_repository.add(association_data)

        created_apartment = self.apartment_repository.get_one_filter_by(id=new_apartment.id)
        return Status.SUCCESS.value, created_apartment

    def update_partment(self, apartment_id, data: UpdateApartment):
        entity = data.model_dump()
        entity['id'] = apartment_id
        entity = {k: v for k, v in entity.items() if v is not None}
        return self.apartment_repository.update(entity)
    
    def delete_apartment(self, id_apartment: int):
        self.apartment_image_repository.delete_by_filter(id_apartment=id_apartment)
        self.apartment_parameter_association_repository.delete_by_filter(id_apartment=id_apartment)
        return self.apartment_repository.delete(id_apartment)


    # Apartment Category
    def get_all_apartment_category_filter_by(self, **filter):
        return self.apartment_category_repository.get_all_filter_by(**filter)
    
    def get_one_apartment_category_filter_by(self, **filter):
        return self.apartment_category_repository.get_one_filter_by(**filter)
    
    def create_apartment_category(self, data: ApartmentCategoryCreate):
        category = self.apartment_category_repository.add(data.model_dump)
        if not category:
            return Status.FAILED.value
        return Status.SUCCESS.value, ApartmentCategory(id=category.id, name=category.name)
    
    def update_apartment_category(self, id_category: int, data: ApartmentCategoryUpdate):
        entity = data.model_dump()
        entity['id'] = id_category
        entity = {k: v for k, v in entity.items() if v is not None}
        return self.apartment_category_repository.update(entity)
    
    def delete_category(self, id: int):
        return self.apartment_category_repository.delete(id)
    
    # Apartment Parameters
    def get_apartment_parameters(self, apartment_id: int):
        associations = self.apartment_parameter_association_repository.get_all_filter_by(id_apartment=apartment_id)
        if not associations:
            return []
        parameter_ids = [assoc.id_parameter for assoc in associations]
        parameters = self.apartment_parameter_repository.get_all_filter_by(id=parameter_ids)
        return parameters

    def get_all_apartment_parameters_filter_by(self, **filter):
        return self.apartment_parameter_repository.get_all_filter_by(**filter)
    
    def get_one_apartment_parameter_filter_by(self, **filter):
        return self.apartment_parameter_repository.get_one_filter_by(**filter)
    
    def create_apartment_parameter(self, data: ApartmentParameterCreate):
        parameter = self.apartment_parameter_repository.add(data.model_dump)
        if not parameter:
            return Status.FAILED.value
        return Status.SUCCESS.value, ApartmentParameter(id=parameter.id, name=parameter.name, status=parameter.status)
    
    def update_apartment_parameter(self, id_parameter: int, data: ApartmentParameterUpdate):
        entity = data.model_dump()
        entity['id'] = id_parameter
        entity = {k: v for k, v in entity.items() if v is not None}
        return self.apartment_parameter_repository.update(entity)

    def delete_apartment_parameter(self, id_parameter: int):
        return self.apartment_parameter_repository.delete(id_parameter)
    

    # Apartment Image
    def get_all_apartment_image_filter_by(self, **filter):
        return self.apartment_image_repository.get_all_filter_by(**filter)
    
    def get_one_apartment_image_filter_by(self, **filter):
        return self.apartment_image_repository.get_one_filter_by(**filter)

    def add_apartment_image(self, data: ApartmentImageCreate):
        new_image = self.apartment_image_repository.add(data.model_dump)
        if not new_image:
            return Status.FAILED.value
        return Status.SUCCESS.value, new_image
    
    def update_apartment_image(self, id_image: int, data: ApartmentImageUpdate):
        entity = data.model_dump()
        entity['id'] = id_image
        entity = {k: v for k, v in entity.items() if v is not None}
        return self.apartment_image_repository.update(entity)

    def delete_apartment_image(self, id_image: int):
        return self.apartment_image_repository.delete(id_image)