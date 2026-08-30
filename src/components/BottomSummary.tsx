import type { DashboardMetrics } from '../types/workforce'

type BottomSummaryProps = {
  metrics: DashboardMetrics
}

export function BottomSummary({ metrics }: BottomSummaryProps) {
  return (
    <section className="bottom-grid">
      <div className="panel summary-panel">
        <div className="panel-header">
          <h2>Daily manpower summary</h2>
          <span>Hours vs. availability</span>
        </div>

        <div className="metric-stack">
          <div className="metric-row">
            <span>Available manpower</span>
            <strong>{metrics.presentCount}</strong>
          </div>
          <div className="metric-row">
            <span>Required manpower</span>
            <strong>{metrics.totalRequiredPeople}</strong>
          </div>
          <div className="metric-row">
            <span>Available hours</span>
            <strong>{metrics.totalAvailableHours}</strong>
          </div>
          <div className="metric-row">
            <span>Allocated hours</span>
            <strong>{metrics.totalDemandHours}</strong>
          </div>
        </div>
      </div>

      <div className="panel report-panel">
        <div className="panel-header">
          <h2>Scheduling notes</h2>
          <span>Business logic</span>
        </div>

        <ul className="notes-list">
          <li>Priority scheduling places critical jobs before medium and low tasks.</li>
          <li>Skill matching considers proficiency, experience, performance, and previous work.</li>
          <li>Balanced team selection avoids overloading a few senior staff members.</li>
          <li>Attendance is enforced before any allocation is made.</li>
        </ul>
      </div>
    </section>
  )
}
