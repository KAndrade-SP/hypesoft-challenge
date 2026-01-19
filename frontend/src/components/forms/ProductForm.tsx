"use client"

import type { ChangeEvent } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { CategoryDto, ProductDto } from "@/types/api"

type ProductFormState = {
  name: string
  description: string
  price: string
  stock: string
  categoryId: string
}

type ProductFormProps = {
  products: ProductDto[]
  categories: CategoryDto[]
  createForm: ProductFormState
  setCreateForm: (state: ProductFormState) => void
  editForm: ProductFormState
  setEditForm: (state: ProductFormState) => void
  editingId: string
  setEditingProduct: (id: string) => void
  onCreate: () => void
  onUpdate: () => void
  onDelete: () => void
  onClearCreate: () => void
  onClearEdit: () => void
  loading: boolean
  canWrite: boolean
  canDelete: boolean
}

export function ProductForm({
  products,
  categories,
  createForm,
  setCreateForm,
  editForm,
  setEditForm,
  editingId,
  setEditingProduct,
  onCreate,
  onUpdate,
  onDelete,
  onClearCreate,
  onClearEdit,
  loading,
  canWrite,
  canDelete,
}: ProductFormProps) {
  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }))

  const productOptions = products.map((product) => ({
    label: product.name,
    value: product.id,
  }))

  const handleCreateChange = (
    field: keyof ProductFormState,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCreateForm({ ...createForm, [field]: event.target.value })
  }

  const handleEditChange = (
    field: keyof ProductFormState,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditForm({ ...editForm, [field]: event.target.value })
  }

  return (
    <section className="relative z-10 grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>New product</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault()
              onCreate()
            }}
          >
            <Select
              placeholder="Category"
              value={createForm.categoryId}
              options={categoryOptions}
              onChange={(value) =>
                setCreateForm({ ...createForm, categoryId: value })
              }
            />
            <Input
              placeholder="Product name"
              value={createForm.name}
              onChange={(event) => handleCreateChange("name", event)}
            />
            <Textarea
              placeholder="Description"
              value={createForm.description}
              onChange={(event) => handleCreateChange("description", event)}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                type="text"
                inputMode="decimal"
                placeholder="Price"
                value={createForm.price}
                onChange={(event) => handleCreateChange("price", event)}
              />
              <Input
                type="number"
                min={0}
                placeholder="Stock"
                value={createForm.stock}
                onChange={(event) => handleCreateChange("stock", event)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={loading || !canWrite}>
                Create product
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
              placeholder="Select a product"
              value={editingId}
              options={productOptions}
              onChange={(value) => setEditingProduct(value)}
            />
            <Select
              placeholder="Category"
              value={editForm.categoryId}
              options={categoryOptions}
              onChange={(value) =>
                setEditForm({ ...editForm, categoryId: value })
              }
            />
            <Input
              placeholder="Product name"
              value={editForm.name}
              onChange={(event) => handleEditChange("name", event)}
            />
            <Textarea
              placeholder="Description"
              value={editForm.description}
              onChange={(event) => handleEditChange("description", event)}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                type="text"
                inputMode="decimal"
                placeholder="Price"
                value={editForm.price}
                onChange={(event) => handleEditChange("price", event)}
              />
              <Input
                type="number"
                min={0}
                placeholder="Stock"
                value={editForm.stock}
                onChange={(event) => handleEditChange("stock", event)}
              />
            </div>
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
