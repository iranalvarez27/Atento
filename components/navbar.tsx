"use client"

import { usePathname } from "next/navigation"
import { AtentoLogo } from "@/components/atento-logo"

export default function Navbar() {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/forgot-password"

  return (
    <nav
      className="sticky top-0 z-50 flex justify-between items-center px-8 py-6 bg-transparent shadow-none"
    >
      <AtentoLogo variant="reduced" />

      <span className="text-white text-[18px] font-medium">
        Acelerador De Aprendizaje
      </span>
    </nav>
  )
}
