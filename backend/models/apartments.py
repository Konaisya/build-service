from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, DECIMAL, ForeignKey

class ApartmentCategory(Base):
    __tablename__ = 'apartment_category'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))

    apartment: Mapped[list["Apartment"]] = relationship("Apartment", back_populates="category")

class Apartment(Base):
    __tablename__ = 'apartments'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    id_category: Mapped[int] = mapped_column(ForeignKey("apartment_category.id"))
    rooms: Mapped[int] = mapped_column(Integer)
    area: Mapped[int] = mapped_column(DECIMAL)
    id_house: Mapped[int] = mapped_column(ForeignKey("houses.id"))    
    count: Mapped[int] = mapped_column(Integer)

    category: Mapped["ApartmentCategory"] = relationship("ApartmentCategory", back_populates="apartment", cascade="all, delete-orphan")
    parameter: Mapped[list["ApartmentParameter"]] = relationship("ApartmentParameter", secondary='apartment_parameter_association', back_populates="apartment")
    house: Mapped["House"] = relationship("House", back_populates="apartment")
    image: Mapped[list["ApartmentImage"]] = relationship("ApartmentImage", back_populates="apartment", cascade="all, delete-orphan")

class ApartmentParameter(Base):
    __tablename__ = 'apartment_parameters'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(255))

    apartment: Mapped[list["Apartment"]] = relationship("Apartment",secondary="apartment_parameter_association" , back_populates="parameter")

class ApartmentParameterAssociation(Base):
    __tablename__ = 'apartment_parameter_association'

    id_apartment: Mapped[int] = mapped_column(ForeignKey("apartments.id"), primary_key=True)
    id_parameter: Mapped[int] = mapped_column(ForeignKey("apartment_parameters.id"), primary_key=True)

class ApartmentImage(Base):
    __tablename__ = 'apartment_images'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    image: Mapped[str] = mapped_column(String(255))
    id_apartment: Mapped[int] = mapped_column(ForeignKey("apartments.id"))

    apartment: Mapped["Apartment"] = relationship("Apartment", back_populates="image")
