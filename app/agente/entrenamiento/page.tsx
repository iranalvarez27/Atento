"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Eye, FileText, MessageSquare, Plus } from "lucide-react"
import { mockLlamadas, mockFeedbacks } from "@/lib/mock-data"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function MisLlamadasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const user = getCurrentUser()

  const generateMoreCalls = () => {
    const baseCalls = mockLlamadas.filter((llamada) => llamada.agenteId === user?.id)
    const additionalCalls = []

    for (let i = 4; i <= 12; i++) {
      additionalCalls.push({
        id: `call-${i}`,
        fecha: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        cliente: `Cliente ${i}`,
        duracion: Math.floor(Math.random() * 20) + 10,
        resultado: Math.random() > 0.5 ? ("venta" as const) : ("no-venta" as const),
        comentarios: `Comentarios de la llamada ${i}`,
        agenteId: user?.id || "1",
      })
    }

    return [...baseCalls, ...additionalCalls]
  }

  const userLlamadas = generateMoreCalls()

  const filteredLlamadas = userLlamadas.filter((llamada) =>
    llamada.cliente.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getFeedbackForCall = (llamadaId: string) => {
    return mockFeedbacks.find((feedback) => feedback.llamadaId === llamadaId)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mis Llamadas</h1>
            <p className="text-muted-foreground">Historial completo de tus llamadas registradas</p>
          </div>
          <Link href="/agente/registrar-llamada">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Llamada
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calls Table */}
        <Card>
          <CardHeader>
            <CardTitle>Llamadas Registradas ({filteredLlamadas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredLlamadas.length > 0 ? (
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
                    {filteredLlamadas.map((llamada) => {
                      const feedback = getFeedbackForCall(llamada.id)
                      return (
                        <TableRow key={llamada.id}>
                          <TableCell>{format(new Date(llamada.fecha), "dd/MM/yyyy HH:mm", { locale: es })}</TableCell>
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
                            <div className="flex items-center space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Detalle de Llamada</DialogTitle>
                                    <DialogDescription>
                                      Información completa de la llamada con {llamada.cliente}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                      <div>
                                        <Label className="text-sm font-medium">Cliente</Label>
                                        <p className="text-sm">{llamada.cliente}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Fecha</Label>
                                        <p className="text-sm">
                                          {format(new Date(llamada.fecha), "dd/MM/yyyy HH:mm", { locale: es })}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Duración</Label>
                                        <p className="text-sm">{llamada.duracion} minutos</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Resultado</Label>
                                        <Badge variant={llamada.resultado === "venta" ? "venta" : "no-venta"}>
                                          {llamada.resultado === "venta" ? "Venta" : "No venta"}
                                        </Badge>
                                      </div>
                                    </div>
                                    {llamada.comentarios && (
                                      <div>
                                        <Label className="text-sm font-medium">Comentarios</Label>
                                        <p className="text-sm mt-1">{llamada.comentarios}</p>
                                      </div>
                                    )}
                                    {llamada.transcripcion && (
                                      <div>
                                        <Label className="text-sm font-medium">Transcripción</Label>
                                        <p className="text-sm mt-1 bg-muted p-3 rounded">{llamada.transcripcion}</p>
                                      </div>
                                    )}
                                    {llamada.esEjemplo && (
                                      <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-sm text-blue-800 font-medium">
                                          ⭐ Esta llamada ha sido marcada como ejemplo por tu supervisor
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                              {feedback && (
                                <Link href={`/agente/feedback?llamada=${llamada.id}`}>
                                  <Button variant="outline" size="sm">
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay llamadas registradas</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? "No se encontraron llamadas con ese criterio"
                    : "Comienza registrando tu primera llamada"}
                </p>
                <Link href="/agente/registrar-llamada">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Registrar Llamada
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
