import { useCallback, useEffect, useState } from "react"

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/categories"
import type { CategoryDto } from "@/types/api"
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
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [createForm, setCreateForm] = useState<CategoryFormState>(emptyForm)
  const [editForm, setEditForm] = useState<CategoryFormState>(emptyForm)
  const [editingId, setEditingId] = useState("")

  const refresh = useCallback(async () => {

    setLoading(true)
    setError(null)
    
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      setError(getErrorMessage(error, "Unable to load categories."))
    } finally {
      setLoading(false)
    }
  }, [])

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
      return
    }

    setLoading(true)
    setError(null)

    try {
      await createCategory({ name: createForm.name })
      setCreateForm(emptyForm)
      await refresh()
    } catch (error) {
      setError(getErrorMessage(error, "Unable to create category."))
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {

    if (!editingId) return

    const fieldError = validateCategoryName(editForm.name)

    if (fieldError) {
      setError(fieldError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      await updateCategory(editingId, { name: editForm.name })
      await refresh()
    } catch (error) {
      setError(getErrorMessage(error, "Unable to update category."))
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
    } catch (error) {
      setError(getErrorMessage(error, "Unable to delete category."))
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
  }
}
