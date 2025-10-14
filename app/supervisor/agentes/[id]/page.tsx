"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, MessageSquare, Star, Award, TrendingUp, Phone, Clock } from "lucide-react"
import { mockAgentes, mockLlamadas, mockFeedbacks } from "@/lib/mock-data"
import { KpiCard } from "@/components/ui/kpi-card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock performance data for the agent
const performanceData = [
  { day: "Lun", llamadas: 8, ventas: 5 },
  { day: "Mar", llamadas: 12, ventas: 8 },
  { day: "Mié", llamadas: 10, ventas: 6 },
  { day: "Jue", llamadas: 15, ventas: 11 },
  { day: "Vie", llamadas: 12, ventas: 8 },
  { day: "Sáb", llamadas: 6, ventas: 4 },
  { day: "Dom", llamadas: 4, ventas: 2 },
]

export default function AgenteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [feedbackForm, setFeedbackForm] = useState({
    puntuacion: "",
    aspectos: [] as string[],
    comentarios: "",
  })

  const agenteId = params.id as string
  const agente = mockAgentes.find((a) => a.id === agenteId)
  const agenteLlamadas = mockLlamadas.filter((l) => l.agenteId === agenteId)
  const agenteFeedbacks = mockFeedbacks.filter((f) => f.agenteId === agenteId)

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const [currentWeek, setCurrentWeek] = useState(0)

  if (!agente) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p>Agente no encontrado</p>
          <Button onClick={() => router.back()} className="mt-4">
            Volver
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const handleSubmitFeedback = (llamadaId: string) => {
    // Simulate feedback submission
    toast({
      title: "Feedback enviado",
      description: "El feedback ha sido enviado al agente exitosamente.",
    })
    setFeedbackForm({ puntuacion: "", aspectos: [], comentarios: "" })
  }

  const toggleAspecto = (aspecto: string) => {
    setFeedbackForm((prev) => ({
      ...prev,
      aspectos: prev.aspectos.includes(aspecto)
        ? prev.aspectos.filter((a) => a !== aspecto)
        : [...prev.aspectos, aspecto],
    }))
  }

  const aspectosDisponibles = ["Comunicación", "Técnicas de venta", "Cierre", "Empatía", "Conocimiento del producto"]

  const handlePreviousWeek = () => {
    setCurrentWeek((prev) => prev - 1)
    const newFrom = new Date(dateRange.from)
    const newTo = new Date(dateRange.to)
    newFrom.setDate(newFrom.getDate() - 7)
    newTo.setDate(newTo.getDate() - 7)
    setDateRange({ from: newFrom, to: newTo })
  }

  const handleNextWeek = () => {
    setCurrentWeek((prev) => prev + 1)
    const newFrom = new Date(dateRange.from)
    const newTo = new Date(dateRange.to)
    newFrom.setDate(newFrom.getDate() + 7)
    newTo.setDate(newTo.getDate() + 7)
    setDateRange({ from: newFrom, to: newTo })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{agente.nombre}</h1>
            <p className="text-muted-foreground">{agente.email}</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Llamadas Hoy"
            value={agente.llamadasHoy}
            icon={<Phone className="h-4 w-4" />}
            trend={{ value: 12, label: "vs ayer", isPositive: true }}
          />
          <KpiCard
            title="Ventas Hoy"
            value={agente.ventasHoy}
            icon={<TrendingUp className="h-4 w-4" />}
            trend={{ value: 8, label: "vs ayer", isPositive: true }}
          />
          <KpiCard
            title="Tasa Conversión"
            value={`${agente.tasaConversion}%`}
            icon={<Award className="h-4 w-4" />}
            trend={{ value: 3, label: "vs ayer", isPositive: true }}
          />
          <KpiCard
            title="Duración Promedio"
            value={`${agente.duracionPromedio} min`}
            icon={<Clock className="h-4 w-4" />}
            trend={{ value: -2, label: "vs ayer", isPositive: false }}
          />
        </div>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Rendimiento - Últimos 7 días</CardTitle>
              <div className="flex items-center space-x-2">
                <DateRangePicker
                  from={dateRange.from}
                  to={dateRange.to}
                  onSelect={(range) => range && setDateRange(range)}
                />
                <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextWeek}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="llamadas" fill="url(#atentoGradient1)" name="Llamadas" />
                <Bar dataKey="ventas" fill="url(#atentoGradient2)" name="Ventas" />
                <defs>
                  <linearGradient id="atentoGradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                  <linearGradient id="atentoGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#0891B2" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="llamadas" className="space-y-4">
          <TabsList>
            <TabsTrigger value="llamadas">Llamadas</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="metricas">Métricas</TabsTrigger>
          </TabsList>

          <TabsContent value="llamadas">
            <Card>
              <CardHeader>
                <CardTitle>Llamadas del Agente</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Duración</TableHead>
                        <TableHead>Resultado</TableHead>
                        <TableHead>Feedback</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agenteLlamadas.map((llamada) => {
                        const feedback = agenteFeedbacks.find((f) => f.llamadaId === llamada.id)
                        return (
                          <TableRow key={llamada.id}>
                            <TableCell>{format(new Date(llamada.fecha), "dd/MM HH:mm", { locale: es })}</TableCell>
                            <TableCell className="font-medium">{llamada.cliente}</TableCell>
                            <TableCell>{llamada.duracion} min</TableCell>
                            <TableCell>
                              <Badge variant={llamada.resultado === "venta" ? "venta" : "no-venta"}>
                                {llamada.resultado === "venta" ? "Venta" : "No venta"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {feedback ? (
                                <Badge variant={feedback.estado === "pendiente" ? "pendiente" : "revisado"}>
                                  {feedback.estado === "pendiente" ? "Pendiente" : "Revisado"}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">Sin feedback</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {!feedback && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Dar Feedback
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>Dar Feedback</DialogTitle>
                                        <DialogDescription>
                                          Proporciona retroalimentación para la llamada con {llamada.cliente}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <div className="space-y-2">
                                          <Label>Puntuación (1-5)</Label>
                                          <Select
                                            value={feedbackForm.puntuacion}
                                            onValueChange={(value) =>
                                              setFeedbackForm({ ...feedbackForm, puntuacion: value })
                                            }
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="Selecciona una puntuación" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {[1, 2, 3, 4, 5].map((num) => (
                                                <SelectItem key={num} value={num.toString()}>
                                                  <div className="flex items-center space-x-2">
                                                    <span>{num}</span>
                                                    <div className="flex">
                                                      {Array.from({ length: 5 }, (_, i) => (
                                                        <Star
                                                          key={i}
                                                          className={`h-3 w-3 ${
                                                            i < num
                                                              ? "fill-yellow-400 text-yellow-400"
                                                              : "text-gray-300"
                                                          }`}
                                                        />
                                                      ))}
                                                    </div>
                                                  </div>
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Aspectos evaluados</Label>
                                          <div className="flex flex-wrap gap-2">
                                            {aspectosDisponibles.map((aspecto) => (
                                              <Button
                                                key={aspecto}
                                                type="button"
                                                variant={
                                                  feedbackForm.aspectos.includes(aspecto) ? "default" : "outline"
                                                }
                                                size="sm"
                                                onClick={() => toggleAspecto(aspecto)}
                                              >
                                                {aspecto}
                                              </Button>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Comentarios</Label>
                                          <Textarea
                                            placeholder="Proporciona comentarios detallados sobre el desempeño..."
                                            value={feedbackForm.comentarios}
                                            onChange={(e) =>
                                              setFeedbackForm({ ...feedbackForm, comentarios: e.target.value })
                                            }
                                            rows={4}
                                          />
                                        </div>
                                        <Button
                                          onClick={() => handleSubmitFeedback(llamada.id)}
                                          className="w-full"
                                          disabled={!feedbackForm.puntuacion || !feedbackForm.comentarios}
                                        >
                                          Enviar Feedback
                                        </Button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                )}
                                {llamada.esEjemplo ? (
                                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                                    Ejemplo
                                  </Badge>
                                ) : (
                                  <Button variant="outline" size="sm">
                                    Marcar Ejemplo
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agenteFeedbacks.map((feedback) => {
                    const llamada = mockLlamadas.find((l) => l.id === feedback.llamadaId)
                    return (
                      <div key={feedback.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">Llamada: {llamada?.cliente}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(feedback.fecha), "dd MMM yyyy, HH:mm", { locale: es })}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < feedback.puntuacion ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <Badge variant={feedback.estado === "pendiente" ? "pendiente" : "revisado"}>
                              {feedback.estado === "pendiente" ? "Pendiente" : "Revisado"}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Aspectos:</p>
                          <div className="flex flex-wrap gap-1">
                            {feedback.aspectos.map((aspecto) => (
                              <Badge key={aspecto} variant="outline" className="text-xs">
                                {aspecto}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Comentarios:</p>
                          <p className="text-sm bg-muted p-2 rounded">{feedback.comentarios}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metricas">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas Generales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total de llamadas:</span>
                    <span className="font-medium">{agenteLlamadas.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total de ventas:</span>
                    <span className="font-medium">{agenteLlamadas.filter((l) => l.resultado === "venta").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Feedbacks recibidos:</span>
                    <span className="font-medium">{agenteFeedbacks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Puntuación promedio:</span>
                    <span className="font-medium">
                      {agenteFeedbacks.length > 0
                        ? (agenteFeedbacks.reduce((acc, f) => acc + f.puntuacion, 0) / agenteFeedbacks.length).toFixed(
                            1,
                          )
                        : "N/A"}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Áreas de Mejora</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {agente.tasaConversion < 60 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm font-medium text-red-800">Tasa de conversión baja</p>
                        <p className="text-xs text-red-600">Requiere entrenamiento en técnicas de cierre</p>
                      </div>
                    )}
                    {agente.duracionPromedio > 20 && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm font-medium text-yellow-800">Llamadas muy largas</p>
                        <p className="text-xs text-yellow-600">Optimizar tiempo de conversación</p>
                      </div>
                    )}
                    {agente.feedbacksPendientes > 2 && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm font-medium text-blue-800">Feedbacks pendientes</p>
                        <p className="text-xs text-blue-600">Revisar retroalimentación recibida</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
