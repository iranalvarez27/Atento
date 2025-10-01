"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { AtentoLogo } from "@/components/atento-logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getCurrentUser, logout } from "@/lib/auth"
import { BarChart3, Phone, Users, MessageSquare, FileText, BookOpen, Settings, LogOut, Menu, X } from "lucide-react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user) return null

  const getNavigationItems = () => {
    switch (user.role) {
      case "agente":
        return [
          { href: "/agente/dashboard", label: "Dashboard", icon: BarChart3 },
          { href: "/agente/registrar-llamada", label: "Registrar Llamada", icon: Phone },
          { href: "/agente/mis-llamadas", label: "Mis Llamadas", icon: FileText },
          { href: "/agente/feedback", label: "Feedback", icon: MessageSquare },
        ]
      case "supervisor":
        return [
          { href: "/supervisor/dashboard", label: "Dashboard", icon: BarChart3 },
          { href: "/supervisor/agentes", label: "Agentes", icon: Users },
          { href: "/supervisor/llamadas", label: "Llamadas", icon: Phone },
          { href: "/supervisor/reportes", label: "Reportes", icon: FileText },
          { href: "/supervisor/biblioteca", label: "Biblioteca", icon: BookOpen },
        ]
      case "admin":
        return [
          { href: "/admin/usuarios", label: "Usuarios", icon: Users },
          { href: "/admin/integraciones", label: "Integraciones", icon: Settings },
        ]
      default:
        return []
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && <AtentoLogo variant="reduced" />}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-sidebar-foreground",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed && "px-2",
                )}
              >
                <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* User info and logout */}
      <div className="p-4 border-t border-sidebar-border">
        {!isCollapsed && (
          <div className="mb-3">
            <p className="text-sm font-medium text-sidebar-foreground">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/70 capitalize">{user.role}</p>
          </div>
        )}
        <div className="space-y-2">
          <Link href="/config">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
                isCollapsed && "px-2",
              )}
            >
              <Settings className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
              {!isCollapsed && "Configuración"}
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
              isCollapsed && "px-2",
            )}
          >
            <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && "Cerrar Sesión"}
          </Button>
        </div>
      </div>
    </div>
  )
}
