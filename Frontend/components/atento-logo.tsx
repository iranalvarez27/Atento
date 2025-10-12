import Image from "next/image"
import { cn } from "@/lib/utils"

interface AtentoLogoProps {
  variant?: "full" | "reduced" | "mini"
  className?: string
}

export function AtentoLogo({ variant = "full", className }: AtentoLogoProps) {
  const sizeClasses = {
    full: "h-12 w-auto",
    reduced: "h-8 w-auto",
    mini: "h-6 w-auto",
  }

  return (
    <Image
      src="/images/atento-logo.png"
      alt="Atento"
      width={120}
      height={48}
      className={cn(sizeClasses[variant], className)}
      priority
    />
  )
}
