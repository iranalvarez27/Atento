from fastapi import HTTPException, status
from app.user.infrastructure.user_repository import UserRepository
from app.user.domain.user_service import UserService
from app.config.jwt_service import JwtService
from app.config.security_config import PasswordHasher
from app.config.verification_code_service import verification_service
from app.config.email_service import get_email_service
from app.config.settings import settings
from app.auth.dto.login_request_dto import LoginRequestDto
from app.auth.dto.register_request_dto import RegisterRequestDto
from app.auth.dto.auth_response_dto import AuthResponseDto
from app.auth.dto.forgot_password_request_dto import ForgotPasswordRequest
from app.auth.dto.verify_code_request_dto import VerifyCodeRequest
from app.auth.dto.reset_password_request_dto import ResetPasswordRequest
from app.user.dto.create_user_request_dto import CreateUserRequest

ROLE_MAPPING = {
    1: "LEARNER",
    2: "SUPERVISOR",
    3: "ADMIN"
}

class AuthService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
        self.user_service = UserService(user_repository)
        self.hasher = PasswordHasher()
        self.jwt_service = JwtService()
        self.email_service = get_email_service()

    def register(self, request: RegisterRequestDto) -> AuthResponseDto:
        # Delegar creación de usuario a UserService (evita duplicación)
        create_request = CreateUserRequest(
            first_name=request.first_name,
            last_name=request.last_name,
            email=request.email,
            password=request.password,
            role_id=request.role_id
        )
        user = self.user_service.create_user(create_request)

        # Preparar payload para token
        token_payload = {
            "sub": str(user["id"]),
            "email": user["email"],
            "role": ROLE_MAPPING.get(user["role_id"], "UNKNOWN")
        }
        token = self.jwt_service.generate_token(token_payload)

        return AuthResponseDto(
            message="User registered successfully",
            email=user["email"],
            role=ROLE_MAPPING.get(user["role_id"], "UNKNOWN"),
            token=token
        )

    def login(self, request: LoginRequestDto) -> AuthResponseDto:
        # Buscar usuario
        user = self.user_repository.get_user_by_email(request.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        # RN-0001: Validar que el usuario esté activo
        if not user.get("is_active"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is disabled"
            )

        # Verificar contraseña
        if not self.hasher.verify(request.password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        # Preparar payload para token
        token_payload = {
            "sub": str(user["id"]),
            "email": user["email"],
            "role": ROLE_MAPPING.get(user["role_id"], "UNKNOWN")
        }
        token = self.jwt_service.generate_token(token_payload)

        return AuthResponseDto(
            message="Login successful",
            email=user["email"],
            role=ROLE_MAPPING.get(user["role_id"], "UNKNOWN"),
            token=token
        )

    def forgot_password(self, request: ForgotPasswordRequest) -> dict:
        """
        CU002: Recuperar Contraseña - Paso 1
        Genera y envía un código de verificación al email del usuario.

        Flujo:
        1. Valida que el email exista en la BD
        2. Valida que la cuenta esté habilitada
        3. Genera código de verificación
        4. Envía código por email
        """
        # Buscar usuario por email
        user = self.user_repository.get_user_by_email(request.email)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Email not found or not registered"
            )

        # RN-0001: Validar que el usuario esté activo
        if not user.get("is_active"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is disabled. Please contact an administrator or supervisor"
            )

        # Generar código de verificación
        code = verification_service.generate_code(request.email)

        # Enviar código por email
        email_sent = self.email_service.send_verification_code(request.email, code)

        if not email_sent:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send verification email"
            )

        return {
            "message": "Verification code sent successfully. Please check your email.",
            "email": request.email
        }

    def verify_code(self, request: VerifyCodeRequest) -> dict:
        """
        CU002: Recuperar Contraseña - Paso 2 (Opcional)
        Verifica si el código ingresado es válido.

        Nota: Este endpoint es opcional. El código también se verifica en reset_password.
        """
        is_valid = verification_service.verify_code(request.email, request.code)

        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired verification code"
            )

        return {
            "message": "Verification code is valid",
            "email": request.email
        }

    def reset_password(self, request: ResetPasswordRequest) -> dict:
        """
        CU002: Recuperar Contraseña - Paso 3
        Resetea la contraseña del usuario usando el código de verificación.

        Flujo:
        1. Verifica que el código sea válido
        2. Valida que el usuario exista y esté activo
        3. Valida que la nueva contraseña cumpla políticas de seguridad (validado en DTO)
        4. Actualiza la contraseña en BD
        5. Invalida el código usado
        """
        # Verificar código
        is_valid = verification_service.verify_code(request.email, request.code)

        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired verification code"
            )

        # Buscar usuario
        user = self.user_repository.get_user_by_email(request.email)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # RN-0001: Validar que el usuario esté activo
        if not user.get("is_active"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot reset password for disabled user"
            )

        # Hash nueva contraseña (RN-0006: Seguridad)
        new_hashed_password = self.hasher.hash(request.new_password)

        # Actualizar contraseña en BD
        cursor = self.user_repository.db.cursor()
        cursor.execute(f"""
            UPDATE {settings.POSTGRES_SCHEMA}.usuarios 
            SET password = %s, updated_at = %s
            WHERE id = %s
        """, (new_hashed_password, __import__('datetime').datetime.now(), user['id']))
        self.user_repository.db.commit()

        # Invalidar código usado
        verification_service.invalidate_code(request.email)

        return {
            "message": "Password reset successfully. You can now login with your new password.",
            "email": request.email
        }
