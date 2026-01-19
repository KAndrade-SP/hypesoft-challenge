"use client"

import Link from "next/link"
import { useKeycloak } from "@react-keycloak/web"
import { LayoutGrid, Package, Tags } from "lucide-react"

import { cn } from "@/lib/utils"
import { getUserRoles, hasAnyRole } from "@/utils/roles"

type SidebarProps = {
  active?: "dashboard" | "products" | "categories"
}

const navItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: LayoutGrid,
    roles: ["admin", "manager", "user"],
  },
  {
    key: "products",
    label: "Products",
    href: "/products",
    icon: Package,
    roles: ["admin", "manager"],
  },
  {
    key: "categories",
    label: "Categories",
    href: "/categories",
    icon: Tags,
    roles: ["admin", "manager"],
  },
] as const

export function Sidebar({ active = "dashboard" }: SidebarProps) {
  const { keycloak } = useKeycloak()
  const roles = getUserRoles(keycloak?.tokenParsed)

  return (
    <aside className="hidden w-60 flex-col gap-8 rounded-3xl bg-white/70 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.3)] backdrop-blur lg:flex">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <LayoutGrid className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold">Hypesoft</p>
          <p className="text-xs text-muted-foreground">Inventory Suite</p>
        </div>
      </div>
      <nav className="space-y-2 text-sm">
        {navItems
          .filter((item) => hasAnyRole(roles, item.roles))
          .map((item) => {
            const isActive = item.key === active
            const Icon = item.icon
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-2xl px-4 py-3 font-medium transition",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
      </nav>
    </aside>
  )
}
