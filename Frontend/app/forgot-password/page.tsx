"use client";

import type React from "react";
import { useState } from "react";
import { AtentoLogo } from "@/components/atento-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { forgotPassword } from "@/lib/auth"; // Importamos la nueva función

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Limpiamos errores previos

    try {
      // Llamamos a la función real de la API
      await forgotPassword(email);
      setIsSubmitted(true); // Si no hay error, mostramos la pantalla de éxito
    } catch (err: any) {
      // Si la API devuelve un error, lo mostramos al usuario
      setError(err.message || "Ocurrió un error. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0A1734] via-[#0A1734] to-[#3B2447]">
        <div className="flex justify-between items-center px-8 py-6">
          <AtentoLogo variant="full" className="h-10" />
          <span className="text-white text-sm font-medium">Acelerador De Aprendizaje</span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md bg-transparent text-white shadow-none border-0">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-500/80">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Correo Enviado</CardTitle>
              <CardDescription className="text-gray-300">
                Hemos enviado las instrucciones para restablecer tu contraseña a <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className="rounded-md bg-white/10 border border-gray-600 [&_*]:!text-gray-200">
                  <AlertDescription>
                    Revisa tu bandeja de entrada y sigue las instrucciones del correo. Si no lo encuentras, revisa tu carpeta de spam.
                  </AlertDescription>
                </Alert>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full rounded-full border border-blue-400 text-blue-400 bg-transparent hover:bg-blue-500/10"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al inicio de sesión
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0A1734] via-[#0A1734] to-[#3B2447]">
      <div className="flex justify-between items-center px-8 py-6">
        <AtentoLogo variant="full" className="h-10" />
        <span className="text-white text-sm font-medium">Acelerador De Aprendizaje</span>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md bg-transparent text-white shadow-none border-0">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-2xl font-bold">Recuperar Contraseña</CardTitle>
            <CardDescription className="text-gray-300">
              Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu.email@atento.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="rounded-full bg-white/10 border border-gray-500 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Bloque para mostrar errores de la API */}
              {error && (
                <div className="flex items-center space-x-2 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-red-300">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full rounded-full border border-blue-400 text-blue-400 font-semibold bg-transparent hover:bg-blue-500/10"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar Instrucciones"}
              </Button>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full rounded-full border border-blue-400 text-blue-400 bg-transparent hover:bg-blue-500/10"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al inicio de sesión
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
