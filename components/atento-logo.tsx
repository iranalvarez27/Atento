import Image from "next/image"
import { cn } from "@/lib/utils"

interface AtentoLogoProps {
  variant?: "full" | "reduced" | "mini"
  className?: string
}

export function AtentoLogo({ variant = "full", className }: AtentoLogoProps) {
  const sizeClasses = {
    full: "h-[80px] w-auto",     // tamaño grande para encabezados (≈200px ancho real)
    reduced: "h-[64px] w-auto",  // tamaño medio (≈160px ancho real)
    mini: "h-[40px] w-auto",     // mínimo aceptable (≈100px ancho real)
  }

  return (
    <Image
      src="/images/atento-logo.png"
      alt="Atento"
      width={200}  
      height={80}   
      className={cn(sizeClasses[variant], className)}
      priority
    />
  )
}
