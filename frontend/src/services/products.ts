import { apiDelete, apiGet, apiPost, apiPut } from "@/services/api"
import type { ProductDto } from "@/types/api"

export type CreateProductPayload = {
  name: string
  description: string
  price: number
  categoryId: string
  stock: number
}

export type UpdateProductPayload = CreateProductPayload & { id: string }

export async function getProducts(
  search?: string,
  categoryId?: string,
  page?: number,
  pageSize?: number
) {
  const params = new URLSearchParams()
  if (search) params.set("search", search)
  if (categoryId) params.set("categoryId", categoryId)
  if (page) params.set("page", String(page))
  if (pageSize) params.set("pageSize", String(pageSize))
  const query = params.toString()
  return apiGet<ProductDto[]>(`/api/products${query ? `?${query}` : ""}`)
}

export async function getLowStockProducts() {
  return apiGet<ProductDto[]>("/api/products/low-stock")
}

export async function createProduct(payload: CreateProductPayload) {
  return apiPost<unknown>("/api/products", payload)
}

export async function updateProduct(payload: UpdateProductPayload) {
  return apiPut(`/api/products/${payload.id}`, payload)
}

export async function updateProductStock(id: string, stock: number) {
  return apiPut(`/api/products/${id}/stock`, { stock })
}

export async function deleteProduct(id: string) {
  return apiDelete(`/api/products/${id}`)
}
