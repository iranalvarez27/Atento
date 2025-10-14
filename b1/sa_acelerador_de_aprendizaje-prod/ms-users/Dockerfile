FROM python:3.12-slim

# Evita que Python genere archivos .pyc y use stdout/stderr bufferizados
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Instala dependencias del sistema (libpq para postgres)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

  
COPY requirements.txt .

# Instala las dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código
COPY . .

# Hacer ejecutable el script de debugging
RUN chmod +x debug_db.py

# Exponer el puerto donde correrá FastAPI
EXPOSE 5001

# Variables de entorno
ENV PYTHONPATH=/app/src
ENV API_PORT=5001
ENV API_HOST=0.0.0.0

# Comando por defecto: ejecutar FastAPI desde el directorio src
CMD ["uvicorn", "src.app.main:app", "--host", "0.0.0.0", "--port", "5001"]
