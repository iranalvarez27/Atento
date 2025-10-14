"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { mockAgentes } from "@/lib/mock-data"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AgentesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAgentes = mockAgentes.filter((agente) => agente.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

  const getPerformanceBadge = (conversion: number) => {
    if (conversion >= 70) return { variant: "venta" as const, label: "Excelente", icon: TrendingUp }
    if (conversion >= 60) return { variant: "pendiente" as const, label: "Bueno", icon: Minus }
    return { variant: "no-venta" as const, label: "Mejorar", icon: TrendingDown }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Agentes</h1>
          <p className="text-muted-foreground">Monitoreo y evaluación del desempeño del equipo</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar agente por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Agents Table */}
        <Card>
          <CardHeader>
            <CardTitle>Agentes del Equipo ({filteredAgentes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agente</TableHead>
                    <TableHead>Llamadas Hoy</TableHead>
                    <TableHead>Ventas Hoy</TableHead>
                    <TableHead>Tasa Conversión</TableHead>
                    <TableHead>Duración Prom.</TableHead>
                    <TableHead>Feedbacks Pend.</TableHead>
                    <TableHead>Desempeño</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgentes.map((agente) => {
                    const performance = getPerformanceBadge(agente.tasaConversion)
                    const PerformanceIcon = performance.icon

                    return (
                      <TableRow key={agente.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{agente.nombre}</p>
                            <p className="text-sm text-muted-foreground">{agente.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{agente.llamadasHoy}</TableCell>
                        <TableCell className="font-medium">{agente.ventasHoy}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">{agente.tasaConversion}%</span>
                            <PerformanceIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TableCell>
                        <TableCell>{agente.duracionPromedio} min</TableCell>
                        <TableCell>
                          {agente.feedbacksPendientes > 0 ? (
                            <Badge variant="pendiente">{agente.feedbacksPendientes}</Badge>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={performance.variant}>{performance.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <Link href={`/supervisor/agentes/${agente.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalle
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {mockAgentes.filter((a) => a.tasaConversion >= 70).length}
                </p>
                <p className="text-sm text-muted-foreground">Agentes Excelentes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {mockAgentes.filter((a) => a.tasaConversion >= 60 && a.tasaConversion < 70).length}
                </p>
                <p className="text-sm text-muted-foreground">Agentes Buenos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {mockAgentes.filter((a) => a.tasaConversion < 60).length}
                </p>
                <p className="text-sm text-muted-foreground">Necesitan Mejora</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
