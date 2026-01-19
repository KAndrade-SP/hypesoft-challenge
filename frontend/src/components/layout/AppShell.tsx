"use client"

import type { ReactNode } from "react"

import { AuthGuard } from "@/components/layout/AuthGuard"
import { MobileNav } from "@/components/layout/MobileNav"
import { Sidebar } from "@/components/layout/Sidebar"

const roleMap = {
  dashboard: ["admin", "manager", "user"],
  products: ["admin", "manager"],
  categories: ["admin", "manager"],
} as const

type AppShellProps = {
  active?: "dashboard" | "products" | "categories"
  children: ReactNode
}

export function AppShell({ active, children }: AppShellProps) {
  const allowedRoles = active ? roleMap[active] : undefined

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.35),_transparent_55%),radial-gradient(circle_at_20%_20%,_rgba(125,211,252,0.35),_transparent_45%)]">
      <div className="flex min-h-screen items-center justify-center px-4 py-8 lg:px-6">
        <AuthGuard allowedRoles={allowedRoles}>
          <div className="flex w-full max-w-[1400px] items-start gap-6 lg:h-[min(900px,calc(100vh-6rem))]">
            <Sidebar active={active} />
            <div className="min-w-0 flex-1 min-h-0 flex flex-col">
              <main className="flex-1 min-h-0 space-y-6 overflow-y-auto pb-24 pr-2 lg:pb-8">
                {children}
              </main>
            </div>
          </div>
        </AuthGuard>
      </div>
      <MobileNav active={active} />
    </div>
  )
}
