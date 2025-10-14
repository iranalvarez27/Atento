"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import Navbar from "@/components/navbar"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Error al enviar el correo")
      }

      // Si llega aquí, fue exitoso
      setIsSubmitted(true)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Vista cuando ya se envió el correo
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col relative">
        <Navbar />
      
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="w-full max-w-md bg-transparent text-white shadow-none border-0">
            <CardHeader className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-transparent border border-[#81C7EA]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="28px"
                    viewBox="0 -960 960 960"
                    width="28px"
                    fill="#81C7EA"
                  >
                    <path d="M638-80 468-250l56-56 114 114 226-226 56 56L638-80ZM480-520l320-200H160l320 200Zm0 80L160-640v400h206l80 80H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v174l-80 80v-174L480-440Z"/>
                  </svg>
                </div>
              </div>

              <CardTitle>Correo Enviado</CardTitle>

              <CardDescription>
                Hemos enviado las instrucciones para restablecer tu contraseña a{" "}
                <span className=" text-[#81C7EA] font-medium">{email}</span>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Revisa tu bandeja de entrada y sigue las instrucciones del correo. 
                    Si no lo encuentras, revisa tu carpeta de spam.
                  </AlertDescription>
                </Alert>

                <Link
                href="/login"
                className="w-full flex items-center text-[14px] font-medium justify-center gap-2 rounded-full border-0 text-[#81C7EA] bg-transparent hover:text-white hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                VOLVER A INICIO SESIÓN
              </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  // Vista inicial (formulario para pedir reset de contraseña)
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
    
      <div className="absolute inset-0 flex items-center justify-center">
        <Card className="w-full max-w-md bg-transparent text-white shadow-none border-0">
          <CardHeader className="text-center space-y-4">
            <CardTitle >Recuperar Contraseña</CardTitle>
            <CardDescription >
              Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-2">
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
              <div className="flex justify-center">
                <Button
                variant={"outline"}
                  type="submit"
                  className="w-70 rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "ENVIAR INSTRUCCIONES"}
                </Button>
              </div>
              <Link
                href="/login"
                className="w-full flex items-center text-[14px] font-medium justify-center gap-2 rounded-full border-0 text-[#81C7EA] bg-transparent hover:text-white hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                VOLVER A INICIO SESIÓN
              </Link>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}