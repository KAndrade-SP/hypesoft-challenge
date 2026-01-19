"use client"

import type { ReactNode } from "react"
import { useKeycloak } from "@react-keycloak/web"

import { Button } from "@/components/ui/button"

type TopbarProps = {
  title: string
  subtitle?: string
  searchSlot?: ReactNode
  actionsSlot?: ReactNode
}

export function Topbar({ title, subtitle, searchSlot, actionsSlot }: TopbarProps) {
  const { keycloak } = useKeycloak()
  const userName =
    (keycloak?.tokenParsed?.preferred_username as string | undefined) ??
    (keycloak?.tokenParsed?.name as string | undefined) ??
    "User"

  return (
    <header className="flex flex-col gap-4 rounded-3xl bg-white/70 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-end">
        {searchSlot}
        <div className="flex items-center gap-2">
          {actionsSlot}
          {keycloak?.authenticated ? (
            <>
              <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-white px-3 py-2 text-sm">
                <span className="h-7 w-7 rounded-full bg-slate-200" />
                <span className="font-medium">{userName}</span>
              </div>
              <Button variant="secondary" size="sm" onClick={() => keycloak.logout()}>
                Logout
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => keycloak?.login()}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
