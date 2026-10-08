/**
 * TrustLens AI - Centralized API Resolution Helper
 * 
 * Supports Vercel Services Routing & Bindings:
 * - In browser (client): relative URL "" directs requests to /api/... which Vercel rewrites to the 'backend' service.
 * - On server (functions/SSR): uses BACKEND_URL injected by Vercel service binding.
 * - Local fallback: http://localhost:8000
 */

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side: use relative path by default to leverage Vercel / Next.js rewrites
    return process.env.NEXT_PUBLIC_API_URL || "";
  }
  // Server-side: use bound service URL or fallback
  return process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
}

export function apiUrl(endpoint: string): string {
  const base = getApiBaseUrl();
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}
