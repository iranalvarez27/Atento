// lib/msfetch.ts
export async function msFetch(path: string, options?: RequestInit) {
  const base = process.env.MS_USERS_URL ?? "http://127.0.0.1:8000";

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  return res;
}
