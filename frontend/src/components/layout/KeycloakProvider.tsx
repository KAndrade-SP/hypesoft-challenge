"use client"

import type { ReactNode } from "react"
import { ReactKeycloakProvider } from "@react-keycloak/web"

import keycloak from "@/lib/keycloak"
import { setAuthToken } from "@/services/auth"

type KeycloakProviderProps = {
  children: ReactNode
}

export function KeycloakProvider({ children }: KeycloakProviderProps) {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: "check-sso",
        pkceMethod: "S256",
      }}
      onEvent={(event) => {
        if (event === "onAuthSuccess" || event === "onAuthRefreshSuccess") {
          setAuthToken(keycloak.token ?? null)
        }
        if (event === "onAuthLogout") {
          setAuthToken(null)
        }
      }}
      onTokens={(tokens) => {
        setAuthToken(tokens?.token ?? null)
      }}
    >
      {children}
    </ReactKeycloakProvider>
  )
}
