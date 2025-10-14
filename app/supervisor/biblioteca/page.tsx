"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Play, BookOpen, Star, User, Calendar } from "lucide-react"
import { mockLlamadas, mockAgentes } from "@/lib/mock-data"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Mock training examples with categories
const trainingExamples = [
  {
    id: "1",
    title: "Manejo de Objeciones - Precio Alto",
    categoria: "Objeciones",
    descripcion: "Ejemplo de cómo manejar objeciones relacionadas con el precio del producto",
    llamadaId: "3",
    notas: "Excelente técnica de reframe y presentación de valor",
    tags: ["precio", "valor", "objeciones"],
  },
  {
    id: "2",
    title: "Cierre Efectivo - Técnica Assumptive",
    categoria: "Cierre",
    descripcion: "Demostración de cierre assumptive con cliente indeciso",
    llamadaId: "1",
    notas: "Timing perfecto y lenguaje corporal adecuado",
    tags: ["cierre", "assumptive", "indecision"],
  },
  {
    id: "3",
    title: "Construcción de Rapport - Cliente Difícil",
    categoria: "Comunicación",
    descripcion: "Cómo establecer conexión con clientes inicialmente hostiles",
    llamadaId: "3",
    notas: "Uso efectivo de la escucha activa y empatía",
    tags: ["rapport", "empatia", "comunicacion"],
  },
]

const categorias = ["Todas", "Objeciones", "Cierre", "Comunicación", "Producto"]

export default function BibliotecaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas")

  const ejemplosLlamadas = mockLlamadas.filter((llamada) => llamada.esEjemplo)

  const filteredExamples = trainingExamples.filter((example) => {
    const matchesSearch =
      example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      example.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      example.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "Todas" || example.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getAgenteName = (agenteId: string) => {
    const agente = mockAgentes.find((a) => a.id === agenteId)
    return agente?.nombre || "Desconocido"
  }

  const getLlamadaInfo = (llamadaId: string) => {
    return mockLlamadas.find((l) => l.id === llamadaId)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Biblioteca de Ejemplos</h1>
          <p className="text-muted-foreground">Recursos de entrenamiento y llamadas ejemplares</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar ejemplos por título, descripción o etiquetas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="ejemplos" className="space-y-4">
          <TabsList>
            <TabsTrigger value="ejemplos">Ejemplos de Entrenamiento</TabsTrigger>
            <TabsTrigger value="llamadas">Llamadas Destacadas</TabsTrigger>
          </TabsList>

          <TabsContent value="ejemplos">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categorias.map((categoria) => (
                <Button
                  key={categoria}
                  variant={selectedCategory === categoria ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(categoria)}
                >
                  {categoria}
                </Button>
              ))}
            </div>

            {/* Training Examples Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredExamples.map((example) => {
                const llamada = getLlamadaInfo(example.llamadaId)
                return (
                  <Card key={example.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Badge variant="outline">{example.categoria}</Badge>
                        <Star className="h-4 w-4 text-yellow-500" />
                      </div>
                      <CardTitle className="text-lg">{example.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{example.descripcion}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {example.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Call Info */}
                      {llamada && (
                        <div className="bg-muted p-3 rounded-lg text-sm">
                          <p className="font-medium">Llamada: {llamada.cliente}</p>
                          <p className="text-muted-foreground">
                            {getAgenteName(llamada.agenteId)} • {llamada.duracion} min
                          </p>
                        </div>
                      )}

                      {/* Notes */}
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Notas del supervisor:</strong> {example.notas}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="flex-1">
                              <Play className="mr-2 h-4 w-4" />
                              Ver Ejemplo
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{example.title}</DialogTitle>
                              <DialogDescription>{example.descripcion}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              {llamada && (
                                <div className="bg-muted p-4 rounded-lg">
                                  <h4 className="font-medium mb-2">Información de la Llamada</h4>
                                  <div className="grid gap-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Cliente:</span>
                                      <span>{llamada.cliente}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Agente:</span>
                                      <span>{getAgenteName(llamada.agenteId)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Duración:</span>
                                      <span>{llamada.duracion} minutos</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Resultado:</span>
                                      <Badge variant={llamada.resultado === "venta" ? "venta" : "no-venta"}>
                                        {llamada.resultado === "venta" ? "Venta" : "No venta"}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div>
                                <h4 className="font-medium mb-2">Puntos Clave de Aprendizaje</h4>
                                <p className="text-sm bg-blue-50 p-3 rounded">{example.notas}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Transcripción</h4>
                                <div className="bg-muted p-3 rounded text-sm">
                                  <p className="italic">
                                    {llamada?.transcripcion ||
                                      "Transcripción no disponible. En una implementación real, aquí se mostraría la transcripción completa de la llamada con marcadores de tiempo y análisis de IA."}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <BookOpen className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="llamadas">
            <Card>
              <CardHeader>
                <CardTitle>Llamadas Destacadas ({ejemplosLlamadas.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ejemplosLlamadas.map((llamada) => (
                    <div key={llamada.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium">Llamada con {llamada.cliente}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{getAgenteName(llamada.agenteId)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{format(new Date(llamada.fecha), "dd MMM yyyy", { locale: es })}</span>
                            </div>
                            <span>{llamada.duracion} min</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={llamada.resultado === "venta" ? "venta" : "no-venta"}>
                            {llamada.resultado === "venta" ? "Venta" : "No venta"}
                          </Badge>
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            Ejemplo
                          </Badge>
                        </div>
                      </div>
                      {llamada.comentarios && <p className="text-sm bg-muted p-3 rounded">{llamada.comentarios}</p>}
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          <Play className="mr-2 h-4 w-4" />
                          Reproducir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
