import { getAuthToken } from "@/services/auth"

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"

async function handleResponse<T>(response: Response): Promise<T> {
  const text = await response.text()
  let payload:
    | {
        error?: string
        message?: string
        title?: string
        detail?: string
        errors?: Record<string, string[]>
      }
    | null = null

  if (text) {
    try {
      payload = JSON.parse(text) as {
        error?: string
        message?: string
        title?: string
        detail?: string
        errors?: Record<string, string[]>
      }
    } catch {
      payload = null
    }
  }

  if (!response.ok) {
    if (payload) {
      const validationErrors = payload.errors
        ? Object.values(payload.errors).flat().filter(Boolean)
        : []
      const message =
        validationErrors.join(" ") ||
        payload.error ||
        payload.message ||
        payload.detail ||
        payload.title
      if (message) {
        throw new Error(message)
      }
    }

    if (text) {
      throw new Error(text)
    }

    throw new Error(`Request failed: ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}

function buildHeaders() {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  const token = getAuthToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: buildHeaders(),
    cache: "no-store",
  })

  return handleResponse<T>(response)
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  })

  return handleResponse<T>(response)
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  })

  return handleResponse<T>(response)
}

export async function apiDelete<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: buildHeaders(),
  })

  return handleResponse<T>(response)
}
