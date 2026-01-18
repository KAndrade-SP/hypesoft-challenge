"use client"

import type { ChangeEvent } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import type { CategoryDto } from "@/types/api"

type CategoryFormState = {
  name: string
}

type CategoryFormProps = {
  categories: CategoryDto[]
  createForm: CategoryFormState
  setCreateForm: (state: CategoryFormState) => void
  editForm: CategoryFormState
  setEditForm: (state: CategoryFormState) => void
  editingId: string
  setEditingCategory: (id: string) => void
  onCreate: () => void
  onUpdate: () => void
  onDelete: () => void
  loading: boolean
}

export function CategoryForm({
  categories,
  createForm,
  setCreateForm,
  editForm,
  setEditForm,
  editingId,
  setEditingCategory,
  onCreate,
  onUpdate,
  onDelete,
  loading,
}: CategoryFormProps) {
  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }))

  const handleCreateChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setCreateForm({ name: event.target.value })
  }

  const handleEditChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setEditForm({ name: event.target.value })
  }

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>New category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Category name"
            value={createForm.name}
            onChange={handleCreateChange}
          />
          <Button onClick={onCreate} disabled={loading}>
            Create category
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit or remove</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select
            placeholder="Select a category"
            value={editingId}
            options={categoryOptions}
            onChange={(value) => setEditingCategory(value)}
          />
          <Input
            placeholder="Category name"
            value={editForm.name}
            onChange={handleEditChange}
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={onUpdate} disabled={!editingId || loading}>
              Save changes
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={!editingId || loading}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
