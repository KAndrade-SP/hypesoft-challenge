import { useCallback, useEffect, useState } from "react"
import { useKeycloak } from "@react-keycloak/web"

import { getDashboardSummary } from "@/services/dashboard"
import type { DashboardSummaryDto } from "@/types/api"
import { getErrorMessage } from "@/utils/errors"

export function useDashboard() {
  const { keycloak, initialized } = useKeycloak()
  const [data, setData] = useState<DashboardSummaryDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!initialized || !keycloak?.authenticated) {
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const summary = await getDashboardSummary()
      setData(summary)
    } catch (error) {
      setError(getErrorMessage(error, "Unable to load dashboard."))
    } finally {
      setLoading(false)
    }
  }, [initialized, keycloak])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { data, loading, error, refresh }
}
