from utils.abstract_repository import IREpository
from models.houses import House, HouseImage, HouseAddition, HouseAdditionAssociation

class HouseService:
    def __init__(self, model, session):
        self.model = House
        self.session = session

    # Houses
    def get_all_filter_by(self, **filter):
        return self.session.query(self.model).filter_by(**filter).all()
    
    def get_one_filter_by(self, **filter):
        return self.session.query(self.model).filter_by(**filter).first()
    
    def create(self, entity: dict):
        house_images = entity.pop('images', [])
        entity = self.model(**entity)
        self.session.add(entity)
        self.session.commit()
        for image_data in house_images:
            image_data['id_house'] = entity.id
            self.add_image(image_data)
        return entity
    
    def update(self, entity: dict):
        house_images = entity.pop('images', [])
        self.session.query(self.model).filter_by(id=entity['id']).update(entity)
        self.session.commit()
        for image_data in house_images:
            image_data['id_house'] = entity['id']
            self.add_image(image_data)
        return entity
    
    def delete(self, id: int):
        self.session.query(self.model).filter_by(id=id).delete()
        self.session.commit()


    # House images
    def get_images_by_house_id(self, house_id: int):
        return self.session.query(HouseImage).filter_by(id_house=house_id).all()
    
    def add_image(self, image_data: dict):
        image = HouseImage(**image_data)
        self.session.add(image)
        self.session.commit()
        return image
    
    def update_image(self, image_data: dict):
        self.session.query(HouseImage).filter_by(id=image_data['id']).update(image_data)
        self.session.commit()

    def delete_image(self, image_id: int):
        self.session.query(HouseImage).filter_by(id=image_id).delete()
        self.session.commit()


    # House additions
    def get_additions_by_house_id(self, house_id: int):
        return self.session.query(HouseAddition).join(HouseAdditionAssociation).filter(HouseAdditionAssociation.id_house == house_id).all()

    def get_addition_by_name(self, name: str):
        return self.session.query(HouseAddition).filter_by(name=name).all()
    
    def add_addition(self, addition_data: dict):
        addition = HouseAddition(**addition_data)
        self.session.add(addition)
        self.session.commit()
        return addition
    
    def update_addition(self, addition_data: dict):
        self.session.query(HouseAddition).filter_by(id=addition_data['id']).update(addition_data)
        self.session.commit()

    def delete_addition(self, addition_id: int):
        self.session.query(HouseAddition).filter_by(id=addition_id).delete()
        self.session.commit()