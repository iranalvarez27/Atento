"use client" 

import { usePathname } from "next/navigation"
import { AtentoLogo } from "@/components/atento-logo"

export default function Navbar() {
  const pathname = usePathname()
  // Detecta si la página actual es login o forgot-password
  const isAuthPage = pathname === "/login" || pathname === "/forgot-password"

  return (
    // Navbar con fondo transparente en auth pages, y azul en el resto
    <nav
      className={`sticky top-0 z-50 flex justify-between items-center px-8 py-6 bg-transparent shadow-none`}
    >
      <AtentoLogo variant="full" className="h-10" />
      <span className="text-white text-[16px]">
        Acelerador De Aprendizaje
      </span>
    </nav>
  )
}
