#!/usr/bin/env python3
"""
Script de debugging para verificar configuración de PostgreSQL
"""
import sys
import os
sys.path.append('src')

print("DEBUG: Variables de entorno:")
for key in ['DATABASE_URL', 'POSTGRES_HOST', 'POSTGRES_PORT', 'POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD']:
    value = os.environ.get(key, 'NOT_SET')
    if 'PASSWORD' in key:
        print(f"   {key}: {'*' * len(value) if value != 'NOT_SET' else 'NOT_SET'}")
    else:
        print(f"   {key}: {value}")

print("\nDEBUG: Cargando configuracion...")
try:
    from app.config.settings import settings
    print("OK - Configuracion cargada exitosamente")
    print(f"   DATABASE_URL: {settings.DATABASE_URL}")
    print(f"   POSTGRES_HOST: {settings.POSTGRES_HOST}")
    print(f"   POSTGRES_PORT: {settings.POSTGRES_PORT}")
    print(f"   POSTGRES_DB: {settings.POSTGRES_DB}")
    print(f"   POSTGRES_USER: {settings.POSTGRES_USER}")
except Exception as e:
    print(f"ERROR - Error cargando configuracion: {e}")
    sys.exit(1)

print("\nDEBUG: Probando conexion a PostgreSQL...")
try:
    import psycopg2
    conn = psycopg2.connect(
        host=settings.POSTGRES_HOST,
        port=settings.POSTGRES_PORT,
        database=settings.POSTGRES_DB,
        user=settings.POSTGRES_USER,
        password=settings.POSTGRES_PASSWORD
    )
    print("OK - Conexion a PostgreSQL exitosa!")
    conn.close()
except Exception as e:
    print(f"ERROR - Error de conexion a PostgreSQL: {e}")
    sys.exit(1)

print("OK - Todas las verificaciones pasaron!")
