import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"

import type { CategoryCountDto } from "@/types/api"

type ProductsByCategoryChartProps = {
  data: CategoryCountDto[]
}

export function ProductsByCategoryChart({ data }: ProductsByCategoryChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ left: 12, right: 12 }}>
        <XAxis dataKey="categoryName" tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ fill: "rgba(15, 23, 42, 0.05)" }}
          contentStyle={{
            borderRadius: "12px",
            borderColor: "rgba(148, 163, 184, 0.4)",
            fontSize: "12px",
          }}
          formatter={(value, name) =>
            name === "productCount" ? [value, "Product Count"] : [value, name]
          }
        />
        <Bar dataKey="productCount" radius={[8, 8, 0, 0]} fill="hsl(var(--chart-1))" />
      </BarChart>
    </ResponsiveContainer>
  )
}
