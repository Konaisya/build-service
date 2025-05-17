from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DECIMAL, ForeignKey, DATE
from datetime import date

class Order(Base):
    __tablename__ = 'orders'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_user: Mapped[int] = mapped_column(ForeignKey("users.id"))
    id_house: Mapped[int] = mapped_column(ForeignKey("houses.id"))
    status: Mapped[str] = mapped_column(String(255))
    contract_price: Mapped[float] = mapped_column(DECIMAL(10, 2))
    create_date: Mapped[date] = mapped_column(DATE)
    update_date: Mapped[date] = mapped_column(DATE, nullable=True)
    payment_date: Mapped[date] = mapped_column(DATE, nullable=True)
    sign_off_date: Mapped[date] = mapped_column(DATE, nullable=True)
    completion_date: Mapped[date] = mapped_column(DATE, nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="order")
    house: Mapped["House"] = relationship("House", back_populates="order")