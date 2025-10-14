"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { getCurrentUser } from "@/lib/auth"
import { useEffect, useState } from "react"

export function DashboardLayout({
  children,
  title = "Dashboard"
}: {
  children: React.ReactNode
  title?: string
  subtitle?: string
}) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
  }, [])

  if (!user) {
    return <div className="flex-1 flex justify-center items-center">Cargando...</div>
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#2F1E3E] to-[#0B4777]">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 flex justify-center items-center overflow-auto p-6">
        <div className="bg-white rounded-[32px] shadow-md w-[1616px] h-[1018px] max-w-full max-h-full flex flex-col">
          
          {/* Header con título + usuario */}
          <header className="flex justify-between items-center p-7 ">
           
              <h1 className="text-[40px]  text-[#2F1E3E] ml-3">{title}</h1>
           

            {/* Info de usuario */}
            <div className="flex items-center gap-3">
              
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-neutral-500 capitalize">{user.role}</p>
              </div>
              <div className="rounded-full bg-[#3B2748] text-white h-10 w-10 grid place-items-center font-semibold">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}

              </div>
            </div>
          </header>

          {/* Contenido dinámico */}
          <div className="flex-1 overflow-y-auto p-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
