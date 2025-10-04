import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"

import "./globals.css"
import { Toaster } from "@/components/ui/toaster"  

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Atento - Acelerador de Ventas",
  description: "Plataforma de entrenamiento para agentes de ventas de Atento",
  icons: {
    icon: "/images/iconATENTO.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={`${poppins.className} bg-gradient-to-br from-[#3B2447] to-[#00558C]`}
      >
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
