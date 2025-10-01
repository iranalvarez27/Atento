// Mock data for the prototype
export interface Llamada {
  id: string
  fecha: string
  cliente: string
  duracion: number // in minutes
  resultado: "venta" | "no-venta"
  transcripcion?: string
  comentarios?: string
  agenteId: string
  feedbackId?: string
  esEjemplo?: boolean
}

export interface Feedback {
  id: string
  llamadaId: string
  supervisorId: string
  agenteId: string
  comentarios: string
  puntuacion: number // 1-5
  aspectos: string[]
  fecha: string
  estado: "pendiente" | "revisado"
}

export interface Agente {
  id: string
  nombre: string
  email: string
  llamadasHoy: number
  ventasHoy: number
  duracionPromedio: number
  tasaConversion: number
  feedbacksPendientes: number
}

export interface ChatMessage {
  id: string
  feedbackId: string
  senderId: string
  senderRole: "agente" | "supervisor"
  message: string
  timestamp: string
  isRead: boolean
}

// Mock data
export const mockLlamadas: Llamada[] = [
  {
    id: "1",
    fecha: "2024-01-15T10:30:00Z",
    cliente: "Juan Pérez",
    duracion: 15,
    resultado: "venta",
    comentarios: "Cliente interesado en el producto premium",
    agenteId: "1",
    feedbackId: "1",
  },
  {
    id: "2",
    fecha: "2024-01-15T11:45:00Z",
    cliente: "Laura Sánchez",
    duracion: 8,
    resultado: "no-venta",
    comentarios: "Cliente no disponible en este momento",
    agenteId: "1",
  },
  {
    id: "3",
    fecha: "2024-01-15T14:20:00Z",
    cliente: "Roberto García",
    duracion: 22,
    resultado: "venta",
    comentarios: "Venta exitosa del paquete básico",
    agenteId: "1",
    feedbackId: "2",
    esEjemplo: true,
  },
]

export const mockFeedbacks: Feedback[] = [
  {
    id: "1",
    llamadaId: "1",
    supervisorId: "2",
    agenteId: "1",
    comentarios: "Excelente manejo de objeciones. Mejorar el cierre.",
    puntuacion: 4,
    aspectos: ["Comunicación", "Técnicas de venta"],
    fecha: "2024-01-15T16:00:00Z",
    estado: "pendiente",
  },
  {
    id: "2",
    llamadaId: "3",
    supervisorId: "2",
    agenteId: "1",
    comentarios: "Llamada ejemplar. Buen ritmo y cierre efectivo.",
    puntuacion: 5,
    aspectos: ["Comunicación", "Cierre", "Empatía"],
    fecha: "2024-01-15T17:30:00Z",
    estado: "revisado",
  },
]

export const mockAgentes: Agente[] = [
  {
    id: "1",
    nombre: "María González",
    email: "maria.gonzalez@atento.com",
    llamadasHoy: 12,
    ventasHoy: 8,
    duracionPromedio: 15,
    tasaConversion: 67,
    feedbacksPendientes: 1,
  },
  {
    id: "4",
    nombre: "Pedro López",
    email: "pedro.lopez@atento.com",
    llamadasHoy: 10,
    ventasHoy: 5,
    duracionPromedio: 18,
    tasaConversion: 50,
    feedbacksPendientes: 2,
  },
  {
    id: "5",
    nombre: "Carmen Ruiz",
    email: "carmen.ruiz@atento.com",
    llamadasHoy: 15,
    ventasHoy: 11,
    duracionPromedio: 12,
    tasaConversion: 73,
    feedbacksPendientes: 0,
  },
  {
    id: "6",
    nombre: "José Martínez",
    email: "jose.martinez@atento.com",
    llamadasHoy: 8,
    ventasHoy: 3,
    duracionPromedio: 20,
    tasaConversion: 38,
    feedbacksPendientes: 3,
  },
  {
    id: "7",
    nombre: "Ana Torres",
    email: "ana.torres@atento.com",
    llamadasHoy: 14,
    ventasHoy: 10,
    duracionPromedio: 14,
    tasaConversion: 71,
    feedbacksPendientes: 1,
  },
  {
    id: "8",
    nombre: "Luis Herrera",
    email: "luis.herrera@atento.com",
    llamadasHoy: 11,
    ventasHoy: 6,
    duracionPromedio: 16,
    tasaConversion: 55,
    feedbacksPendientes: 2,
  },
  {
    id: "9",
    nombre: "Isabel Moreno",
    email: "isabel.moreno@atento.com",
    llamadasHoy: 13,
    ventasHoy: 9,
    duracionPromedio: 13,
    tasaConversion: 69,
    feedbacksPendientes: 0,
  },
  {
    id: "10",
    nombre: "Diego Vargas",
    email: "diego.vargas@atento.com",
    llamadasHoy: 9,
    ventasHoy: 4,
    duracionPromedio: 19,
    tasaConversion: 44,
    feedbacksPendientes: 4,
  },
  {
    id: "11",
    nombre: "Sofía Jiménez",
    email: "sofia.jimenez@atento.com",
    llamadasHoy: 16,
    ventasHoy: 12,
    duracionPromedio: 11,
    tasaConversion: 75,
    feedbacksPendientes: 1,
  },
  {
    id: "12",
    nombre: "Roberto Silva",
    email: "roberto.silva@atento.com",
    llamadasHoy: 7,
    ventasHoy: 2,
    duracionPromedio: 22,
    tasaConversion: 29,
    feedbacksPendientes: 5,
  },
  {
    id: "13",
    nombre: "Patricia Mendoza",
    email: "patricia.mendoza@atento.com",
    llamadasHoy: 12,
    ventasHoy: 7,
    duracionPromedio: 17,
    tasaConversion: 58,
    feedbacksPendientes: 2,
  },
  {
    id: "14",
    nombre: "Fernando Castro",
    email: "fernando.castro@atento.com",
    llamadasHoy: 10,
    ventasHoy: 8,
    duracionPromedio: 15,
    tasaConversion: 80,
    feedbacksPendientes: 0,
  },
]

export const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    feedbackId: "1",
    senderId: "1",
    senderRole: "agente",
    message: "Gracias por el feedback. ¿Podrías darme más detalles sobre cómo mejorar el cierre?",
    timestamp: "2024-01-15T16:30:00Z",
    isRead: false,
  },
  {
    id: "2",
    feedbackId: "1",
    senderId: "2",
    senderRole: "supervisor",
    message:
      "Claro, te recomiendo usar la técnica de cierre por asunción. Pregunta '¿Cuándo te gustaría que iniciemos el servicio?' en lugar de '¿Te interesa el producto?'",
    timestamp: "2024-01-15T17:00:00Z",
    isRead: true,
  },
]
