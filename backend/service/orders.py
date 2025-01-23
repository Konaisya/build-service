from utils.abstract_repository import IREpository
from models.orders import Order

class OrderService:
    def __init__(self, model, session):
        self.model = Order
        self.session = session

    def get_all_filter_by(self, **filter):
        return self.session.query(self.model).filter_by(**filter).all()
    
    def get_one_filter_by(self, **filter):
        return self.session.query(self.model).filter_by(**filter).first()
    
    def create(self, entity: dict):
        entity = self.model(**entity)
        self.session.add(entity)
        self.session.commit()
        return entity
    
    def update(self, entity: dict):
        self.session.query(self.model).filter_by(id=entity['id']).update(entity)
        self.session.commit()
        return entity
    
    def delete(self, id: int):
        self.session.query(self.model).filter_by(id=id).delete()
        self.session.commit()