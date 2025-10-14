from fastapi import FastAPI, Depends
from fastapi.security import HTTPBearer
from app.user.application.user_controller import router as user_router
from app.auth.application.auth_controller import router as auth_router
from app.config.cors_config import setup_cors
from app.config.jwt_middleware import add_jwt_middleware
import psycopg2
from app.config.settings import settings

security = HTTPBearer()  # solo para documentar/activar Authorize en Swagger

def create_app() -> FastAPI:
    app = FastAPI(
        title="MS-USERS",
        version="1.0.0",
        description="Microservice for user and auth management",
        swagger_ui_parameters={"persistAuthorization": True},
        openapi_tags=[
            {"name": "Health", "description": "Health check endpoints"},
            {"name": "Users", "description": "User management endpoints"},
            {"name": "Auth", "description": "Authentication endpoints"},
        ],
    )

    setup_cors(app)
    
    # Health check endpoint (debe ir ANTES del middleware JWT)
    @app.get("/health", tags=["Health"])
    async def health_check():
        """
        Health check endpoint para verificar el estado del microservicio.
        Verifica la conexión a la base de datos PostgreSQL.
        """
        try:
            print(f"🔍 DEBUG - Intentando conectar a PostgreSQL:")
            print(f"   HOST: {settings.POSTGRES_HOST}")
            print(f"   PORT: {settings.POSTGRES_PORT}")
            print(f"   DB: {settings.POSTGRES_DB}")
            print(f"   USER: {settings.POSTGRES_USER}")
            print(f"   DATABASE_URL: {settings.DATABASE_URL}")
            
            # Verificar conexión a PostgreSQL
            conn = psycopg2.connect(
                host=settings.POSTGRES_HOST,
                port=settings.POSTGRES_PORT,
                database=settings.POSTGRES_DB,
                user=settings.POSTGRES_USER,
                password=settings.POSTGRES_PASSWORD
            )
            conn.close()
            
            return {
                "status": "healthy",
                "service": "ms-users",
                "version": "1.0.0",
                "database": "connected",
                "config": {
                    "host": settings.POSTGRES_HOST,
                    "port": settings.POSTGRES_PORT,
                    "database": settings.POSTGRES_DB
                },
                "timestamp": __import__('datetime').datetime.now().isoformat()
            }
        except Exception as e:
            print(f"❌ ERROR en health check: {e}")
            return {
                "status": "unhealthy",
                "service": "ms-users",
                "version": "1.0.0",
                "database": "disconnected",
                "config": {
                    "host": settings.POSTGRES_HOST,
                    "port": settings.POSTGRES_PORT,
                    "database": settings.POSTGRES_DB
                },
                "error": str(e),
                "timestamp": __import__('datetime').datetime.now().isoformat()
            }
    
    # JWT middleware se aplica DESPUÉS del health check
    add_jwt_middleware(app)

    
    app.include_router(
        user_router,
        prefix="/users",
        tags=["Users"],
        dependencies=[Depends(security)],   # <- activa Authorize para /users/*
    )
    
    app.include_router(auth_router, prefix="/auth", tags=["Auth"])

    return app

app = create_app()
