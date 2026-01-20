import { useCallback, useEffect, useState } from "react"
import { useKeycloak } from "@react-keycloak/web"

import { getCategories } from "@/services/categories"
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  updateProductStock,
} from "@/services/products"
import type { CategoryDto, ProductDto } from "@/types/api"
import { toast } from "react-toastify"
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
const numberRegex = /^\d+([.,]\d+)?$/

function parsePrice(value: string) {
  const normalized = value.replace(",", ".").trim()
  if (!normalized) {
    return { value: null, error: "Price is required." }
  }
  if (!numberRegex.test(normalized)) {
    return { value: null, error: "Price must be a number." }
  }
  if (!priceRegex.test(normalized)) {
    return { value: null, error: "Price can have up to 2 decimal places." }
  }

  const parsed = Number(normalized)
  if (Number.isNaN(parsed) || parsed <= 0) {
    return { value: null, error: "Price must be greater than zero." }
  }

  return { value: parsed, error: null }
}

function parseStock(value: string) {
  const normalized = value.trim()
  if (!normalized) {
    return { value: null, error: "Stock is required." }
  }
  if (!/^\d+$/.test(normalized)) {
    return { value: null, error: "Stock must be a whole number." }
  }
  const parsed = Number(normalized)
  if (Number.isNaN(parsed) || parsed < 0) {
    return { value: null, error: "Stock must be zero or greater." }
  }
  return { value: parsed, error: null }
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
  const { keycloak, initialized } = useKeycloak()
  const [products, setProducts] = useState<ProductDto[]>([])
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [createForm, setCreateForm] = useState<ProductFormState>(emptyForm)
  const [editForm, setEditForm] = useState<ProductFormState>(emptyForm)
  const [editingId, setEditingId] = useState<string>("")

  useEffect(() => {
    const storedCreate = window.localStorage.getItem("product_create_form")
    const storedEdit = window.localStorage.getItem("product_edit_form")
    const storedEditingId = window.localStorage.getItem("product_editing_id")
    if (storedCreate) {
      try {
        setCreateForm(JSON.parse(storedCreate) as ProductFormState)
      } catch {
        // ignore
      }
    }
    if (storedEdit) {
      try {
        setEditForm(JSON.parse(storedEdit) as ProductFormState)
      } catch {
        // ignore
      }
    }
    if (storedEditingId) {
      setEditingId(storedEditingId)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem("product_create_form", JSON.stringify(createForm))
  }, [createForm])

  useEffect(() => {
    window.localStorage.setItem("product_edit_form", JSON.stringify(editForm))
  }, [editForm])

  useEffect(() => {
    if (editingId) {
      window.localStorage.setItem("product_editing_id", editingId)
    } else {
      window.localStorage.removeItem("product_editing_id")
    }
  }, [editingId])

  const loadProducts = useCallback(async () => {
    if (!initialized || !keycloak?.authenticated) {
      return
    }
    const data = await getProducts(
      search.trim() || undefined,
      categoryFilter === "all" ? undefined : categoryFilter,
      page,
      pageSize
    )
    setProducts(data)
  }, [categoryFilter, initialized, keycloak, page, search])

  const loadCategories = useCallback(async () => {
    if (!initialized || !keycloak?.authenticated) {
      return
    }
    const data = await getCategories()
    setCategories(data)
  }, [initialized, keycloak])

  const refresh = useCallback(async () => {
    if (!initialized || !keycloak?.authenticated) {
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      await Promise.all([loadProducts(), loadCategories()])
    } catch (error) {
      const message = getErrorMessage(error, "Unable to load products.")
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [initialized, keycloak, loadCategories, loadProducts])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadProducts().catch((error) => {
        const message = getErrorMessage(error, "Failed to fetch products.")
        setError(message)
        toast.error(message)
      })
    }, 300)
    return () => clearTimeout(timeout)
  }, [loadProducts])

  useEffect(() => {
    setPage(1)
  }, [search, categoryFilter])

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
      toast.error(fieldError)
      return
    }

    const priceResult = parsePrice(createForm.price)
    const stockResult = parseStock(createForm.stock)

    if (!createForm.categoryId) {
      setError("Select a category.")
      toast.error("Select a category.")
      return
    }
    if (priceResult.error) {
      setError(priceResult.error)
      toast.error(priceResult.error)
      return
    }
    if (stockResult.error) {
      setError(stockResult.error)
      toast.error(stockResult.error)
      return
    }

    setLoading(true)
    setError(null)

    try {
      await createProduct({
        name: createForm.name,
        description: createForm.description,
        price: priceResult.value ?? 0,
        stock: stockResult.value ?? 0,
        categoryId: createForm.categoryId,
      })
      setCreateForm(emptyForm)
      await refresh()
      toast.success("Product created successfully.")
    } catch (error) {
      const message = getErrorMessage(error, "Unable to create product.")
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {

    if (!editingId) return

    const fieldError = validateProductFields(editForm.name, editForm.description)
    if (fieldError) {
      setError(fieldError)
      toast.error(fieldError)
      return
    }

    const priceResult = parsePrice(editForm.price)
    const stockResult = parseStock(editForm.stock)

    if (!editForm.categoryId) {
      setError("Select a category.")
      toast.error("Select a category.")
      return
    }
    if (priceResult.error) {
      setError(priceResult.error)
      toast.error(priceResult.error)
      return
    }
    if (stockResult.error) {
      setError(stockResult.error)
      toast.error(stockResult.error)
      return
    }

    setLoading(true)
    setError(null)

    try {
      await updateProduct({
        id: editingId,
        name: editForm.name,
        description: editForm.description,
        price: priceResult.value ?? 0,
        stock: stockResult.value ?? 0,
        categoryId: editForm.categoryId,
      })
      await refresh()
      toast.success("Product updated successfully.")
    } catch (error) {
      const message = getErrorMessage(error, "Unable to update product.")
      setError(message)
      toast.error(message)
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
      toast.success("Product deleted successfully.")
    } catch (error) {
      const message = getErrorMessage(error, "Unable to delete product.")
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleStockUpdate = async (id: string, stock: number) => {

    if (stock < 0) {
      setError("Stock must be zero or greater.")
      toast.error("Stock must be zero or greater.")
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      await updateProductStock(id, stock)
      await refresh()
      toast.success("Stock updated successfully.")
    } catch (error) {
      const message = getErrorMessage(error, "Unable to update stock.")
      setError(message)
      toast.error(message)
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
    page,
    setPage,
    pageSize,
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
    clearCreateForm: () => setCreateForm(emptyForm),
    clearEditForm: () => {
      setEditingId("")
      setEditForm(emptyForm)
    },
  }
}
