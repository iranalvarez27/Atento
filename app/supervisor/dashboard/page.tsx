"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { KpiCard } from "@/components/ui/kpi-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Phone, TrendingUp, AlertTriangle, Eye } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts"
import { mockAgentes, mockLlamadas, mockFeedbacks } from "@/lib/mock-data"
import Link from "next/link"

// Mock data for charts
const agentPerformanceData = mockAgentes.map((agente) => ({
  name: agente.nombre.split(" ")[0],
  llamadas: agente.llamadasHoy,
  ventas: agente.ventasHoy,
  conversion: agente.tasaConversion,
}))

const conversionData = [
  { name: "Ventas", value: mockLlamadas.filter((l) => l.resultado === "venta").length, color: "#10b981" },
  { name: "No Ventas", value: mockLlamadas.filter((l) => l.resultado === "no-venta").length, color: "#ef4444" },
]

export default function SupervisorDashboard() {
  const totalLlamadas = mockLlamadas.length
  const totalVentas = mockLlamadas.filter((l) => l.resultado === "venta").length
  const tasaConversionGlobal = Math.round((totalVentas / totalLlamadas) * 100)
  const duracionPromedio = Math.round(mockLlamadas.reduce((acc, l) => acc + l.duracion, 0) / mockLlamadas.length)

  // Alerts for low performance agents
  const lowPerformanceAgents = mockAgentes.filter((agente) => agente.tasaConversion < 60)
  const pendingFeedbacks = mockFeedbacks.filter((f) => f.estado === "pendiente").length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Supervisor</h1>
          <p className="text-muted-foreground">Vista general del desempeño del equipo</p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Llamadas"
            value={totalLlamadas}
            icon={<Phone className="h-4 w-4" />}
            trend={{ value: 15, label: "vs ayer", isPositive: true }}
          />
          <KpiCard
            title="Tasa de Conversión"
            value={`${tasaConversionGlobal}%`}
            icon={<TrendingUp className="h-4 w-4" />}
            trend={{ value: 3, label: "vs ayer", isPositive: true }}
          />
          <KpiCard
            title="Duración Promedio"
            value={`${duracionPromedio} min`}
            icon={<Phone className="h-4 w-4" />}
            trend={{ value: -2, label: "vs ayer", isPositive: false }}
          />
          <KpiCard
            title="Alertas"
            value={lowPerformanceAgents.length + pendingFeedbacks}
            icon={<AlertTriangle className="h-4 w-4" />}
            subtitle="Requieren atención"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Agent Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Desempeño por Agente</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={agentPerformanceData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="llamadas" fill="hsl(var(--primary))" name="Llamadas" />
                  <Bar dataKey="ventas" fill="hsl(var(--chart-2))" name="Ventas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Conversion Rate */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Resultados</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={conversionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {conversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-4">
                {conversionData.map((entry) => (
                  <div key={entry.name} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        {(lowPerformanceAgents.length > 0 || pendingFeedbacks > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span>Alertas y Acciones Requeridas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lowPerformanceAgents.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>
                        <strong>{lowPerformanceAgents.length} agentes</strong> con tasa de conversión baja (&lt;60%)
                      </span>
                      <Link href="/supervisor/agentes">
                        <Button variant="outline" size="sm">
                          Ver Agentes
                        </Button>
                      </Link>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              {pendingFeedbacks > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>
                        <strong>{pendingFeedbacks} feedbacks</strong> pendientes de revisión por agentes
                      </span>
                      <Link href="/supervisor/llamadas">
                        <Button variant="outline" size="sm">
                          Ver Llamadas
                        </Button>
                      </Link>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Team Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Resumen del Equipo</CardTitle>
            <Link href="/supervisor/agentes">
              <Button variant="outline" size="sm">
                Ver Todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAgentes.slice(0, 3).map((agente) => (
                <div key={agente.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{agente.nombre}</h4>
                    <p className="text-sm text-muted-foreground">
                      {agente.llamadasHoy} llamadas • {agente.ventasHoy} ventas
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{agente.tasaConversion}%</p>
                      <p className="text-xs text-muted-foreground">Conversión</p>
                    </div>
                    <Badge
                      variant={
                        agente.tasaConversion >= 70 ? "venta" : agente.tasaConversion >= 60 ? "pendiente" : "no-venta"
                      }
                    >
                      {agente.tasaConversion >= 70 ? "Excelente" : agente.tasaConversion >= 60 ? "Bueno" : "Mejorar"}
                    </Badge>
                    <Link href={`/supervisor/agentes/${agente.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
