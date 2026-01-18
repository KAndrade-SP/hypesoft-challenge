import { apiGet } from "@/services/api"
import type { DashboardSummaryDto } from "@/types/api"

export async function getDashboardSummary() {
  return apiGet<DashboardSummaryDto>("/api/dashboard")
}
