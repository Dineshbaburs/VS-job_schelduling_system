import type { Allocation, DashboardMetrics } from '../types/workforce'

type ReportsViewProps = {
  allocations: Allocation[]
  metrics: DashboardMetrics
}

export function ReportsView({ allocations, metrics }: ReportsViewProps) {
  return (
    <div>
      <div className="panel-header page-section-header">
        <h2>Reports</h2>
        <span>Daily summary and allocation analytics</span>
      </div>

      <section className="kpis compact-kpis">
        <article className="card stat-card">
          <span>Workforce Utilized</span>
          <strong>{metrics.presentCount}</strong>
        </article>
        <article className="card stat-card success">
          <span>Capacity Utilization</span>
          <strong>{metrics.capacityUtilization.toFixed(0)}%</strong>
        </article>
        <article className="card stat-card accent">
          <span>Total Demand Hours</span>
          <strong>{metrics.totalDemandHours}</strong>
        </article>
      </section>

      <section className="panel">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Priority</th>
                <th>Coverage</th>
                <th>Assigned</th>
                <th>Shortage</th>
                <th>Utilization</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((item) => (
                <tr key={item.task.id}>
                  <td>{item.task.name}</td>
                  <td>{item.task.priority}</td>
                  <td>{item.coverage}</td>
                  <td>{item.assigned.length}</td>
                  <td>{item.shortage}</td>
                  <td>{item.utilization.toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
