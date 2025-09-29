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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0A1734]  to-[#3B2447]">
      <div className="flex justify-between items-center px-8 py-6">
        <AtentoLogo variant="full" className="h-10" />
        <span className="text-white text-[16px] ">Acelerador De Aprendizaje</span>
      </div>
      <div className="flex items-center justify-center py-30">
        <Card className="w-full max-w-md bg-transparent text-white shadow-none border-0">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-[30px] ">Iniciar Sesión</CardTitle>
            <CardDescription className="text-[15px] text-gray-300 italic">
              Ingresa tus credenciales para acceder al sistema de entrenamiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-9">
              <div className="space-y-4">
                <Label htmlFor="email" className="px-3 text-[18px] text-gray-200">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu.email@atento.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="rounded-full text-[18px] bg-white/20 text-white placeholder:text-gray-390 focus:ring-2 focus:ring-white"
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="password" className="px-3 text-[18px] text-gray-200">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="rounded-full text-[18px] bg-white/20 text-white placeholder:text-gray-390 focus:ring-2 focus:ring-white"
                />
              </div>
              {error && (
                <Alert variant="destructive" className="rounded-md">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="text-right -mt-8">
                <Link
                  href="/forgot-password"
                  className=" italic px-4 text-[14px] text-sm text-[#81C7EA] underline hover:text-white"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="w-50 rounded-full border border-[#81C7EA] text-[#81C7EA] font-semibold bg-transparent bg-transparent hover:bg-[#81C7EA] hover:text-white font-sans"
                  disabled={isLoading}
                >
                  {isLoading ? "Iniciando sesión..." : "ACCEDER"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
