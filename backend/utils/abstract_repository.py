from abc import ABC, abstractmethod
from sqlalchemy.orm import Session

class AbstractRepository(ABC):
    @abstractmethod
    def get_all_filter_by(self):
        pass

    @abstractmethod
    def get_one_filter_by(self, id):
        pass
    
    @abstractmethod
    def add(self, entity):
        pass

    @abstractmethod
    def update(self, entity):
        pass

    @abstractmethod
    def delete(self, entity):
        pass

    @abstractmethod
    def delete_by_filter(self, **filter):
        pass

class IREpository(AbstractRepository):
    def __init__(self, model, session: Session):
        self.model = model
        self.session = session

    def get_all_filter_by(self, **filter):
        return self.session.query(self.model).filter_by(**filter).all()

    def get_one_filter_by(self, **filter):
        return self.session.query(self.model).filter_by(**filter).first()

    def add(self, entity: dict):
        entity = self.model(**entity)
        self.session.add(entity)
        self.session.commit()
        return entity

    def update(self, id: int, entity):
        self.session.query(self.model).filter_by(id=id).update(entity)
        self.session.commit()
        updated_entity = self.session.query(self.model).filter_by(id=id).first()
        return updated_entity

    def delete(self, id: int):
        self.session.query(self.model).filter_by(id=id).delete()
        self.session.commit()

    def delete_by_filter(self, **filter):
        result = self.session.query(self.model).filter_by(**filter).delete()
        self.session.commit()
        return result > 0
