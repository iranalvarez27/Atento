"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AtentoLogo } from "@/components/atento-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { login } from "@/lib/auth"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = login(email, password)
      if (user) {
        switch (user.role) {
          case "agente":
            router.push("/agente/dashboard")
            break
          case "supervisor":
            router.push("/supervisor/dashboard")
            break
          case "admin":
            router.push("/admin/usuarios")
            break
        }
      } else {
        setError("Credenciales incorrectas. Intenta de nuevo.")
      }
    } catch (err) {
      setError("Error al iniciar sesión. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0A1734] via-[#0A1734] to-[#3B2447]">
      <div className="flex justify-between items-center px-8 py-6">
        <AtentoLogo variant="full" className="h-10" />
        <span className="text-white text-sm font-medium">Acelerador De Aprendizaje</span>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md border border-white bg-transparent text-white rounded-xl shadow-lg">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
            <CardDescription className="text-gray-300">
              Ingresa tus credenciales para acceder al sistema de entrenamiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="rounded-full bg-gray-700 border border-gray-600 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400"
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
                  className="rounded-full bg-gray-700 border border-gray-600 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="rounded-md">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Acceder"}
              </Button>

              <div className="text-center">
                <Link href="/forgot-password" className="text-sm text-blue-400 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
