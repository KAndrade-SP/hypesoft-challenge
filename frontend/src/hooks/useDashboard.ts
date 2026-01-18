import { useCallback, useEffect, useState } from "react"

import { getDashboardSummary } from "@/services/dashboard"
import type { DashboardSummaryDto } from "@/types/api"
import { getErrorMessage } from "@/utils/errors"

export function useDashboard() {
  const [data, setData] = useState<DashboardSummaryDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {

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
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { data, loading, error, refresh }
}
