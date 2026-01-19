import { useCallback, useEffect, useState } from "react"
import { useKeycloak } from "@react-keycloak/web"

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/categories"
import type { CategoryDto } from "@/types/api"
import { toast } from "react-toastify"
import { getErrorMessage } from "@/utils/errors"

type CategoryFormState = {
  name: string
}

const emptyForm: CategoryFormState = { name: "" }

function validateCategoryName(name: string) {
  if (!name.trim()) {
    return "Category name is required."
  }
  if (name.length > 45) {
    return "Category name must be at most 45 characters."
  }
  return null
}

export function useCategories() {
  const { keycloak, initialized } = useKeycloak()
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [createForm, setCreateForm] = useState<CategoryFormState>(emptyForm)
  const [editForm, setEditForm] = useState<CategoryFormState>(emptyForm)
  const [editingId, setEditingId] = useState("")

  useEffect(() => {
    const storedCreate = window.localStorage.getItem("category_create_form")
    const storedEdit = window.localStorage.getItem("category_edit_form")
    const storedEditingId = window.localStorage.getItem("category_editing_id")
    if (storedCreate) {
      try {
        setCreateForm(JSON.parse(storedCreate) as CategoryFormState)
      } catch {
        // ignore
      }
    }
    if (storedEdit) {
      try {
        setEditForm(JSON.parse(storedEdit) as CategoryFormState)
      } catch {
        // ignore
      }
    }
    if (storedEditingId) {
      setEditingId(storedEditingId)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(
      "category_create_form",
      JSON.stringify(createForm)
    )
  }, [createForm])

  useEffect(() => {
    window.localStorage.setItem("category_edit_form", JSON.stringify(editForm))
  }, [editForm])

  useEffect(() => {
    if (editingId) {
      window.localStorage.setItem("category_editing_id", editingId)
    } else {
      window.localStorage.removeItem("category_editing_id")
    }
  }, [editingId])

  const refresh = useCallback(async () => {
    if (!initialized || !keycloak?.authenticated) {
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      const message = getErrorMessage(error, "Unable to load categories.")
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [initialized, keycloak])

  useEffect(() => {
    refresh()
  }, [refresh])

  const setEditingCategory = (id: string) => {

    setEditingId(id)

    const category = categories.find((item) => item.id === id)

    if (!category) {
      setEditForm(emptyForm)
      return
    }
    setEditForm({ name: category.name })
  }

  const handleCreate = async () => {

    const fieldError = validateCategoryName(createForm.name)

    if (fieldError) {
      setError(fieldError)
      toast.error(fieldError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      await createCategory({ name: createForm.name })
      setCreateForm(emptyForm)
      await refresh()
      toast.success("Category created successfully.")
    } catch (error) {
      const message = getErrorMessage(error, "Unable to create category.")
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {

    if (!editingId) return

    const fieldError = validateCategoryName(editForm.name)

    if (fieldError) {
      setError(fieldError)
      toast.error(fieldError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      await updateCategory(editingId, { name: editForm.name })
      await refresh()
      toast.success("Category updated successfully.")
    } catch (error) {
      const message = getErrorMessage(error, "Unable to update category.")
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
      await deleteCategory(editingId)
      setEditingId("")
      setEditForm(emptyForm)
      await refresh()
      toast.success("Category deleted successfully.")
    } catch (error) {
      const message = getErrorMessage(error, "Unable to delete category.")
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return {
    categories,
    loading,
    error,
    createForm,
    setCreateForm,
    editForm,
    setEditForm,
    editingId,
    setEditingCategory,
    handleCreate,
    handleUpdate,
    handleDelete,
    refresh,
    clearCreateForm: () => setCreateForm(emptyForm),
    clearEditForm: () => {
      setEditingId("")
      setEditForm(emptyForm)
    },
  }
}
