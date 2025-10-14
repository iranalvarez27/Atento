"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { KpiCard } from "@/components/ui/kpi-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, TrendingUp, Clock, MessageSquare, Plus } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { mockLlamadas, mockFeedbacks } from "@/lib/mock-data"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const chartData = [
  { day: "Lun", llamadas: 8, ventas: 5 },
  { day: "Mar", llamadas: 12, ventas: 8 },
  { day: "Mié", llamadas: 10, ventas: 6 },
  { day: "Jue", llamadas: 15, ventas: 11 },
  { day: "Vie", llamadas: 12, ventas: 8 },
  { day: "Sáb", llamadas: 6, ventas: 4 },
  { day: "Dom", llamadas: 4, ventas: 2 },
]

export default function AgenteDashboard() {
  const user = getCurrentUser()
  const userLlamadas = mockLlamadas.filter((llamada) => llamada.agenteId === user?.id)
  const userFeedbacks = mockFeedbacks.filter((feedback) => feedback.agenteId === user?.id)
  const pendingFeedbacks = userFeedbacks.filter((feedback) => feedback.estado === "pendiente")

  const llamadasHoy = userLlamadas.length
  const ventasHoy = userLlamadas.filter((llamada) => llamada.resultado === "venta").length
  const duracionPromedio = Math.round(
    userLlamadas.reduce((acc, llamada) => acc + llamada.duracion, 0) / userLlamadas.length || 0,
  )
  const tasaConversion = llamadasHoy > 0 ? Math.round((ventasHoy / llamadasHoy) * 100) : 0
  const ultimasLlamadas = userLlamadas.slice(-5).reverse()

  return (
    <DashboardLayout>
      <div className="space-y-6 text-white">        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#010309] bg-[#a4dcff] px-3 py-2 rounded-full inline-block">
              Dashboard de Agente
            </h1>
            <p className="text-gray-900">Bienvenido de vuelta, {user?.name}</p>
          </div>
          <Link href="/agente/registrar-llamada">
            <Button className="rounded-full border border-[#38BDF8] text-[#38BDF8] font-semibold px-6 py-2 bg-transparent hover:bg-[#38BDF8] hover:text-white transition">
              <Plus className="mr-2 h-4 w-4" />
              Registrar Llamada
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Llamadas Hoy"
            value={llamadasHoy}
            icon={<Phone className="h-6 w-6 text-[#1E3A8A]" />}
            trend={{ value: 12, label: "vs ayer", isPositive: true }}
            className="bg-white text-black rounded-2xl shadow-lg"
          />
          <KpiCard
            title="Ventas Hoy"
            value={ventasHoy}
            icon={<TrendingUp className="h-6 w-6 text-[#1E3A8A]" />}
            trend={{ value: 8, label: "vs ayer", isPositive: true }}
            className="bg-white text-black rounded-2xl shadow-lg"
          />
          <KpiCard
            title="Duración Promedio"
            value={`${duracionPromedio} min`}
            icon={<Clock className="h-6 w-6 text-[#1E3A8A]" />}
            trend={{ value: -5, label: "vs ayer", isPositive: false }}
            className="bg-white text-black rounded-2xl shadow-lg"
          />
          <KpiCard
            title="Feedbacks Pendientes"
            value={pendingFeedbacks.length}
            icon={<MessageSquare className="h-6 w-6 text-[#1E3A8A]" />}
            subtitle="Por revisar"
            className="bg-white text-black rounded-2xl shadow-lg"
          />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-[#0A1734] text-white rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle>Rendimiento - Últimos 7 días</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="day" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip contentStyle={{ backgroundColor: "#1E3A8A", color: "#fff" }} />
                  <Bar dataKey="llamadas" fill="#06B6D4" name="Llamadas" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="ventas" fill="#8B5CF6" name="Ventas" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white text-black rounded-2xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Últimas Llamadas</CardTitle>
              <Link href="/agente/mis-llamadas">
                <Button
                  size="sm"
                  className="rounded-full border border-[#38BDF8] text-[#38BDF8] font-semibold px-4 py-1 bg-transparent hover:bg-[#38BDF8] hover:text-white transition"
                >
                  Ver todas
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ultimasLlamadas.map((llamada) => (
                  <div key={llamada.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{llamada.cliente}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(llamada.fecha), "dd MMM, HH:mm", { locale: es })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{llamada.duracion} min</span>
                      <Badge variant={llamada.resultado === "venta" ? "success" : "destructive"}>
                        {llamada.resultado === "venta" ? "Venta" : "No venta"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
