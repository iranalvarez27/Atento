"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Star, CheckCircle, Clock, User } from "lucide-react"
import { mockFeedbacks, mockLlamadas } from "@/lib/mock-data"
import { getCurrentUser } from "@/lib/auth"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ChatDialog } from "@/components/ui/chat-dialog"

export default function FeedbackPage() {
  const searchParams = useSearchParams()
  const llamadaId = searchParams.get("llamada")
  const user = getCurrentUser()
  const [feedbacks, setFeedbacks] = useState(mockFeedbacks.filter((feedback) => feedback.agenteId === user?.id))
  const [selectedFeedbackForChat, setSelectedFeedbackForChat] = useState<(typeof mockFeedbacks)[0] | null>(null)

  const selectedFeedback = llamadaId ? feedbacks.find((f) => f.llamadaId === llamadaId) : null

  const markAsReviewed = (feedbackId: string) => {
    setFeedbacks((prev) =>
      prev.map((feedback) => (feedback.id === feedbackId ? { ...feedback, estado: "revisado" as const } : feedback)),
    )
  }

  const getLlamadaInfo = (llamadaId: string) => {
    return mockLlamadas.find((llamada) => llamada.id === llamadaId)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Feedback Recibido</h1>
          <p className="text-muted-foreground">Retroalimentación de tus supervisores para mejorar tu desempeño</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{feedbacks.length}</p>
                  <p className="text-sm text-muted-foreground">Total Feedbacks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{feedbacks.filter((f) => f.estado === "pendiente").length}</p>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold">
                    {feedbacks.length > 0
                      ? (feedbacks.reduce((acc, f) => acc + f.puntuacion, 0) / feedbacks.length).toFixed(1)
                      : "0"}
                  </p>
                  <p className="text-sm text-muted-foreground">Puntuación Promedio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Feedback Detail */}
        {selectedFeedback && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Feedback Seleccionado</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FeedbackCard feedback={selectedFeedback} onMarkReviewed={markAsReviewed} detailed />
            </CardContent>
          </Card>
        )}

        {/* All Feedbacks */}
        <Card>
          <CardHeader>
            <CardTitle>Todos los Feedbacks</CardTitle>
          </CardHeader>
          <CardContent>
            {feedbacks.length > 0 ? (
              <div className="space-y-4">
                {feedbacks.map((feedback) => (
                  <FeedbackCard
                    key={feedback.id}
                    feedback={feedback}
                    onMarkReviewed={markAsReviewed}
                    onOpenChat={setSelectedFeedbackForChat}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay feedback disponible</h3>
                <p className="text-muted-foreground">
                  Los feedbacks de tus supervisores aparecerán aquí una vez que revisen tus llamadas.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Dialog */}
        {selectedFeedbackForChat && user && (
          <ChatDialog
            isOpen={!!selectedFeedbackForChat}
            onClose={() => setSelectedFeedbackForChat(null)}
            feedback={selectedFeedbackForChat}
            currentUserId={user.id}
            currentUserRole="agente"
          />
        )}
      </div>
    </DashboardLayout>
  )
}

interface FeedbackCardProps {
  feedback: (typeof mockFeedbacks)[0]
  onMarkReviewed: (id: string) => void
  onOpenChat: (feedback: (typeof mockFeedbacks)[0]) => void
  detailed?: boolean
}

function FeedbackCard({ feedback, onMarkReviewed, onOpenChat, detailed = false }: FeedbackCardProps) {
  const llamada = mockLlamadas.find((l) => l.id === feedback.llamadaId)

  return (
    <div className="border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Supervisor</span>
            <Badge variant={feedback.estado === "pendiente" ? "pendiente" : "revisado"}>
              {feedback.estado === "pendiente" ? "Pendiente" : "Revisado"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {format(new Date(feedback.fecha), "dd MMM yyyy, HH:mm", { locale: es })}
          </p>
        </div>
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < feedback.puntuacion ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
          <span className="ml-2 text-sm font-medium">{feedback.puntuacion}/5</span>
        </div>
      </div>

      {/* Call Info */}
      {llamada && (
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-sm font-medium">Llamada: {llamada.cliente}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(llamada.fecha), "dd MMM yyyy, HH:mm", { locale: es })} • {llamada.duracion} min •{" "}
            <Badge variant={llamada.resultado === "venta" ? "venta" : "no-venta"} className="text-xs">
              {llamada.resultado === "venta" ? "Venta" : "No venta"}
            </Badge>
          </p>
        </div>
      )}

      {/* Aspects */}
      <div>
        <p className="text-sm font-medium mb-2">Aspectos evaluados:</p>
        <div className="flex flex-wrap gap-2">
          {feedback.aspectos.map((aspecto) => (
            <Badge key={aspecto} variant="outline">
              {aspecto}
            </Badge>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div>
        <p className="text-sm font-medium mb-2">Comentarios:</p>
        <p className="text-sm bg-muted p-3 rounded">{feedback.comentarios}</p>
      </div>

      {/* Actions */}
      {feedback.estado === "pendiente" && (
        <div className="flex justify-end space-x-2">
          <Button size="sm" onClick={() => onOpenChat(feedback)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Responder
          </Button>
          <Button size="sm" variant="outline" onClick={() => onMarkReviewed(feedback.id)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Marcar como revisado
          </Button>
        </div>
      )}
    </div>
  )
}
