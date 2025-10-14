"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, MessageSquare } from "lucide-react"
import { mockChatMessages, type ChatMessage, type Feedback } from "@/lib/mock-data"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"

interface ChatDialogProps {
  isOpen: boolean
  onClose: () => void
  feedback: Feedback
  currentUserId: string
  currentUserRole: "agente" | "supervisor"
}

export function ChatDialog({ isOpen, onClose, feedback, currentUserId, currentUserRole }: ChatDialogProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    mockChatMessages.filter((msg) => msg.feedbackId === feedback.id),
  )
  const [newMessage, setNewMessage] = useState("")
  const { toast } = useToast()

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      feedbackId: feedback.id,
      senderId: currentUserId,
      senderRole: currentUserRole,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    toast({
      title: "Mensaje enviado",
      description: "Tu mensaje ha sido enviado exitosamente.",
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Chat sobre Feedback</span>
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Puntuación: {feedback.puntuacion}/5 • {format(new Date(feedback.fecha), "dd MMM yyyy", { locale: es })}
          </div>
        </DialogHeader>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 border rounded-lg">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No hay mensajes aún. ¡Inicia la conversación!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.senderId === currentUserId ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {message.senderRole === "agente" ? "Agente" : "Supervisor"}
                      </Badge>
                      <span className="text-xs opacity-70">
                        {format(new Date(message.timestamp), "HH:mm", { locale: es })}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="flex space-x-2">
          <Textarea
            placeholder="Escribe tu mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 min-h-[60px] max-h-[120px]"
            rows={2}
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
