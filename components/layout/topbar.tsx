"use client"

import { Button } from "@/components/ui/button"
import { getCurrentUser, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Bell, Settings, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Topbar() {
  const user = getCurrentUser()
  const router = useRouter()

  if (!user) return null

  // Combinar nombre y apellido (según nuevo backend)
  const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()

  // Generar iniciales (seguras, sin error)
  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0]?.toUpperCase())
        .join("")
    : "U" // fallback si no hay nombre

  // Normalizar rol (si viene en mayúsculas)
  const role =
    user.role?.toLowerCase?.() ||
    user.role_name?.toLowerCase?.() ||
    "sin rol"

  return (
    <header className="topbar-soft flex items-center justify-between px-4 py-2">
      <div className="hidden md:block">
        <h1 className="text-lg font-semibold text-neutral-800">Acelerador de Ventas</h1>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="user-chip cursor-pointer flex items-center gap-2">
              <Avatar className="h-8 w-8 ring-2 ring-white/60">
                <AvatarFallback className="bg-blue-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <div className="text-sm font-semibold leading-tight text-neutral-900">
                  {fullName || "Usuario"}
                </div>
                <div className="text-[11px] text-neutral-500 capitalize">{role}</div>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">{fullName}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              <p className="text-xs leading-none text-muted-foreground capitalize">{role}</p>
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/config")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout()
                router.push("/login")
              }}
              className="text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
