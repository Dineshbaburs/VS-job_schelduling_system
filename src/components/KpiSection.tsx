import type { DashboardMetrics } from '../types/workforce'

type KpiSectionProps = {
  metrics: DashboardMetrics
}

export function KpiSection({ metrics }: KpiSectionProps) {
  return (
    <section className="kpis">
      <article className="card stat-card">
        <span>Total present</span>
        <strong>{metrics.presentCount}</strong>
        <small>Employees available</small>
      </article>
      <article className="card stat-card accent">
        <span>Priority load</span>
        <strong>{metrics.totalPriorityWeight}</strong>
        <small>Weighted schedule pressure</small>
      </article>
      <article className="card stat-card">
        <span>Demand hours</span>
        <strong>{metrics.totalDemandHours}</strong>
        <small>Required shift hours</small>
      </article>
      <article className="card stat-card success">
        <span>Capacity used</span>
        <strong>{metrics.capacityUtilization.toFixed(0)}%</strong>
        <small>of available capacity</small>
      </article>
    </section>
  )
}
