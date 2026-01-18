"use client"

import { CategoryForm } from "@/components/forms/CategoryForm"
import { AppShell } from "@/components/layout/AppShell"
import { Topbar } from "@/components/layout/Topbar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCategories } from "@/hooks/useCategories"

export default function CategoriesPage() {
  const {
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
  } = useCategories()

  return (
    <AppShell active="categories">
      <Topbar
        title="Categories"
        subtitle="Organize the catalog and keep consistency."
      />

      {error ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <CategoryForm
        categories={categories}
        createForm={createForm}
        setCreateForm={setCreateForm}
        editForm={editForm}
        setEditForm={setEditForm}
        editingId={editingId}
        setEditingCategory={setEditingCategory}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        loading={loading}
      />

      <Card>
        <CardHeader>
          <CardTitle>Registered categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between rounded-2xl border border-border/60 bg-white/70 px-3 py-2 text-sm"
            >
              <span className="font-medium">{category.name}</span>
              <Badge variant="outline">{category.id.slice(0, 6)}</Badge>
            </div>
          ))}
          {categories.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No categories registered.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </AppShell>
  )
}
