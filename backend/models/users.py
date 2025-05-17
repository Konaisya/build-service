from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String

class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    org_name: Mapped[str] = mapped_column(String(255), nullable=True)
    role: Mapped[str] = mapped_column(String(255), default='USER')
    email: Mapped[str] = mapped_column(String(255))
    password: Mapped[str] = mapped_column(String(255))

    order: Mapped["Order"] = relationship("Order", back_populates="user")