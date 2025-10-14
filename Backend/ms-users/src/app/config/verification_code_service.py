import random
import string
from datetime import datetime, timedelta
from typing import Optional, Dict

class VerificationCodeService:
    """
    Servicio para generar y validar códigos de verificación.
    Los códigos se almacenan en memoria (se pierden al reiniciar el servidor).

    Estructura: {email: {"code": "123456", "expires_at": datetime}}
    """

    def __init__(self):
        self._codes: Dict[str, Dict] = {}
        self.code_length = 6
        self.expiration_minutes = 15  # Código válido por 15 minutos

    def generate_code(self, email: str) -> str:
        """
        Genera un código de 6 dígitos y lo almacena con su fecha de expiración.
        Si ya existe un código para ese email, lo sobrescribe.
        """
        code = ''.join(random.choices(string.digits, k=self.code_length))
        expires_at = datetime.now() + timedelta(minutes=self.expiration_minutes)

        self._codes[email] = {
            "code": code,
            "expires_at": expires_at
        }

        return code

    def verify_code(self, email: str, code: str) -> bool:
        """
        Verifica si el código es válido para el email dado.
        Retorna True si es válido, False en caso contrario.
        """
        if email not in self._codes:
            return False

        stored_data = self._codes[email]
        stored_code = stored_data["code"]
        expires_at = stored_data["expires_at"]

        # Verificar si el código ha expirado
        if datetime.now() > expires_at:
            # Eliminar código expirado
            del self._codes[email]
            return False

        # Verificar si el código coincide
        return stored_code == code

    def invalidate_code(self, email: str) -> None:
        """
        Invalida (elimina) el código para un email específico.
        Se usa después de resetear exitosamente la contraseña.
        """
        if email in self._codes:
            del self._codes[email]

    def get_code_info(self, email: str) -> Optional[Dict]:
        """
        Obtiene información del código para un email (útil para debugging).
        """
        return self._codes.get(email)


# Instancia singleton para usar en toda la aplicación
verification_service = VerificationCodeService()
