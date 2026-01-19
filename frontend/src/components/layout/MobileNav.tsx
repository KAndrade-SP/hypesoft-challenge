"use client"

import Link from "next/link"
import { useKeycloak } from "@react-keycloak/web"
import { LayoutGrid, Package, Tags } from "lucide-react"

import { cn } from "@/lib/utils"
import { getUserRoles, hasAnyRole } from "@/utils/roles"

type MobileNavProps = {
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

export function MobileNav({ active = "dashboard" }: MobileNavProps) {
  const { keycloak } = useKeycloak()
  const roles = getUserRoles(keycloak?.tokenParsed)

  return (
    <nav className="fixed bottom-4 left-1/2 z-30 flex w-[calc(100%-2rem)] -translate-x-1/2 items-center justify-between rounded-3xl border border-border/60 bg-white/90 px-4 py-3 shadow-lg backdrop-blur lg:hidden">
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
                "flex flex-1 flex-col items-center gap-1 text-xs font-medium transition",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-2xl",
                  isActive ? "bg-primary/10" : "bg-transparent"
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              {item.label}
            </Link>
          )
        })}
    </nav>
  )
}
