from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DECIMAL, ForeignKey
from datetime import datetime

class Order(Base):
    __tablename__ = 'orders'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_user: Mapped[int] = mapped_column(ForeignKey("users.id"))
    id_house: Mapped[int] = mapped_column(ForeignKey("houses.id"))
    status: Mapped[str] = mapped_column(String(255))
    min_price: Mapped[float] = mapped_column(DECIMAL(10, 2))
    max_price: Mapped[float] = mapped_column(DECIMAL(10, 2))
    begin_date: Mapped[str] = mapped_column(String(255), default=datetime.now().date())
    end_date: Mapped[str] = mapped_column(String(255))

    user: Mapped["User"] = relationship("User", back_populates="order")
    house: Mapped["House"] = relationship("House", back_populates="order")