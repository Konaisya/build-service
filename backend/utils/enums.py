from enum import Enum

class Status(Enum):
    SUCCESS = 'SUCCESS'
    FAILED = 'FAILED'
    NOT_FOUND = 'NOT_FOUND'
    UNAUTHORIZED = 'UNAUTHORIZED'

class AuthStatus(Enum):
    SUCCESS = 'SUCCESS'
    FAILED = 'FAILED'
    INVALID_TOKEN = 'INVALID_TOKEN'
    INVALID_USER = 'INVALID_USER'
    INVALID_PASSWORD = 'INVALID_PASSWORD'
    INVALID_EMAIL = 'INVALID_EMAIL'
    INVALID_USERNAME = 'INVALID_USERNAME'
    INVALID_ROLE = 'INVALID_ROLE'
    INVALID_STATUS = 'INVALID_STATUS'
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS'
    INVALID_EMAIL_OR_PASSWORD = 'INVALID_EMAIL_OR_PASSWORD'
    TOKEN_EXPIRED = 'TOKEN_EXPIRED'
    USER_NOT_FOUND = 'USER_NOT_FOUND'
    FORBIDDEN = 'FORBIDDEN'

class Roles(Enum):
    ADMIN = 'ADMIN'
    USER = 'USER'

class OrderStatus(str, Enum):
    PENDING = 'PENDING'
    APPROVED = 'APPROVED' # Утвержден, ожидает начала работ
    IN_PROGRESS = "IN_PROGRESS" # В процессе строительства
    AWAITING_PAYMENT = "AWAITING_PAYMENT"
    PAID = 'PAID'
    AWAITING_SIGN_OFF = "AWAITING_SIGN_OFF" # Проверка работы
    SIGNED = "SIGNED" # Подписан акт
    COMPLETED = "COMPLETED" 
    CANCELLED = "CANCELLED"
    SOLD = "SOLD" # Особый статус для заказа если куплен готовый дом
    

class HouseStatus(str, Enum):
    PROJECT = "PROJECT"  # Проектируется
    PLANNED = "PLANNED"  # Утвержден, ожидает начала строительства
    IN_PROGRESS = "IN_PROGRESS"  # В процессе строительства
    SUSPENDED = "SUSPENDED"  # Строительство приостановлено
    BUILT = "BUILT"  # Строительство завершено
    FOR_SALE = "FOR_SALE"  # Выставлен на продажу
    SOLD = "SOLD"  # Продан
    ARCHIVED = "ARCHIVED"  # Переведен в архив, неактивен
