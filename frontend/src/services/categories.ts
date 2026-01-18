import { apiDelete, apiGet, apiPost, apiPut } from "@/services/api"
import type { CategoryDto } from "@/types/api"

export type CategoryPayload = {
  name: string
}

export async function getCategories(name?: string) {
  const params = new URLSearchParams()
  if (name) params.set("name", name)
  const query = params.toString()
  return apiGet<CategoryDto[]>(`/api/categories${query ? `?${query}` : ""}`)
}

export async function createCategory(payload: CategoryPayload) {
  return apiPost<unknown>("/api/categories", payload)
}

export async function updateCategory(id: string, payload: CategoryPayload) {
  return apiPut(`/api/categories/${id}`, payload)
}

export async function deleteCategory(id: string) {
  return apiDelete(`/api/categories/${id}`)
}
