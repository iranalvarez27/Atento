// src/lib/mock-data.ts

export const mockAgentes = [
  {
    id: 1,
    nombre: "Carlos Pérez",
    llamadasHoy: 15,
    ventasHoy: 6,
    tasaConversion: 40,
  },
  {
    id: 2,
    nombre: "María Gómez",
    llamadasHoy: 18,
    ventasHoy: 12,
    tasaConversion: 67,
  },
  {
    id: 3,
    nombre: "Luis Ramírez",
    llamadasHoy: 20,
    ventasHoy: 14,
    tasaConversion: 70,
  },
  {
    id: 4,
    nombre: "Ana Torres",
    llamadasHoy: 10,
    ventasHoy: 3,
    tasaConversion: 30,
  },
]

export const mockLlamadas = [
  { id: 1, agenteId: 1, resultado: "venta", duracion: 5 },
  { id: 2, agenteId: 1, resultado: "no-venta", duracion: 7 },
  { id: 3, agenteId: 2, resultado: "venta", duracion: 6 },
  { id: 4, agenteId: 3, resultado: "venta", duracion: 8 },
  { id: 5, agenteId: 4, resultado: "no-venta", duracion: 9 },
  { id: 6, agenteId: 2, resultado: "venta", duracion: 5 },
]

export const mockFeedbacks = [
  { id: 1, agenteId: 1, estado: "pendiente" },
  { id: 2, agenteId: 2, estado: "completado" },
  { id: 3, agenteId: 3, estado: "pendiente" },
]
