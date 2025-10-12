// lib/auth.ts

import { msFetch } from "./msfetch";

/**
 * MEJORA: La interfaz User ahora representa el objeto de usuario completo
 * que obtenemos del backend, con todos los campos necesarios.
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
 * Es crucial que tu backend devuelva 'user_id' al iniciar sesión.
 */
interface LoginResponse {
  access_token: string;
  user_id: number;
  email: string;
  role_name: string;
}

/**
 * Lógica de login mejorada. Inicia sesión y luego obtiene los datos completos del usuario.
 */
export async function login(email: string, password: string): Promise<User | null> {
  try {
    // --- PASO 1: Autenticar y obtener el token + user_id ---
    const loginRes = await msFetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!loginRes.ok) {
      const errorData = await loginRes.json().catch(() => null);
      console.error("Error en la autenticación:", errorData?.detail || loginRes.status);
      throw new Error(errorData?.detail || "Credenciales incorrectas.");
    }

    const loginData: LoginResponse = await loginRes.json();

    if (!loginData.access_token || !loginData.user_id) {
      console.error("La respuesta del login no contiene token o user_id.");
      throw new Error("Respuesta de autenticación incompleta del servidor.");
    }

    const { access_token, user_id } = loginData;

    // --- PASO 2: Usar el nuevo token para obtener los datos completos del usuario ---
    const userDetailsRes = await msFetch(`/users/${user_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`, // Usamos el token que acabamos de recibir
      },
    });

    if (!userDetailsRes.ok) {
      console.error("No se pudieron obtener los detalles del usuario después del login.");
      throw new Error("No se pudo cargar la información del perfil.");
    }

    const fullUserData: User = await userDetailsRes.json();

    // --- PASO 3: Guardar todo en localStorage ---
    localStorage.setItem("user_token", access_token);
    localStorage.setItem("current_user", JSON.stringify(fullUserData));

    console.log("Login exitoso y datos de usuario completos guardados:", fullUserData);

    return fullUserData;

  } catch (err) {
    console.error("Error de conexión durante el login:", err);
    // Propagamos el error para que el formulario de login pueda mostrarlo.
    throw err;
  }
}

/**
 * Devuelve el usuario completo guardado en localStorage.
 */
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }
  
  const userStr = localStorage.getItem("current_user");
  if (!userStr) {
    return null;
  }

  try {
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error("Error al parsear los datos del usuario:", error);
    return null;
  }
}

/**
 * Devuelve el token JWT guardado.
 */
export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("user_token");
  }
  return null;
}

/**
 * Cierra sesión (borra los datos de token y usuario).
 */
export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("current_user");
    localStorage.removeItem("user_token");
  }
}