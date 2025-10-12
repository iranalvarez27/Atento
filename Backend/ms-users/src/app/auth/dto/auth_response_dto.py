from pydantic import BaseModel, EmailStr
from typing import Optional

class AuthResponseDto(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int          # <-- CAMBIO: Se añade user_id
    email: str
    role_name: str        # <-- CAMBIO: Se ajusta a role_name
