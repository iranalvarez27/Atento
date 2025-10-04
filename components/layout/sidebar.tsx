// components/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AtentoLogo } from "@/components/atento-logo"
import { cn } from "@/lib/utils"
import { Users, Settings } from "lucide-react"

const navItems = [
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/integraciones", label: "Integraciones", icon: Settings },
]
export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "flex flex-col h-screen w-64 bg-gradient-to-b from-[#2F1E3E] to-[#0B4777] text-white p-6",
        className
      )}
    >
      <div className="mb-10">
        <AtentoLogo variant="reduced"  />
      </div>
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-colors",
                isActive
                  ? "bg-white text-[#2F1E3E] shadow-sm"
                  : "hover:bg-white/20"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-[#2F1E3E]")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-6">
        <button
          onClick={() => console.log("Cerrar sesión")}
          className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
            />
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}
