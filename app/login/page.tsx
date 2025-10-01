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
import Navbar from "@/components/navbar"
import Link from "next/link"

// Página de inicio de sesión
export default function LoginPage() {
  // Estados para manejar inputs y UI
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false) // alternar visibilidad
  const [error, setError] = useState("") // mensajes de error
  const [isLoading, setIsLoading] = useState(false) // control de carga
  const router = useRouter()

  // Manejo de envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validación de usuario con funcion "login"
      const user = login(email, password)
      if (user) {
        // Redirigir segun el rol del usuario
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
        // Error si credenciales no coinciden
        setError("Credenciales incorrectas. Intenta de nuevo.")
      }
    } catch (err) {
      // Manejo de errores generales
      setError("Error al iniciar sesión. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar/>
      <div className="flex items-center justify-center py-20">
        <Card className="w-full max-w-md bg-transparent text-white shadow-none border-0">
          <CardHeader className="text-center space-y-4">
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription >
              Ingresa tus credenciales para acceder al sistema de entrenamiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-9">
              <div className="space-y-4">
                <Label htmlFor="email" className="px-3">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu.email@atento.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="rounded-full text-[15px] bg-white/20 text-white placeholder:text-gray-390 focus:ring-2 focus:ring-white"
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="password" className="px-3">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="rounded-full text-[15px] bg-white/20 text-white placeholder:text-gray-390 focus:ring-2 focus:ring-white pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert
                  variant="destructive"
                  className="flex items-center gap-2 border border-red-500 text-red-500 bg-transparent rounded-md px-3 py-2 -mt-5"
                >
                  <svg className=" h-6 w-6 text-red-500 -mt-1 p-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  ><path strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    /></svg>

                 
                  <AlertDescription className="text-red-500 bg-transparent border-0 p-0">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="text-right -mt-8">
                <Link
                  href="/forgot-password"
                  className="px-4 text-[14px] text-[#81C7EA] underline hover:text-white"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="flex justify-center">
                <Button
                  variant={"outline"}
                  type="submit"
                  className="w-50 rounded-full"
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