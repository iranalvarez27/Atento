"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, CheckCircle } from "lucide-react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function RegistrarLlamadaPage() {
  const [formData, setFormData] = useState({
    cliente: "",
    duracion: "",
    resultado: "",
    transcripcion: "",
    comentarios: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [transcripcionFile, setTranscripcionFile] = useState<File | null>(null)
  const router = useRouter()
  const user = getCurrentUser()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Llamada registrada correctamente",
        description: "La información ha sido guardada exitosamente.",
      })
      router.push("/agente/dashboard")
    }, 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setTranscripcionFile(file)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/agente/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Registrar Llamada</h1>
            <p className="text-muted-foreground">Completa la información de tu llamada</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la Llamada</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cliente */}
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Input
                  id="cliente"
                  placeholder="Nombre del cliente"
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Duración y Resultado */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duracion">Duración (minutos) *</Label>
                  <Input
                    id="duracion"
                    type="number"
                    placeholder="15"
                    min="1"
                    value={formData.duracion}
                    onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resultado">Resultado *</Label>
                  <Select
                    value={formData.resultado}
                    onValueChange={(value) => setFormData({ ...formData, resultado: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el resultado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="venta">Venta</SelectItem>
                      <SelectItem value="no-venta">No venta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Transcripción */}
              <div className="space-y-2">
                <Label>Transcripción</Label>
                <div className="space-y-4">
                  {/* File upload */}
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Arrastra un archivo de audio aquí o haz clic para seleccionar
                      </p>
                      <input
                        type="file"
                        accept="audio/*,.mp3,.wav,.m4a"
                        onChange={handleFileChange}
                        className="hidden"
                        id="transcripcion-file"
                        disabled={isLoading}
                      />
                      <Label htmlFor="transcripcion-file" className="cursor-pointer">
                        <Button type="button" variant="outline" disabled={isLoading}>
                          Seleccionar archivo
                        </Button>
                      </Label>
                    </div>
                    {transcripcionFile && (
                      <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>{transcripcionFile.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Or text input */}
                  <div className="text-center text-sm text-muted-foreground">o</div>
                  <Textarea
                    placeholder="Escribe la transcripción manualmente..."
                    value={formData.transcripcion}
                    onChange={(e) => setFormData({ ...formData, transcripcion: e.target.value })}
                    rows={4}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Comentarios */}
              <div className="space-y-2">
                <Label htmlFor="comentarios">Comentarios adicionales</Label>
                <Textarea
                  id="comentarios"
                  placeholder="Notas sobre la llamada, observaciones, etc."
                  value={formData.comentarios}
                  onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              {/* AI Analysis Preview */}
              {(formData.transcripcion || transcripcionFile) && (
                <Alert>
                  <AlertDescription>
                    <strong>Análisis automático:</strong> Una vez guardada la llamada, nuestro sistema de IA
                    proporcionará tips automáticos basados en la transcripción para mejorar tu desempeño.
                  </AlertDescription>
                </Alert>
              )}

              {/* Actions */}
              <div className="flex space-x-4 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Guardando..." : "Guardar Llamada"}
                </Button>
                <Link href="/agente/dashboard">
                  <Button type="button" variant="outline" disabled={isLoading}>
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
