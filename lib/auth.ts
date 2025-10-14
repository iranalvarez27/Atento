import { msFetch } from "./msfetch";

/**
 * La interfaz de usuario que representa los datos que recibimos
 * del backend una vez que el login es exitoso.
 */
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
  role_name: "ADMIN" | "SUPERVISOR" | "LEARNER";
}

/**
 * Interfaz para la respuesta INICIAL del endpoint de login.
 */
interface LoginResponse {
  access_token: string;
  user_id: number;
  email: string;
  role_name: string;
}

/**
 * Lógica de login. Esta función es CORRECTA.
 * Envía el email y la contraseña en texto plano al backend.
 * El backend es el único responsable de hashear y comparar.
 */
export async function login(email: string, password: string): Promise<User | null> {
  try {
    // PASO 1: Autenticar. Se envía el password tal como el usuario lo escribió.
    const loginRes = await msFetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), // Envío de credenciales en texto plano
    });

    if (!loginRes.ok) {
      const errorData = await loginRes.json().catch(() => null);
      // El backend nos devuelve el error "Credenciales inválidas", y aquí lo capturamos.
      throw new Error(errorData?.detail || "Credenciales incorrectas.");
    }

    const loginData: LoginResponse = await loginRes.json();

    if (!loginData.access_token || !loginData.user_id) {
      throw new Error("Respuesta de autenticación incompleta del servidor.");
    }

    const { access_token, user_id } = loginData;

    // PASO 2: Obtener los datos completos del usuario.
    const userDetailsRes = await msFetch(`/users/${user_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userDetailsRes.ok) {
      throw new Error("No se pudo cargar la información del perfil.");
    }

    const fullUserData: User = await userDetailsRes.json();

    // PASO 3: Guardar todo en el navegador.
    localStorage.setItem("user_token", access_token);
    localStorage.setItem("current_user", JSON.stringify(fullUserData));

    return fullUserData;

  } catch (err) {
    // Propagamos el error para que el formulario de login (page.tsx) pueda mostrarlo.
    throw err;
  }
}


/**
 * NUEVA FUNCION: Solicita la recuperación de contraseña.
 * Envía el email al backend para iniciar el proceso.
 */
export async function forgotPassword(email: string): Promise<any> {
  try {
    const res = await msFetch("/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Si el backend devuelve un error (ej: email no encontrado), lo lanzamos.
      throw new Error(data?.detail || "No se pudo procesar la solicitud.");
    }

    return data;
  } catch (err) {
    // Propagamos el error para que el formulario pueda mostrarlo.
    throw err;
  }
}


// --- Funciones auxiliares (también correctas) ---

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("current_user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch (error) {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("user_token");
  }
  return null;
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("current_user");
    localStorage.removeItem("user_token");
  }
}
