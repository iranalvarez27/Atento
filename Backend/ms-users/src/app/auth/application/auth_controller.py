from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from app.auth.dto.login_request_dto import LoginRequestDto
from app.auth.dto.auth_response_dto import AuthResponseDto
from app.auth.dto.register_request_dto import RegisterRequestDto
from app.auth.dto.forgot_password_request_dto import ForgotPasswordRequest
from app.auth.dto.verify_code_request_dto import VerifyCodeRequest
from app.auth.dto.reset_password_request_dto import ResetPasswordRequest
from app.auth.dto.register_response_dto import RegisterResponseDto
from app.auth.domain.auth_service import AuthService
from app.database import get_db
from app.user.infrastructure.user_repository import UserRepository

router = APIRouter()

def get_auth_service(conn=Depends(get_db)) -> AuthService:
    repository = UserRepository(conn)
    return AuthService(repository)

@router.post("/register", response_model=AuthResponseDto, status_code=201)
def register_user(
    request: RegisterRequestDto,
    service: AuthService = Depends(get_auth_service)
):
    try:
        new_user_data = service.register(request)
        return new_user_data
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.post("/login", response_model=AuthResponseDto)
def login_user(
    request: LoginRequestDto,
    service: AuthService = Depends(get_auth_service)
):
    try:
        response = service.login(request)
        return response
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    
@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(
    request: ForgotPasswordRequest,
    service: AuthService = Depends(get_auth_service)
):
    """
    CU002: Recuperar Contrasena - Paso 1

    Genera y envia un codigo de verificacion al email del usuario.

    Requiere:
    - email: Email registrado del usuario

    Responde:
    - 200: Codigo enviado exitosamente
    - 404: Email no encontrado
    - 403: Cuenta deshabilitada
    - 500: Error al enviar email
    """
    try:
        response = service.forgot_password(request)
        return JSONResponse(status_code=200, content=response)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@router.post("/verify-code", status_code=status.HTTP_200_OK)
def verify_code(
    request: VerifyCodeRequest,
    service: AuthService = Depends(get_auth_service)
):
    """
    CU002: Recuperar Contrasena - Paso 2 (Opcional)

    Verifica si el codigo de verificacion es valido.

    Requiere:
    - email: Email del usuario
    - code: Codigo de verificacion recibido por email

    Responde:
    - 200: Codigo valido
    - 400: Codigo invalido o expirado
    """
    try:
        response = service.verify_code(request)
        return JSONResponse(status_code=200, content=response)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(
    request: ResetPasswordRequest,
    service: AuthService = Depends(get_auth_service)
):
    """
    CU002: Recuperar Contrasena - Paso 3

    Resetea la contrasena del usuario usando el codigo de verificacion.

    Requiere:
    - email: Email del usuario
    - code: Codigo de verificacion valido
    - new_password: Nueva contrasena (minimo 6 caracteres)

    Responde:
    - 200: Contrasena reseteada exitosamente
    - 400: Codigo invalido/expirado o contrasena no cumple politicas
    - 403: Cuenta deshabilitada
    - 404: Usuario no encontrado
    """
    try:
        response = service.reset_password(request)
        return JSONResponse(status_code=200, content=response)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
