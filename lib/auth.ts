// Interfaz de usuario para el sistema de autenticación simulado
export interface User {
  id: string
  name: string
  email: string
  role: "agente" | "supervisor" | "admin" // roles posibles
  avatar?: string // opcional
}

// Lista de usuarios simulados para el prototipo
export const mockUsers: User[] = [
  {
    id: "1",
    name: "María González",
    email: "maria.gonzalez@atento.com",
    role: "agente",
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@atento.com",
    role: "supervisor",
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana.martinez@atento.com",
    role: "admin",
  },
]

// Función para obtener el usuario actual (si existe en localStorage)
export function getCurrentUser(): User | null {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("currentUser")
    return userStr ? JSON.parse(userStr) : null
  }
  return null
}

// Función de inicio de sesión simulada
export function login(email: string, password: string): User | null {
  // Busca un usuario con el correo dado
  const user = mockUsers.find((u) => u.email === email)

  // Verifica que la contraseña sea "password" (solo para demo)
  if (user && password === "password") {
    // Guarda el usuario en localStorage para simular la sesión
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(user))
    }
    return user
  }
  return null
}

// Función de cierre de sesión simulada
export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser") // Elimina al usuario guardado
  }
}
