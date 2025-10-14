from fastapi import FastAPI, Depends
from fastapi.security import HTTPBearer
from app.user.application.user_controller import router as user_router
from app.auth.application.auth_controller import router as auth_router
from app.config.cors_config import setup_cors
from app.config.jwt_middleware import add_jwt_middleware
from app.config.settings import settings
from app.database import get_db  
import psycopg2

security = HTTPBearer()

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

    @app.get("/health", tags=["Health"])
    async def health_check():
        try:
            conn = psycopg2.connect(
                host=settings.POSTGRES_HOST,
                port=settings.POSTGRES_PORT,
                database=settings.POSTGRES_DB,
                user=settings.POSTGRES_USER,
                password=settings.POSTGRES_PASSWORD
            )
            conn.close()
            return {"status": "healthy", "database": "connected"}
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)}

    add_jwt_middleware(app)

    app.include_router(
        user_router,
        prefix="/users",
        tags=["Users"],
        dependencies=[Depends(security)],
    )
    
    app.include_router(auth_router, prefix="/auth", tags=["Auth"])

    # Inicializa base de datos y crea tablas si no existen
    try:
        db = next(get_db())
        db.close()
        print("Base de datos inicializada correctamente.")
    except Exception as e:
        print(f"Error al inicializar la base de datos: {e}")

    return app

app = create_app()
