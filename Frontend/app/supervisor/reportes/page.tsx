"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Download, TrendingUp, TrendingDown, Award } from "lucide-react"
import { mockAgentes, mockLlamadas } from "@/lib/mock-data"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart } from "recharts"
import { useToast } from "@/hooks/use-toast"
import type { DateRange } from "react-day-picker"

// Mock data for trends
const trendData = [
  { period: "Sem 1", llamadas: 180, ventas: 120, conversion: 67 },
  { period: "Sem 2", llamadas: 220, ventas: 150, conversion: 68 },
  { period: "Sem 3", llamadas: 195, ventas: 135, conversion: 69 },
  { period: "Sem 4", llamadas: 240, ventas: 175, conversion: 73 },
]

export default function ReportesPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [filterPeriod, setFilterPeriod] = useState("mes")
  const [filterTeam, setFilterTeam] = useState("todos")
  const { toast } = useToast()

  // Calculate rankings
  const agentRankings = mockAgentes
    .map((agente) => ({
      ...agente,
      totalLlamadas: mockLlamadas.filter((l) => l.agenteId === agente.id).length,
      totalVentas: mockLlamadas.filter((l) => l.agenteId === agente.id && l.resultado === "venta").length,
    }))
    .sort((a, b) => b.tasaConversion - a.tasaConversion)

  const handleExport = (format: "csv" | "pdf") => {
    toast({
      title: `Exportación ${format.toUpperCase()} iniciada`,
      description: `El archivo ${format.toUpperCase()} se descargará en breve.`,
    })
  }

  const getRankIcon = (position: number) => {
    if (position === 1) return <Award className="h-4 w-4 text-yellow-500" />
    if (position === 2) return <Award className="h-4 w-4 text-gray-400" />
    if (position === 3) return <Award className="h-4 w-4 text-amber-600" />
    return <span className="text-muted-foreground">#{position}</span>
  }

  const getPerformanceTrend = (conversion: number) => {
    // Mock trend calculation
    const trend = Math.random() > 0.5 ? "up" : "down"
    const value = Math.floor(Math.random() * 10) + 1
    return { trend, value }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reportes y Análisis</h1>
            <p className="text-muted-foreground">Análisis detallado del desempeño del equipo</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => handleExport("csv")}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport("pdf")}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana">Esta semana</SelectItem>
                  <SelectItem value="mes">Este mes</SelectItem>
                  <SelectItem value="trimestre">Este trimestre</SelectItem>
                  <SelectItem value="año">Este año</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterTeam} onValueChange={setFilterTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="Equipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los equipos</SelectItem>
                  <SelectItem value="equipo-a">Equipo A</SelectItem>
                  <SelectItem value="equipo-b">Equipo B</SelectItem>
                </SelectContent>
              </Select>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
          </CardContent>
        </Card>

        {/* Performance Trends */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Llamadas y Ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trendData}>
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="llamadas" fill="hsl(var(--primary))" name="Llamadas" />
                  <Bar dataKey="ventas" fill="hsl(var(--chart-2))" name="Ventas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evolución Tasa de Conversión</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="conversion"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Conversión %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Agent Rankings */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking de Desempeño</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posición</TableHead>
                  <TableHead>Agente</TableHead>
                  <TableHead>Llamadas</TableHead>
                  <TableHead>Ventas</TableHead>
                  <TableHead>Tasa Conversión</TableHead>
                  <TableHead>Tendencia</TableHead>
                  <TableHead>Desempeño</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentRankings.map((agente, index) => {
                  const position = index + 1
                  const trend = getPerformanceTrend(agente.tasaConversion)
                  return (
                    <TableRow key={agente.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {getRankIcon(position)}
                          <span>{position}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{agente.nombre}</p>
                          <p className="text-sm text-muted-foreground">{agente.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{agente.totalLlamadas}</TableCell>
                      <TableCell className="font-medium">{agente.totalVentas}</TableCell>
                      <TableCell>
                        <span className="font-medium">{agente.tasaConversion}%</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {trend.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <span className={`text-sm ${trend.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                            {trend.value}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            agente.tasaConversion >= 70
                              ? "venta"
                              : agente.tasaConversion >= 60
                                ? "pendiente"
                                : "no-venta"
                          }
                        >
                          {agente.tasaConversion >= 70
                            ? "Excelente"
                            : agente.tasaConversion >= 60
                              ? "Bueno"
                              : "Mejorar"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {Math.round(agentRankings.reduce((acc, a) => acc + a.tasaConversion, 0) / agentRankings.length)}%
                </p>
                <p className="text-sm text-muted-foreground">Conversión Promedio</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {agentRankings.reduce((acc, a) => acc + a.totalLlamadas, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Llamadas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {agentRankings.reduce((acc, a) => acc + a.totalVentas, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Ventas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {Math.round(agentRankings.reduce((acc, a) => acc + a.duracionPromedio, 0) / agentRankings.length)} min
                </p>
                <p className="text-sm text-muted-foreground">Duración Promedio</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
