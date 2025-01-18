from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, DECIMAL, ForeignKey
from models.houses import House

class ApartmentCategory(Base):
    __tablename__ = 'apartment_category'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))

    apartment: Mapped["Apartment"] = relationship("Apartment", back_populates="category")

class Apartment(Base):
    __tablename__ = 'apartments'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    image: Mapped[str] = mapped_column(String(255))
    id_category: Mapped[int] = mapped_column(ForeignKey("apartment_category.id"))
    rooms: Mapped[int] = mapped_column(Integer)
    area: Mapped[int] = mapped_column(DECIMAL)
    id_apartment_parameters: Mapped[int] = mapped_column(ForeignKey("apartment_parameters.id"))
    count: Mapped[int] = mapped_column(Integer)

    category: Mapped["ApartmentCategory"] = relationship("ApartmentCategory", back_populates="apartment")
    apartment_parameter: Mapped["ApartmentParameter"] = relationship("ApartmentParameter", back_populates="apartment")
    house: Mapped["House"] = relationship("House", back_populates="apartment")

class ApartmentParameter(Base):
    __tablename__ = 'apartment_parameters'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(255))

    apartment: Mapped["Apartment"] = relationship("Apartment", back_populates="apartment_parameter")