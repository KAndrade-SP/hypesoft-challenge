import { useCallback, useEffect, useState } from "react"

import { getCategories } from "@/services/categories"
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  updateProductStock,
} from "@/services/products"
import type { CategoryDto, ProductDto } from "@/types/api"
import { getErrorMessage } from "@/utils/errors"

type ProductFormState = {
  name: string
  description: string
  price: string
  stock: string
  categoryId: string
}

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
}

const priceRegex = /^\d+([.,]\d{1,2})?$/

function parsePrice(value: string) {

  const normalized = value.replace(",", ".").trim()

  if (!normalized || !priceRegex.test(normalized)) {
    return null
  }

  const parsed = Number(normalized)

  if (Number.isNaN(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

function parseStock(value: string) {

  const parsed = Number(value)

  if (Number.isNaN(parsed) || parsed < 0) {
    return null
  }
  return Math.floor(parsed)
}

function validateProductFields(name: string, description: string) {
  if (!name.trim()) {
    return "Product name is required."
  }
  if (name.length > 45) {
    return "Product name must be at most 45 characters."
  }
  if (!description.trim()) {
    return "Description is required."
  }
  if (description.length > 100) {
    return "Description must be at most 100 characters."
  }
  return null
}

export function useProducts() {
  const [products, setProducts] = useState<ProductDto[]>([])
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [createForm, setCreateForm] = useState<ProductFormState>(emptyForm)
  const [editForm, setEditForm] = useState<ProductFormState>(emptyForm)
  const [editingId, setEditingId] = useState<string>("")

  const loadProducts = useCallback(async () => {
    const data = await getProducts(
      search.trim() || undefined,
      categoryFilter === "all" ? undefined : categoryFilter
    )
    setProducts(data)
  }, [categoryFilter, search])

  const loadCategories = useCallback(async () => {
    const data = await getCategories()
    setCategories(data)
  }, [])

  const refresh = useCallback(async () => {

    setLoading(true)
    setError(null)
    
    try {
      await Promise.all([loadProducts(), loadCategories()])
    } catch (error) {
      setError(getErrorMessage(error, "Unable to load products."))
    } finally {
      setLoading(false)
    }
  }, [loadCategories, loadProducts])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadProducts().catch((error) =>
        setError(getErrorMessage(error, "Failed to fetch products."))
      )
    }, 300)
    return () => clearTimeout(timeout)
  }, [loadProducts])

  const setEditingProduct = (id: string) => {

    setEditingId(id)
    const product = products.find((item) => item.id === id)

    if (!product) {
      setEditForm(emptyForm)
      return
    }

    setEditForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stockQuantity),
      categoryId: product.categoryId,
    })
  }

  const handleCreate = async () => {

    const fieldError = validateProductFields(
      createForm.name,
      createForm.description
    )

    if (fieldError) {
      setError(fieldError)
      return
    }

    const price = parsePrice(createForm.price)
    const stock = parseStock(createForm.stock)

    if (!createForm.categoryId) {
      setError("Select a category.")
      return
    }
    if (!price) {
      setError("Invalid price. Use up to 2 decimal places.")
      return
    }
    if (stock === null) {
      setError("Invalid stock.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await createProduct({
        name: createForm.name,
        description: createForm.description,
        price,
        stock,
        categoryId: createForm.categoryId,
      })
      setCreateForm(emptyForm)
      await refresh()
    } catch (error) {
      setError(getErrorMessage(error, "Unable to create product."))
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {

    if (!editingId) return

    const fieldError = validateProductFields(editForm.name, editForm.description)
    if (fieldError) {
      setError(fieldError)
      return
    }

    const price = parsePrice(editForm.price)
    const stock = parseStock(editForm.stock)

    if (!editForm.categoryId) {
      setError("Select a category.")
      return
    }
    if (!price) {
      setError("Invalid price. Use up to 2 decimal places.")
      return
    }
    if (stock === null) {
      setError("Invalid stock.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await updateProduct({
        id: editingId,
        name: editForm.name,
        description: editForm.description,
        price,
        stock,
        categoryId: editForm.categoryId,
      })
      await refresh()
    } catch (error) {
      setError(getErrorMessage(error, "Unable to update product."))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {

    if (!editingId) return

    setLoading(true)
    setError(null)

    try {
      await deleteProduct(editingId)
      setEditingId("")
      setEditForm(emptyForm)
      await refresh()
    } catch (error) {
      setError(getErrorMessage(error, "Unable to delete product."))
    } finally {
      setLoading(false)
    }
  }

  const handleStockUpdate = async (id: string, stock: number) => {

    if (stock < 0) {
      setError("Invalid stock.")
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      await updateProductStock(id, stock)
      await refresh()
    } catch (error) {
      setError(getErrorMessage(error, "Unable to update stock."))
    } finally {
      setLoading(false)
    }
  }

  return {
    products,
    categories,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    loading,
    error,
    refresh,
    createForm,
    setCreateForm,
    editForm,
    setEditForm,
    editingId,
    setEditingProduct,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleStockUpdate,
  }
}
