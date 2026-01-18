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
  loading: boolean
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
  loading,
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
        <CardContent className="space-y-3">
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
          <Select
            placeholder="Category"
            value={createForm.categoryId}
            options={categoryOptions}
            onChange={(value) =>
              setCreateForm({ ...createForm, categoryId: value })
            }
          />
          <Button onClick={onCreate} disabled={loading}>
            Create product
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit or remove</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select
            placeholder="Select a product"
            value={editingId}
            options={productOptions}
            onChange={(value) => setEditingProduct(value)}
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
          <Select
            placeholder="Category"
            value={editForm.categoryId}
            options={categoryOptions}
            onChange={(value) => setEditForm({ ...editForm, categoryId: value })}
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
