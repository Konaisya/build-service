from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, DECIMAL, ForeignKey
from models.apartments import Apartment
from models.orders import Order

class House(Base):
    __tablename__ = 'houses'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(255))
    district: Mapped[str] = mapped_column(String(255))
    address: Mapped[str] = mapped_column(String(255))
    floors: Mapped[int] = mapped_column(Integer)
    id_addition: Mapped[int] = mapped_column(ForeignKey("house_additions.id"))
    max_price: Mapped[float] = mapped_column(DECIMAL(10, 2))

    addition: Mapped[list["HouseAddition"]] = relationship("HouseAddition", secondary="house_addition_association", back_populates="house")
    apartment: Mapped[list["Apartment"]] = relationship("Apartment", back_populates="house") 
    order: Mapped["Order"] = relationship("Order", back_populates="house")
    image: Mapped[list["HouseImage"]] = relationship("HouseImage", back_populates="house", cascade="all, delete-orphan")

class HouseAddition(Base):
    __tablename__ = 'house_additions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(255))

    house: Mapped[list["House"]] = relationship("House", secondary="house_addition_association", back_populates="addition")

class HouseAdditionAssociation(Base):
    __tablename__ = 'house_addition_association'

    id_house: Mapped[int] = mapped_column(ForeignKey('houses.id'), primary_key=True)
    id_addition: Mapped[int] = mapped_column(ForeignKey('house_additions.id'), primary_key=True)

class HouseImage(Base):
    __tablename__ = 'house_images'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    image: Mapped[str] = mapped_column(String(255))
    id_house: Mapped[int] = mapped_column(ForeignKey("houses.id"))

    house: Mapped["House"] = relationship("House", back_populates="image")