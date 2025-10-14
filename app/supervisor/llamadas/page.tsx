"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, MessageSquare, Award } from "lucide-react"
import { mockLlamadas, mockAgentes, mockFeedbacks } from "@/lib/mock-data"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { ChatDialog } from "@/components/ui/chat-dialog"
import { getCurrentUser } from "@/lib/auth"

export default function LlamadasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAgente, setFilterAgente] = useState("todos")
  const [filterResultado, setFilterResultado] = useState("todos")
  const [selectedFeedbackForChat, setSelectedFeedbackForChat] = useState<(typeof mockFeedbacks)[0] | null>(null)
  const { toast } = useToast()
  const user = getCurrentUser()

  const filteredLlamadas = mockLlamadas.filter((llamada) => {
    const matchesSearch = llamada.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAgente = filterAgente === "todos" || llamada.agenteId === filterAgente
    const matchesResultado = filterResultado === "todos" || llamada.resultado === filterResultado
    return matchesSearch && matchesAgente && matchesResultado
  })

  const getAgenteName = (agenteId: string) => {
    const agente = mockAgentes.find((a) => a.id === agenteId)
    return agente?.nombre || "Desconocido"
  }

  const getFeedbackForCall = (llamadaId: string) => {
    return mockFeedbacks.find((feedback) => feedback.llamadaId === llamadaId)
  }

  const handleExport = () => {
    toast({
      title: "Exportación iniciada",
      description: "El archivo CSV se descargará en breve.",
    })
  }

  const handleMarkAsExample = (llamadaId: string) => {
    toast({
      title: "Llamada marcada como ejemplo",
      description: "Esta llamada ahora está disponible en la biblioteca de ejemplos.",
    })
  }

  const handleOpenChat = (feedback: (typeof mockFeedbacks)[0]) => {
    setSelectedFeedbackForChat(feedback)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Llamadas</h1>
            <p className="text-muted-foreground">Supervisión y análisis de todas las llamadas del equipo</p>
          </div>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterAgente} onValueChange={setFilterAgente}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por agente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los agentes</SelectItem>
                  {mockAgentes.map((agente) => (
                    <SelectItem key={agente.id} value={agente.id}>
                      {agente.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterResultado} onValueChange={setFilterResultado}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por resultado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los resultados</SelectItem>
                  <SelectItem value="venta">Ventas</SelectItem>
                  <SelectItem value="no-venta">No ventas</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{filteredLlamadas.length}</p>
                <p className="text-sm text-muted-foreground">Total Llamadas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {filteredLlamadas.filter((l) => l.resultado === "venta").length}
                </p>
                <p className="text-sm text-muted-foreground">Ventas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {filteredLlamadas.length > 0
                    ? Math.round(
                        (filteredLlamadas.filter((l) => l.resultado === "venta").length / filteredLlamadas.length) *
                          100,
                      )
                    : 0}
                  %
                </p>
                <p className="text-sm text-muted-foreground">Tasa Conversión</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {filteredLlamadas.length > 0
                    ? Math.round(filteredLlamadas.reduce((acc, l) => acc + l.duracion, 0) / filteredLlamadas.length)
                    : 0}{" "}
                  min
                </p>
                <p className="text-sm text-muted-foreground">Duración Promedio</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calls Table */}
        <Card>
          <CardHeader>
            <CardTitle>Llamadas ({filteredLlamadas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Agente</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLlamadas.map((llamada) => {
                  const feedback = getFeedbackForCall(llamada.id)
                  return (
                    <TableRow key={llamada.id}>
                      <TableCell>{format(new Date(llamada.fecha), "dd/MM HH:mm", { locale: es })}</TableCell>
                      <TableCell className="font-medium">{getAgenteName(llamada.agenteId)}</TableCell>
                      <TableCell>{llamada.cliente}</TableCell>
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
                        {llamada.esEjemplo ? (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            Ejemplo
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Normal</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {feedback ? (
                            <Button variant="outline" size="sm" onClick={() => handleOpenChat(feedback)}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Chat
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Feedback
                            </Button>
                          )}
                          {!llamada.esEjemplo && (
                            <Button variant="outline" size="sm" onClick={() => handleMarkAsExample(llamada.id)}>
                              <Award className="mr-2 h-4 w-4" />
                              Marcar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Chat Dialog for supervisor */}
        {selectedFeedbackForChat && user && (
          <ChatDialog
            isOpen={!!selectedFeedbackForChat}
            onClose={() => setSelectedFeedbackForChat(null)}
            feedback={selectedFeedbackForChat}
            currentUserId={user.id}
            currentUserRole="supervisor"
          />
        )}
      </div>
    </DashboardLayout>
  )
}
