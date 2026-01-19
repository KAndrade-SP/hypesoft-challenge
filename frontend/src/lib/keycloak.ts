"use client"

import Keycloak from "keycloak-js"

const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? "http://localhost:8080"
const keycloakRealm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? "hypesoft"
const keycloakClientId =
  process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? "hypesoft-web"

const keycloak = new Keycloak({
  url: keycloakUrl,
  realm: keycloakRealm,
  clientId: keycloakClientId,
})

export default keycloak
