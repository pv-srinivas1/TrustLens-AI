/**
 * TRUSTLENS TECHNOLOGIES - Centralized API Resolution Helper
 * 
 * Supports Vercel Services Routing & Bindings:
 * - In browser (client): relative URL "" directs requests to /api/... which Vercel rewrites to the 'backend' service.
 * - On server (functions/SSR): uses BACKEND_URL injected by Vercel service binding.
 * - Local fallback: http://localhost:8000
 */

export function getApiBaseUrl(): string {
  // Always return the Render backend URL directly to avoid Vercel rewrite issues
  return "https://trustlens-api-ds3s.onrender.com";
}

export function apiUrl(endpoint: string): string {
  const base = getApiBaseUrl();
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}
