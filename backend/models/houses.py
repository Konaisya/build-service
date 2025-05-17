from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, DECIMAL, ForeignKey, Boolean, DATE
from datetime import date

class House(Base):
    __tablename__ = 'houses'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    main_image: Mapped[str] = mapped_column(String(255), default='placeholder.png')
    status: Mapped[str] = mapped_column(String(255))
    is_order: Mapped[bool] = mapped_column(Boolean)
    district: Mapped[str] = mapped_column(String(255))
    address: Mapped[str] = mapped_column(String(255))
    floors: Mapped[int] = mapped_column(Integer)
    entrances: Mapped[int] = mapped_column(Integer)
    begin_date: Mapped[date] = mapped_column(DATE)
    end_date: Mapped[date] = mapped_column(DATE)
    start_price: Mapped[float] = mapped_column(DECIMAL(10, 2))
    final_price: Mapped[float] = mapped_column(DECIMAL(10, 2))

    # Связи
    attributes: Mapped[list["HouseAttribute"]] = relationship("HouseAttribute", back_populates="house")
    apartments: Mapped[list["Apartment"]] = relationship("Apartment", back_populates="house")
    order: Mapped["Order"] = relationship("Order", back_populates="house", uselist=False)
    images: Mapped[list["HouseImage"]] = relationship("HouseImage", back_populates="house")


class Attribute(Base):
    __tablename__ = 'attributes'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)

    # Связи
    houses: Mapped[list["HouseAttribute"]] = relationship("HouseAttribute", back_populates="attribute")


class HouseAttribute(Base):
    __tablename__ = 'house_attributes'

    id_house: Mapped[int] = mapped_column(ForeignKey('houses.id'), primary_key=True)
    id_attribute: Mapped[int] = mapped_column(ForeignKey('attributes.id'), primary_key=True)
    value: Mapped[str] = mapped_column(String(255))

    # Связи
    house: Mapped["House"] = relationship("House", back_populates="attributes")
    attribute: Mapped["Attribute"] = relationship("Attribute", back_populates="houses")


class HouseImage(Base):
    __tablename__ = 'house_images'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_house: Mapped[int] = mapped_column(ForeignKey("houses.id"))
    image: Mapped[str] = mapped_column(String(255))

    # Связь
    house: Mapped["House"] = relationship("House", back_populates="images")
