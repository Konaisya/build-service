from utils.abstract_repository import IREpository
from models.apartments import Apartment, ApartmentImage, ApartmentParameter, ApartmentCategory, ApartmentParameterAssociation

class ApartmentService:
    def __init__(self, session):
        self.session = session

    # Apartments
    def get_all_filter_by(self, **filter):
        apartments = self.session.query(Apartment).filter_by(**filter).all()
        for apartment in apartments:
            apartment.images = self.get_images_by_apartment_id(apartment.id)
            apartment.parameters = self.get_apartment_parameter_association(apartment.id)
            apartment.category = self.get_apartment_categories_by_filter(apartment.id)
        return apartments

    def get_one_filter_by(self, **filter):
        apartment = self.session.query(Apartment).filter_by(**filter).first()
        if apartment:
            apartment.images = self.get_images_by_apartment_id(apartment.id)
            apartment.parameters = self.get_apartment_parameter_association(apartment.id)
            apartment.category = self.get_apartment_categories_by_filter(apartment.id)
        return apartment

    def create(self, entity: dict):
        apartment_images = entity.pop('images', [])
        apartment_parameters = entity.pop('parameters', [])
        entity = self.model(**entity)
        self.session.add(entity)
        self.session.commit()
        for image_data in apartment_images:
            image_data['id_apartment'] = entity.id
            self.add_image(image_data)
        for parameter_id in apartment_parameters:
            self.add_apartment_parameter_association(entity.id, parameter_id)
        return entity

    def update(self, entity: dict):
        apartment_images = entity.pop('images', [])
        apartment_parameters = entity.pop('parameters', [])
        self.session.query(self.model).filter_by(id=entity['id']).update(entity)
        self.session.commit()
        for image_data in apartment_images:
            image_data['id_apartment'] = entity['id']
            self.add_image(image_data)
        self.session.query(ApartmentParameterAssociation).filter_by(id_apartment=entity['id']).delete()
        for parameter_id in apartment_parameters:
            self.add_apartment_parameter_association(entity['id'], parameter_id)
        return entity

    def delete_by_house_id(self, id_house: int):
        self.session.query(self.model).filter_by(id_house=id_house).delete()
        self.session.commit()


    # Apartment Image
    def get_images_by_apartment_id(self, apartment_id):
        return self.session.query(ApartmentImage).filter(ApartmentImage.apartment_id == apartment_id).all()
    
    def add_image(self, image_data: dict):
        image = ApartmentImage(**image_data)
        self.session.add(image)
        self.session.commit()
        return image
    
    def update_image(self, image_data: dict):
        self.session.query(ApartmentImage).filter_by(id=image_data['id']).update(image_data)
        self.session.commit()

    def delete_image(self, image_id: int):
        self.session.query(ApartmentImage).filter_by(id=image_id).delete()
        self.session.commit()


    # Apartment Parameters
    def get_apartment_parameters_by_name(self, name):
        return self.session.query(ApartmentParameter).filter_by(name=name).all

    def add_apartment_parameter(self, parameter_data: dict):
        parameter = ApartmentParameter(**parameter_data)
        self.session.add(parameter)
        self.session.commit()
        return parameter
    
    def update_apartment_parameter(self, parameter_data: dict):
        self.session.query(ApartmentParameter).filter_by(id=parameter_data['id']).update(parameter_data)
        self.session.commit()

    def delete_apartment_parameter(self, parameter_id: int):
        self.session.query(ApartmentParameter).filter_by(id=parameter_id).delete()
        self.session.commit()

    
    # Apartment Parameters Association
    def get_apartment_parameter_association(self, apartment_id):
        return self.session.query(ApartmentParameter).join(ApartmentParameterAssociation).filter(ApartmentParameterAssociation.id_apartment == apartment_id).all()

    def add_apartment_parameter_association(self, apartment_id: int, parameter_id: int):
        association = ApartmentParameterAssociation(id_apartment=apartment_id, id_parameter=parameter_id)
        self.session.add(association)
        self.session.commit()

    def delete_apartment_parameter_association(self, apartment_id: int, parameter_id: int):
        self.session.query(ApartmentParameterAssociation).filter_by(id_apartment=apartment_id, id_parameter=parameter_id).delete()
        self.session.commit()
            

    # Apartment Categories
    def get_apartment_categories_by_filter(self, **filter):
        return self.session.query(ApartmentCategory).filter_by(**filter).all()
    
    def add_apartment_category(self, category_data: dict):
        category = ApartmentCategory(**category_data)
        self.session.add(category)
        self.session.commit()
        return category
    
    def update_apartment_category(self, category_data: dict):
        self.session.query(ApartmentCategory).filter_by(id=category_data['id']).update(category_data)
        self.session.commit()

    def delete_apartment_category(self, category_id: int):
        self.session.query(ApartmentCategory).filter_by(id=category_id).delete()
        self.session.commit()
