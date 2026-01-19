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
  onClearCreate: () => void
  onClearEdit: () => void
  loading: boolean
  canWrite: boolean
  canDelete: boolean
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
  onClearCreate,
  onClearEdit,
  loading,
  canWrite,
  canDelete,
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
        <CardContent>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault()
              onCreate()
            }}
          >
            <Input
              placeholder="Category name"
              value={createForm.name}
              onChange={handleCreateChange}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={loading || !canWrite}>
                Create category
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onClearCreate}
              >
                Clear form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit or remove</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault()
              onUpdate()
            }}
          >
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
              <Button
                type="submit"
                disabled={!editingId || loading || !canWrite}
              >
                Save changes
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onClearEdit}
              >
                Clear form
              </Button>
              {canDelete ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onDelete}
                  disabled={!editingId || loading}
                >
                  Delete
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
