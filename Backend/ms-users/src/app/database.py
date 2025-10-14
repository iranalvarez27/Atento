import psycopg2
import psycopg2.extras
from app.config.settings import settings

def _init_tables(conn):
    cursor = conn.cursor()

    # Set search_path to the specific schema
    cursor.execute(f"SET search_path TO {settings.POSTGRES_SCHEMA}")

    # Create roles table
    cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS {settings.POSTGRES_SCHEMA}.roles (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL,
            description TEXT
        )
    """)

    # Create usuarios table
    cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS {settings.POSTGRES_SCHEMA}.usuarios (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role_id INTEGER NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (role_id) REFERENCES {settings.POSTGRES_SCHEMA}.roles (id)
        )
    """)

    # Check if roles exist and insert default roles
    cursor.execute(f"SELECT COUNT(*) FROM {settings.POSTGRES_SCHEMA}.roles")
    if cursor.fetchone()[0] == 0:
        cursor.executemany(f"INSERT INTO {settings.POSTGRES_SCHEMA}.roles (id, name, description) VALUES (%s, %s, %s)", [
            (1, 'LEARNER', 'Learner user'),
            (2, 'SUPERVISOR', 'Supervisor user'),
            (3, 'ADMIN', 'Administrator user')
        ])

    conn.commit()

def get_db():
    conn = psycopg2.connect(
        host=settings.POSTGRES_HOST,
        port=settings.POSTGRES_PORT,
        database=settings.POSTGRES_DB,
        user=settings.POSTGRES_USER,
        password=settings.POSTGRES_PASSWORD
    )
    conn.autocommit = False

    # Crea el cursor normal
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # Inicializa las tablas (usa el cursor del propio conn)
    _init_tables(conn)

    try:
        yield conn
    finally:
        conn.close()
