"use client"

import { useKeycloak } from "@react-keycloak/web"

import { CategoryForm } from "@/components/forms/CategoryForm"
import { AppShell } from "@/components/layout/AppShell"
import { Topbar } from "@/components/layout/Topbar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCategories } from "@/hooks/useCategories"
import { getUserRoles, hasAnyRole } from "@/utils/roles"

export default function CategoriesPage() {
  const { keycloak } = useKeycloak()
  const roles = getUserRoles(keycloak?.tokenParsed)
  const canWrite = hasAnyRole(roles, ["admin", "manager"])
  const canDelete = hasAnyRole(roles, ["admin"])
  const {
    categories,
    loading,
    createForm,
    setCreateForm,
    editForm,
    setEditForm,
    editingId,
    setEditingCategory,
    handleCreate,
    handleUpdate,
    handleDelete,
    clearCreateForm,
    clearEditForm,
  } = useCategories()

  return (
    <AppShell active="categories">
      <Topbar
        title="Categories"
        subtitle="Organize the catalog and keep consistency."
      />


      <section className="relative z-10">
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
          canWrite={canWrite}
          canDelete={canDelete}
          onClearCreate={clearCreateForm}
          onClearEdit={clearEditForm}
        />
      </section>

      <section className="relative z-0">
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
      </section>
    </AppShell>
  )
}
