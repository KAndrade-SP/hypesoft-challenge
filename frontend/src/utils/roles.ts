type TokenParsed = {
  roles?: string[]
  realm_access?: { roles?: string[] }
}

export function getUserRoles(tokenParsed?: TokenParsed | null) {
  if (!tokenParsed) {
    return [] as string[]
  }
  const direct = Array.isArray(tokenParsed.roles) ? tokenParsed.roles : []
  const realm = Array.isArray(tokenParsed.realm_access?.roles)
    ? tokenParsed.realm_access?.roles
    : []
  return Array.from(new Set([...direct, ...realm]))
}

export function hasAnyRole(userRoles: string[], required?: readonly string[]) {
  if (!required || required.length === 0) {
    return true
  }
  return required.some((role) => userRoles.includes(role))
}
