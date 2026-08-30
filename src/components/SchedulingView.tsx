import type { Allocation } from '../types/workforce'

type SchedulingViewProps = {
  allocations: Allocation[]
  hasRun: boolean
  onRun: () => void
}

export function SchedulingView({ allocations, hasRun, onRun }: SchedulingViewProps) {
  const onTrackCount = allocations.filter((item) => item.coverage === 'Covered').length
  const totalTarget = allocations.reduce((sum, item) => sum + item.task.targetUnits, 0)
  const estimated = allocations.reduce((sum, item) => {
    const productivity = item.assigned.reduce((memberSum, member) => memberSum + member.performance, 0)
    return sum + Math.round((productivity / (item.assigned.length || 1)) * item.task.durationHours)
  }, 0)
  const overallPercent = totalTarget > 0 ? Math.round((estimated / totalTarget) * 100) : 0

  return (
    <div>
      <div className="panel-header page-section-header">
        <h2>Scheduling Engine</h2>
        <span>Rule-based workforce allocation with priority and skill matching</span>
      </div>

      {!hasRun ? (
        <section className="panel empty-run-state">
          <h3>Ready to generate today schedule</h3>
          <p>Run scheduler to assign teams using skills, productivity, and priority targets.</p>
          <button type="button" className="reset-button" onClick={onRun}>
            Run Scheduler
          </button>
        </section>
      ) : (
        <>
          <section className="kpis compact-kpis">
            <article className="card stat-card accent">
              <span>Overall Target</span>
              <strong>{overallPercent}%</strong>
            </article>
            <article className="card stat-card success">
              <span>Tasks On Track</span>
              <strong>
                {onTrackCount}/{allocations.length}
              </strong>
            </article>
          </section>

          <section className="card-grid">
            {allocations.map((item) => (
              <article key={item.task.id} className="panel alloc-card">
                <div className="panel-header">
                  <h2>{item.task.name}</h2>
                  <span className={item.coverage === 'Covered' ? 'status ok' : 'status warn'}>
                    {item.coverage}
                  </span>
                </div>

                <div className="assigned-list">
                  {item.assigned.map((employee) => (
                    <span key={`${item.task.id}-${employee.id}`} className="member-pill">
                      {employee.name}
                    </span>
                  ))}
                </div>

                <div className="alloc-stats">
                  <span>People: {item.assigned.length}/{item.task.requiredPeople}</span>
                  <span>Hours: {item.totalHours}</span>
                  <span>Target: {item.task.targetUnits}</span>
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </div>
  )
}
