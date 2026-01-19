"use client"

import type { ReactNode } from "react"
import { useKeycloak } from "@react-keycloak/web"

import { Button } from "@/components/ui/button"
import { setAuthToken } from "@/services/auth"
import { getUserRoles, hasAnyRole } from "@/utils/roles"

type AuthGuardProps = {
  children: ReactNode
  allowedRoles?: readonly string[]
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { keycloak, initialized } = useKeycloak()
  const roles = getUserRoles(keycloak?.tokenParsed)

  if (!initialized) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading session...</p>
      </div>
    )
  }

  if (!keycloak?.authenticated) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-2xl border border-border/60 bg-white/70 p-6 text-center shadow-lg">
          <p className="text-sm text-muted-foreground">
            You need to sign in to continue.
          </p>
          <Button className="mt-4" onClick={() => keycloak?.login()}>
            Login with Keycloak
          </Button>
        </div>
      </div>
    )
  }

  if (keycloak?.token) {
    setAuthToken(keycloak.token)
  }

  if (allowedRoles && !hasAnyRole(roles, allowedRoles)) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-2xl border border-border/60 bg-white/70 p-6 text-center shadow-lg">
          <p className="text-sm text-muted-foreground">
            You are not authorized to access this page.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
