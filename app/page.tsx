"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Verifica si hay usuario autenticado
    const user = getCurrentUser()

  
    if (user) {
      // Redirect based on user role
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
        default:
          router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#00558C] to-[#3B2447]">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#81C7EA] mx-auto"></div>
        <p className="mt-6 text-lg italic text-gray-300">
          Cargando...
        </p>
      </div>
    </div>
  )
}
