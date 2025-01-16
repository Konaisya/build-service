from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, DECIMAL, ForeignKey

class House(Base):
    __tablename__ = 'houses'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    image: Mapped[str] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(255))
    district: Mapped[str] = mapped_column(String(255))
    address: Mapped[str] = mapped_column(String(255))
    floors: Mapped[int] = mapped_column(Integer)
    id_addition: Mapped[int] = mapped_column(ForeignKey("house_additions.id"))
    id_apartment: Mapped[int] = mapped_column(ForeignKey("apartments.id"))
    max_price: Mapped[float] = mapped_column(DECIMAL(10, 2))

    addition: Mapped["HouseAddition"] = relationship("HouseAddition", back_populates="house")
    apartment: Mapped["Apartment"] = relationship("Apartment", back_populates="house") 
    order: Mapped["Order"] = relationship("Order", back_populates="house")

class HouseAddition(Base):
    __tablename__ = 'house_additions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    price: Mapped[float] = mapped_column(DECIMAL(10, 2))

    house: Mapped["House"] = relationship("House", back_populates="addition")