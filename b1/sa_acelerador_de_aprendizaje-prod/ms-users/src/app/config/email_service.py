from abc import ABC, abstractmethod
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config.settings import settings


class EmailService(ABC):
    """
    Interfaz abstracta para servicios de email.
    Permite cambiar fácilmente entre diferentes implementaciones (simulador, SMTP, etc.)
    """

    @abstractmethod
    def send_verification_code(self, to_email: str, code: str) -> bool:
        """
        Envía un código de verificación al email especificado.
        Retorna True si se envió exitosamente, False en caso contrario.
        """
        pass


class EmailSimulatorService(EmailService):
    """
    Implementación de prueba que simula el envío de emails.
    Imprime los correos en la consola en lugar de enviarlos realmente.
    Perfecto para desarrollo y testing.
    """

    def send_verification_code(self, to_email: str, code: str) -> bool:
        print("\n" + "="*60)
        print("EMAIL SIMULADO - CODIGO DE VERIFICACION")
        print("="*60)
        print(f"Para: {to_email}")
        print(f"Asunto: Recuperar contrasena - Acelerador de Aprendizaje")
        print("-"*60)
        print(f"Hola,")
        print(f"\nHas solicitado recuperar tu contrasena.")
        print(f"\nTu codigo de verificacion es: {code}")
        print(f"\nEste codigo es valido por 15 minutos.")
        print(f"\nSi no solicitaste este cambio, ignora este mensaje.")
        print("-"*60)
        print("Email 'enviado' exitosamente (simulado)")
        print("="*60 + "\n")
        return True


class EmailSMTPService(EmailService):
    """
    Implementación real que envía emails usando SMTP.
    Requiere configuración en settings.py:
    - SMTP_HOST
    - SMTP_PORT
    - SMTP_USER
    - SMTP_PASSWORD
    - SMTP_FROM_EMAIL
    """

    def __init__(self):
        self.smtp_host = getattr(settings, 'SMTP_HOST', None)
        self.smtp_port = getattr(settings, 'SMTP_PORT', 587)
        self.smtp_user = getattr(settings, 'SMTP_USER', None)
        self.smtp_password = getattr(settings, 'SMTP_PASSWORD', None)
        self.from_email = getattr(settings, 'SMTP_FROM_EMAIL', self.smtp_user)

    def send_verification_code(self, to_email: str, code: str) -> bool:
        """
        Envía un email real con el código de verificación.
        """
        if not all([self.smtp_host, self.smtp_user, self.smtp_password]):
            print("ERROR: Configuracion SMTP incompleta en settings.py")
            return False

        try:
            # Crear mensaje
            msg = MIMEMultipart('alternative')
            msg['Subject'] = 'Recuperar contraseña - Acelerador de Aprendizaje'
            msg['From'] = self.from_email
            msg['To'] = to_email

            # Cuerpo del email (texto plano)
            text = f"""
Hola,

Has solicitado recuperar tu contraseña.

Tu código de verificación es: {code}

Este código es válido por 15 minutos.

Si no solicitaste este cambio, ignora este mensaje.

Saludos,
Equipo de Acelerador de Aprendizaje
            """

            # Cuerpo del email (HTML - opcional)
            html = f"""
<html>
  <body>
    <h2>Recuperar contraseña</h2>
    <p>Hola,</p>
    <p>Has solicitado recuperar tu contraseña.</p>
    <p><strong>Tu código de verificación es: <span style="font-size: 24px; color: #007bff;">{code}</span></strong></p>
    <p>Este código es válido por 15 minutos.</p>
    <p>Si no solicitaste este cambio, ignora este mensaje.</p>
    <br>
    <p>Saludos,<br>Equipo de Acelerador de Aprendizaje</p>
  </body>
</html>
            """

            # Adjuntar partes del mensaje
            part1 = MIMEText(text, 'plain')
            part2 = MIMEText(html, 'html')
            msg.attach(part1)
            msg.attach(part2)

            # Enviar email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)

            print(f"Email enviado exitosamente a {to_email}")
            return True

        except Exception as e:
            print(f"ERROR al enviar email: {str(e)}")
            return False


# Factory para obtener el servicio de email configurado
def get_email_service() -> EmailService:
    """
    Retorna la implementación de EmailService configurada.

    Para cambiar entre simulador y SMTP real, modifica la variable
    EMAIL_SERVICE_TYPE en settings.py:
    - "simulator" -> EmailSimulatorService (default)
    - "smtp" -> EmailSMTPService
    """
    service_type = getattr(settings, 'EMAIL_SERVICE_TYPE', 'simulator')

    if service_type == 'smtp':
        return EmailSMTPService()
    else:
        return EmailSimulatorService()
