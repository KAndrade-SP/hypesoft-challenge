let authToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
  if (typeof window === "undefined") {
    return
  }
  if (token) {
    window.localStorage.setItem("auth_token", token)
  } else {
    window.localStorage.removeItem("auth_token")
  }
}

export function getAuthToken() {
  if (authToken) {
    return authToken
  }
  if (typeof window === "undefined") {
    return null
  }
  const stored = window.localStorage.getItem("auth_token")
  return stored || null
}
