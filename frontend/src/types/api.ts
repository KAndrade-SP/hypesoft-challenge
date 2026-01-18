export type CategoryDto = {
  id: string
  name: string
}

export type ProductDto = {
  id: string
  name: string
  description: string
  price: number
  stockQuantity: number
  categoryId: string
  categoryName: string
}

export type CategoryCountDto = {
  categoryId: string
  categoryName: string
  productCount: number
}

export type DashboardSummaryDto = {
  totalProducts: number
  totalStockValue: number
  lowStockProducts: ProductDto[]
  productsByCategory: CategoryCountDto[]
}
