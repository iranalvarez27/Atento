"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Cargando...</p>
      </div>
    </div>
  )
}
