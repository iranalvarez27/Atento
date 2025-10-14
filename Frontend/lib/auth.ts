<<<<<<< Updated upstream
import { msFetch } from "./msfetch";

/**
 * La interfaz de usuario que representa los datos que recibimos
 * del backend una vez que el login es exitoso.
=======
// lib/auth.ts

import { msFetch } from "./msfetch";

/**
 * MEJORA: La interfaz User ahora representa el objeto de usuario completo
 * que obtenemos del backend, con todos los campos necesarios.
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
 * Es crucial que tu backend devuelva 'user_id' al iniciar sesión.
>>>>>>> Stashed changes
 */
interface LoginResponse {
  access_token: string;
  user_id: number;
  email: string;
  role_name: string;
}

/**
<<<<<<< Updated upstream
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
=======
 * Lógica de login mejorada. Inicia sesión y luego obtiene los datos completos del usuario.
 */
export async function login(email: string, password: string): Promise<User | null> {
  try {
    // --- PASO 1: Autenticar y obtener el token + user_id ---
    const loginRes = await msFetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
>>>>>>> Stashed changes
    });

    if (!loginRes.ok) {
      const errorData = await loginRes.json().catch(() => null);
<<<<<<< Updated upstream
      // El backend nos devuelve el error "Credenciales inválidas", y aquí lo capturamos.
=======
      console.error("Error en la autenticación:", errorData?.detail || loginRes.status);
>>>>>>> Stashed changes
      throw new Error(errorData?.detail || "Credenciales incorrectas.");
    }

    const loginData: LoginResponse = await loginRes.json();

    if (!loginData.access_token || !loginData.user_id) {
<<<<<<< Updated upstream
=======
      console.error("La respuesta del login no contiene token o user_id.");
>>>>>>> Stashed changes
      throw new Error("Respuesta de autenticación incompleta del servidor.");
    }

    const { access_token, user_id } = loginData;

<<<<<<< Updated upstream
    // PASO 2: Obtener los datos completos del usuario.
    const userDetailsRes = await msFetch(`/users/${user_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
=======
    // --- PASO 2: Usar el nuevo token para obtener los datos completos del usuario ---
    const userDetailsRes = await msFetch(`/users/${user_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`, // Usamos el token que acabamos de recibir
>>>>>>> Stashed changes
      },
    });

    if (!userDetailsRes.ok) {
<<<<<<< Updated upstream
=======
      console.error("No se pudieron obtener los detalles del usuario después del login.");
>>>>>>> Stashed changes
      throw new Error("No se pudo cargar la información del perfil.");
    }

    const fullUserData: User = await userDetailsRes.json();

<<<<<<< Updated upstream
    // PASO 3: Guardar todo en el navegador.
    localStorage.setItem("user_token", access_token);
    localStorage.setItem("current_user", JSON.stringify(fullUserData));

    return fullUserData;

  } catch (err) {
    // Propagamos el error para que el formulario de login (page.tsx) pueda mostrarlo.
=======
    // --- PASO 3: Guardar todo en localStorage ---
    localStorage.setItem("user_token", access_token);
    localStorage.setItem("current_user", JSON.stringify(fullUserData));

    console.log("Login exitoso y datos de usuario completos guardados:", fullUserData);

    return fullUserData;

  } catch (err) {
    console.error("Error de conexión durante el login:", err);
    // Propagamos el error para que el formulario de login pueda mostrarlo.
>>>>>>> Stashed changes
    throw err;
  }
}

<<<<<<< Updated upstream

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
=======
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
>>>>>>> Stashed changes
    return null;
  }
}

<<<<<<< Updated upstream
=======
/**
 * Devuelve el token JWT guardado.
 */
>>>>>>> Stashed changes
export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("user_token");
  }
  return null;
}

<<<<<<< Updated upstream
=======
/**
 * Cierra sesión (borra los datos de token y usuario).
 */
>>>>>>> Stashed changes
export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("current_user");
    localStorage.removeItem("user_token");
  }
<<<<<<< Updated upstream
}
=======
}
>>>>>>> Stashed changes
