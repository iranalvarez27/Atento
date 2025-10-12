"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AtentoLogo } from "@/components/atento-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { login, logout } from "@/lib/auth"; // Importa tu función de login y logout

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // MEJORA: Llama a la función logout para una limpieza centralizada.
      logout();

      // Llama a la función de login de tu archivo auth.ts
      const user = await login(email, password);

      // MEJORA: Verifica la existencia de 'user' y usa 'role_name'
      if (user && user.role_name) {
        // El rol viene en mayúsculas desde el backend (ADMIN, SUPERVISOR, LEARNER)
        switch (user.role_name) {
          case "ADMIN":
            router.push("/admin/usuarios");
            break;
          case "SUPERVISOR":
            router.push("/supervisor/dashboard");
            break;
          case "LEARNER":
            router.push("/agente/dashboard");
            break;
          default:
            // Un fallback por si el rol no es reconocido
            router.push("/");
        }
      } else {
        // Este caso se activará si el login devuelve null sin lanzar un error
        setError("Credenciales incorrectas. Intenta de nuevo.");
      }
    } catch (err: any) {
      // MEJORA: Muestra el mensaje de error específico del backend.
      console.error("Error capturado en el formulario de login:", err);
      setError(err.message || "Error al iniciar sesión. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0A1734] via-[#0A1734] to-[#3B2447]">
      <div className="flex justify-between items-center px-8 py-6">
        <AtentoLogo variant="full" className="h-10" />
        <span className="text-white text-sm font-medium">Acelerador de Ventas</span>
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/5 backdrop-blur-sm rounded-2xl text-white shadow-none border border-white/10">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-3xl font-bold">Iniciar Sesión</CardTitle>
            <CardDescription className="text-gray-300">
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu.email@atento.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="rounded-full h-12 px-5 bg-white/10 border border-gray-500 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="rounded-full h-12 px-5 bg-white/10 border border-gray-500 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* MEJORA: Componente de alerta de error con mejor estilo */}
              {error && (
                <div className="flex items-center space-x-2 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-red-300">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="text-right -mt-2">
                <Link href="/forgot-password" className="text-sm text-blue-400 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full rounded-full h-12 text-base font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Accediendo..." : "ACCEDER"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}