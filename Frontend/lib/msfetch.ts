// lib/msfetch.ts
export async function msFetch(path: string, options?: RequestInit) {
<<<<<<< Updated upstream
  const base = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5001";
=======
  const base = process.env.MS_USERS_URL ?? "http://127.0.0.1:8000";
>>>>>>> Stashed changes

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

<<<<<<< Updated upstream
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }

  return res; 
=======
  return res;
>>>>>>> Stashed changes
}
