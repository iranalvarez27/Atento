# app/auth/dto/register_response_dto.py
from pydantic import BaseModel

class RegisterResponseDto(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    role_name: str