// lib/msfetch.ts
export async function msFetch(path: string, options?: RequestInit) {
  const base = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5001";

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }

  return res; 
}
