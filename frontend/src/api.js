// Thin fetch wrapper: adds the JWT, parses JSON, throws readable errors.
const BASE = import.meta.env.VITE_API_URL || '/api';
export const getToken = () => localStorage.getItem('fr_token') || sessionStorage.getItem('fr_token');

export async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const t = getToken(); if (t) headers.Authorization = `Bearer ${t}`;
  const res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}
