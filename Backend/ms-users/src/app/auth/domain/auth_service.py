from fastapi import HTTPException, status
from app.user.infrastructure.user_repository import UserRepository
from app.user.domain.user_service import UserService
from app.config.jwt_service import JwtService
from app.config.security_config import PasswordHasher
from app.auth.dto.login_request_dto import LoginRequestDto
from app.auth.dto.register_request_dto import RegisterRequestDto
from app.auth.dto.auth_response_dto import AuthResponseDto
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


    def register(self, request: RegisterRequestDto) -> AuthResponseDto:
        
        create_request = CreateUserRequest(
            first_name=request.first_name,
            last_name=request.last_name,
            email=request.email,
            password=request.password,
            role_id=request.role_id
        )
        user = self.user_service.create_user(create_request)

        token_payload = {
            "sub": str(user["id"]),
            "email": user["email"],
            "role": ROLE_MAPPING.get(user["role_id"], "UNKNOWN")
        }
        token = self.jwt_service.generate_token(token_payload)

        return AuthResponseDto(
            access_token=token,
            user_id=user["id"],
            email=user["email"],
            role_name=ROLE_MAPPING.get(user["role_id"], "UNKNOWN")
        )

    def login(self, request: LoginRequestDto) -> AuthResponseDto:
        # Buscar usuario
        user = self.user_repository.get_user_by_email(request.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales inválidas"
            )

        # RN-0001: Validar que el usuario esté activo
        if not user.get("is_active"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cuenta de usuario esta deshabilitada"
            )

        # Verificar contraseña
        if not self.hasher.verify(request.password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales inválidas"
            )

        # Preparar payload para token
        token_payload = {
            "sub": str(user["id"]),
            "email": user["email"],
            "role": ROLE_MAPPING.get(user["role_id"], "UNKNOWN")
        }
        token = self.jwt_service.generate_token(token_payload)

        return AuthResponseDto(
            # message="Login successful", # Este campo no está en el DTO, lo quitamos
            access_token=token,                      # <-- CAMBIO: De 'token' a 'access_token'
            user_id=user['id'],                      # <-- CORRECTO: Mantenemos el user_id
            email=user["email"],
            role_name=ROLE_MAPPING.get(user["role_id"], "UNKNOWN") # <-- CAMBIO: De 'role' a 'role_name'
        )
