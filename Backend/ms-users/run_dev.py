#!/usr/bin/env python3
"""
Script para probar el endpoint de health del microservicio ms-users
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

import uvicorn
from app.main import app

if __name__ == "__main__":
    print("Iniciando microservicio ms-users en puerto 5001...")
    print("Health check disponible en: http://localhost:5001/health")
    print("Documentación disponible en: http://localhost:5001/docs")
    print("⏹Presiona Ctrl+C para detener")
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=5001,
        reload=True
    )
