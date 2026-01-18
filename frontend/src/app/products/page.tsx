"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { ProductForm } from "@/components/forms/ProductForm"
import { AppShell } from "@/components/layout/AppShell"
import { Topbar } from "@/components/layout/Topbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { useProducts } from "@/hooks/useProducts"
import { currencyFormatter } from "@/utils/format"

export default function ProductsPage() {
  const {
    products,
    categories,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    loading,
    error,
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
  } = useProducts()

  const categoryOptions = [
    { label: "All categories", value: "all" },
    ...categories.map((category) => ({
      label: category.name,
      value: category.id,
    })),
  ]

  const [stockEdits, setStockEdits] = useState<Record<string, string>>({})

  const handleStockChange = (id: string, value: string) => {
    setStockEdits((prev) => ({ ...prev, [id]: value }))
  }

  const handleStockSave = (id: string, current: number) => {
    const rawValue = stockEdits[id]
    const nextValue = rawValue === undefined ? current : Number(rawValue)
    if (!Number.isNaN(nextValue) && nextValue >= 0) {
      handleStockUpdate(id, nextValue)
    }
  }

  return (
    <AppShell active="products">
      <Topbar
        title="Products"
        subtitle="Manage catalog details and inventory."
        searchSlot={
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
            />
          </div>
        }
      />

      {error ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <ProductForm
        products={products}
        categories={categories}
        createForm={createForm}
        setCreateForm={setCreateForm}
        editForm={editForm}
        setEditForm={setEditForm}
        editingId={editingId}
        setEditingProduct={setEditingProduct}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        loading={loading}
      />

      <section className="relative z-0 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Product list</h2>
            <p className="text-xs text-muted-foreground">
              Update stock quickly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={categoryFilter}
              options={categoryOptions}
              onChange={setCategoryFilter}
              className="w-60"
            />
          </div>
        </div>

        <Card>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="py-3">Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {products.map((product) => (
                  <tr key={product.id} className="text-sm">
                    <td className="py-4">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {product.description}
                      </div>
                    </td>
                    <td>
                      <Badge variant="outline">{product.categoryName}</Badge>
                    </td>
                    <td>{currencyFormatter.format(product.price)}</td>
                    <td>
                      <Badge
                        variant={product.stockQuantity < 10 ? "warning" : "success"}
                      >
                            {product.stockQuantity} units
                          </Badge>
                        </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          value={
                            stockEdits[product.id] ??
                            String(product.stockQuantity)
                          }
                          onChange={(event) =>
                            handleStockChange(product.id, event.target.value)
                          }
                          className="h-9 w-20"
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStockSave(product.id, product.stockQuantity)
                          }
                          disabled={loading}
                        >
                          Save
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && !loading ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No products found.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  )
}
