from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, DECIMAL, ForeignKey

class ApartmentCategory(Base):
    __tablename__ = 'apartment_category'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))

    apartments: Mapped[list["Apartment"]] = relationship("Apartment", back_populates="category")


class Apartment(Base):
    __tablename__ = 'apartments'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    main_image: Mapped[str] = mapped_column(String(255), default='placeholder.png')
    id_category: Mapped[int] = mapped_column(ForeignKey("apartment_category.id"))
    rooms: Mapped[int] = mapped_column(Integer)
    area: Mapped[float] = mapped_column(DECIMAL)
    id_house: Mapped[int] = mapped_column(ForeignKey("houses.id"))    
    count: Mapped[int] = mapped_column(Integer)

    category: Mapped["ApartmentCategory"] = relationship("ApartmentCategory", back_populates="apartments")
    house: Mapped["House"] = relationship("House", back_populates="apartments")

    parameters: Mapped[list["ApartmentParameter"]] = relationship("ApartmentParameter", back_populates="apartment")
    images: Mapped[list["ApartmentImage"]] = relationship("ApartmentImage", back_populates="apartment")


class Parameter(Base):
    __tablename__ = 'parameters'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))

    apartments: Mapped[list["ApartmentParameter"]] = relationship("ApartmentParameter", back_populates="parameter")


class ApartmentParameter(Base):
    __tablename__ = 'apartments_parameters'

    id_apartment: Mapped[int] = mapped_column(ForeignKey("apartments.id"), primary_key=True)
    id_parameter: Mapped[int] = mapped_column(ForeignKey("parameters.id"), primary_key=True)
    value: Mapped[str] = mapped_column(String(255))

    apartment: Mapped["Apartment"] = relationship("Apartment", back_populates="parameters")
    parameter: Mapped["Parameter"] = relationship("Parameter", back_populates="apartments")


class ApartmentImage(Base):
    __tablename__ = 'apartment_images'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    image: Mapped[str] = mapped_column(String(255))
    id_apartment: Mapped[int] = mapped_column(ForeignKey("apartments.id"))

    apartment: Mapped["Apartment"] = relationship("Apartment", back_populates="images")
