"use client"

import { ProductsByCategoryChart } from "@/components/charts/ProductsByCategoryChart"
import { AppShell } from "@/components/layout/AppShell"
import { Topbar } from "@/components/layout/Topbar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboard } from "@/hooks/useDashboard"
import { currencyFormatter } from "@/utils/format"

export default function DashboardPage() {
  const { data } = useDashboard()
  const lowStock = data?.lowStockProducts ?? []

  return (
    <AppShell active="dashboard">
      <Topbar
        title="Dashboard"
        subtitle="Overview of stock and products."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total products</CardTitle>
            <Badge variant="outline">Current</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {data?.totalProducts ?? "--"}
            </div>
            <p className="text-xs text-muted-foreground">
              Active items in the catalog.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inventory value</CardTitle>
            <Badge variant="success">BRL</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {data ? currencyFormatter.format(data.totalStockValue) : "--"}
            </div>
            <p className="text-xs text-muted-foreground">
              Price multiplied by quantity.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low stock</CardTitle>
            <Badge variant="warning">Alert</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{lowStock.length}</div>
            <p className="text-xs text-muted-foreground">
              Products below 10 units.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="min-h-[320px]">
          <CardHeader>
            <div>
              <CardTitle>Products by category</CardTitle>
              <p className="text-xs text-muted-foreground">
                Catalog distribution.
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex h-[250px] items-center justify-center">
            <ProductsByCategoryChart data={data?.productsByCategory ?? []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Low stock</CardTitle>
              <p className="text-xs text-muted-foreground">
                Needs replenishment.
              </p>
            </div>
            <Badge variant="warning">{lowStock.length}</Badge>
          </CardHeader>
          <CardContent className="max-h-64 space-y-3 overflow-auto pr-1">
            {lowStock.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-border/60 bg-white/70 px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.categoryName}
                  </p>
                </div>
                <Badge variant="warning">{item.stockQuantity} units</Badge>
              </div>
            ))}
            {lowStock.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No items below minimum.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  )
}
