from pydantic_settings import BaseSettings
from pydantic import Field, field_validator
from pathlib import Path
from typing import Any

# Buscar .env en el directorio raíz del proyecto
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
ENV_FILE = BASE_DIR / ".env"

class Settings(BaseSettings):
    # DB
    DATABASE_URL: str = Field(default="postgresql://group5_user:group5_pass@213.199.42.57:5432/utec_db")
    
    # PostgreSQL specific settings
    POSTGRES_HOST: str = Field(default="213.199.42.57")
    POSTGRES_PORT: int = Field(default=5432)
    POSTGRES_DB: str = Field(default="utec_db")
    POSTGRES_USER: str = Field(default="group5_user")
    POSTGRES_PASSWORD: str = Field(default="group5_pass")
    POSTGRES_SCHEMA: str = Field(default="group5_schema")

    # App
    APP_ENV: str = Field(default="development")
    DEBUG: bool = Field(default=True)

    # Seguridad JWT
    SECRET_KEY: str = Field(default="secret-demo")
    ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=300)

    # Seguridad Passwords
    PASSWORD_SCHEME: str = Field(default="bcrypt")

    # CORS
    ALLOWED_ORIGINS: list[str] = Field(default=["*"])

    # Email Service
    # Tipos: "simulator" (default, imprime en consola) | "smtp" (envío real)
    EMAIL_SERVICE_TYPE: str = Field(default="simulator")

    # Configuración SMTP (solo necesario si EMAIL_SERVICE_TYPE = "smtp")
    SMTP_HOST: str = Field(default="smtp.gmail.com")
    SMTP_PORT: int = Field(default=587)
    SMTP_USER: str = Field(default="")
    SMTP_PASSWORD: str = Field(default="")
    SMTP_FROM_EMAIL: str = Field(default="")

    @field_validator('POSTGRES_PORT', 'SMTP_PORT', mode='before')
    @classmethod
    def validate_port_integers(cls, v: Any) -> int:
        """Convierte cadenas vacías a valores por defecto para puertos"""
        if v == '' or v is None:
            return 5432  # valor por defecto para puertos
        try:
            return int(v)
        except (ValueError, TypeError):
            return 5432

    @field_validator('ACCESS_TOKEN_EXPIRE_MINUTES', mode='before')
    @classmethod
    def validate_token_minutes(cls, v: Any) -> int:
        """Convierte cadenas vacías a valor por defecto para minutos de token"""
        if v == '' or v is None:
            return 30  # valor por defecto para minutos
        try:
            return int(v)
        except (ValueError, TypeError):
            return 30

    @field_validator('DATABASE_URL', mode='before')  
    @classmethod
    def validate_database_url(cls, v: Any) -> str:
        """Proporciona un valor por defecto para DATABASE_URL si está vacío"""
        if v == '' or v is None:
            return "postgresql://group5_user:group5_pass@213.199.42.57:5432/utec_db"
        return str(v)

    @field_validator('DEBUG', mode='before')
    @classmethod
    def validate_boolean(cls, v: Any) -> bool:
        """Convierte cadenas a booleanos"""
        if isinstance(v, str):
            return v.lower() in ('true', '1', 'yes', 'on')
        return bool(v)

    class Config:
        env_file = str(ENV_FILE)

settings = Settings()
