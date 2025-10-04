import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Variantes del Badge
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-200 text-gray-800",
        secondary: "bg-gray-100 text-gray-600",
        destructive: "bg-red-100 text-red-800",
        outline: "border border-gray-300 text-gray-700",
        venta: "bg-green-100 text-green-800",
        "no-venta": "bg-red-100 text-red-800",
        pendiente: "bg-yellow-100 text-yellow-800",
        revisado: "bg-blue-100 text-blue-800",
        success: "bg-green-100 text-green-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
