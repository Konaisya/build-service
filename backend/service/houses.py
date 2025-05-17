from utils.abstract_repository import IREpository
from dependencies import HouseRepository
from schemas.houses import *
from utils.enums import Status
from sqlalchemy.orm import joinedload
from models.houses import *

class HouseService:
    def __init__(self, house_repository: HouseRepository,
                 attribute_repository: HouseRepository,
                 house_attribute_repository: HouseRepository,
                 house_image_repository: HouseRepository):
        self.house_repository = house_repository
        self.attribute_repository = attribute_repository
        self.house_attribute_repository = house_attribute_repository
        self.house_image_repository = house_image_repository

    # Attribute
    def get_all_attributes_filter_by(self, **filter):
        return self.attribute_repository.get_all_filter_by(**filter)
    
    def get_one_attribute_filter_by(self, **filter):
        return self.attribute_repository.get_one_filter_by(**filter)
    
    def create_attribute(self, new_attribute: CreateAttribute):
        create_attribute = self.attribute_repository.add(new_attribute.model_dump())
        if not create_attribute:
            return Status.FAILED.value
        return create_attribute
    
    def update_attribute(self, id: int, upd_attribute: UpdateAttribute):
        entity = upd_attribute.model_dump()
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        update_attribute = self.attribute_repository.update(entity)
        if not update_attribute:
            return Status.FAILED.value
        return update_attribute
    
    def delete_attribute(self, id: int):
        self.house_attribute_repository.delete_by_filter(id_attribute=id)
        return self.attribute_repository.delete(id)
    
    
    # HouseAttribute
    def get_all_house_attribute_filter_by(self, **filter):
        return self.house_attribute_repository.get_all_filter_by(**filter)
    
    def get_one_house_attribute_filter_by(self, **filter):
        return self.house_attribute_repository.get_one_filter_by(**filter)
    
    def create_house_attribute(self, new_house_attribute: HouseAttributeForm):
        create_house_attribute = self.house_attribute_repository.add(new_house_attribute.model_dump())
        if not create_house_attribute:
            return Status.FAILED.value
        return create_house_attribute
    
    def update_house_attribute(self, id: int, upd_house_attribute: HouseAttributeForm):
        entity = upd_house_attribute.model_dump()
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        update_house_attribute = self.house_attribute_repository.update(entity)
        if not update_house_attribute:
            return Status.FAILED.value
        return update_house_attribute
    
    def delete_house_attribute(self, id: int):
        return self.house_attribute_repository.delete(id)
    

    # HouseImage
    def get_all_house_image_filter_by(self, **filter):
        return self.house_image_repository.get_all_filter_by(**filter)
    
    def get_one_house_image_filter_by(self, **filter):
        return self.house_image_repository.get_one_filter_by(**filter)
    
    def create_house_image(self, new_house_image: HouseImageForm):
        create_house_image = self.house_image_repository.add(new_house_image.model_dump())
        if not create_house_image:
            return Status.FAILED.value
        return create_house_image
    
    def update_house_image(self, id: int, upd_house_image: HouseImageForm):
        entity = upd_house_image.model_dump()
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        update_house_image = self.house_image_repository.update(entity)
        if not update_house_image:
            return Status.FAILED.value
        return update_house_image
    
    def delete_house_image(self, id: int):
        return self.house_image_repository.delete(id)


    # House
    def get_all_houses_filter_by(self, id_attribute: int, attribute_value: str, **filter):
        query = self.house_repository.get_all_filter_by(**filter).options(
            joinedload(House.attributes).joinedload(HouseAttribute.attribute),
        )
        if id_attribute and attribute_value:
            query = query.join(HouseAttribute).filter(
                HouseAttribute.id_attribute == id_attribute,
                HouseAttribute.value == attribute_value
            )
        houses = query.all()
        return houses
    
    def get_one_house_filter_by(self, **filter):
        return self.house_repository.get_one_filter_by(**filter)
    
    def create_house(self, new_house: CreateHouse):
        new_house_dict = new_house.model_dump()
        attributes = new_house_dict.pop('attributes', []) or []

        create_house = self.house_repository.add(new_house_dict)
        if not create_house:
            return Status.FAILED.value
        
        if attributes:
            for attribute in attributes:
                attribute['id_house'] = create_house.id
                self.house_attribute_repository.add(attribute)
        return create_house
    
    def update_house(self, id: int, upd_house: UpdateHouse):
        entity = upd_house.model_dump()
        entity['id'] = id

        attributes = entity.pop('attributes', []) or []
        images = entity.pop('images', []) or []

        entity = {k: v for k, v in entity.items() if v is not None}
        update_house = self.house_repository.update(entity)
        if not update_house:
            return Status.FAILED.value
        
        if attributes:
            existing_attributes = self.house_attribute_repository.get_all_filter_by(id_house=id)
            existing_attributes_dict = {attr.id_attribute: attr for attr in existing_attributes}
            for attribute in attributes:
                id_attribute = attribute['id_attribute']
                value = attribute['value']
                if id_attribute in existing_attributes_dict:
                    print('update_by_filter:', {'id_house': id, 'id_attribute': id_attribute}, {'value': value})
                    self.house_attribute_repository.update_by_filter(
                        {'id_house': id, 'id_attribute': id_attribute},
                        {'value': value}
                    )
                else:
                    attribute['id_house'] = id
                    self.house_attribute_repository.add(attribute)
        return update_house
    
    def delete_house(self, id: int):
        self.house_attribute_repository.delete_by_filter(id_house=id)
        self.house_image_repository.delete_by_filter(id_house=id)
        return self.house_repository.delete(id)
