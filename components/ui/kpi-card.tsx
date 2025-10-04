import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  className?: string
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: KpiCardProps) {
  return (
    <Card className={cn("rounded-lg border shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        {icon && <div className="text-gray-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{value}</div>

        {subtitle && (
          <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
        )}

        {trend && (
          <div className="mt-2 flex items-center">
            <span
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>
            <span className="ml-1 text-xs text-gray-500">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
