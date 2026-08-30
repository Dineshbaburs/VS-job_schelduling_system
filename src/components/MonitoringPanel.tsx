import type { Allocation } from '../types/workforce'

type MonitoringPanelProps = {
  allocations: Allocation[]
  progressMap: Record<string, number>
  onProgressChange: (taskId: string, progress: number) => void
}

const getTrackingStatus = (progress: number) => {
  if (progress >= 85) return 'On Track'
  if (progress >= 50) return 'In Progress'
  return 'Delayed'
}

export function MonitoringPanel({ allocations, progressMap, onProgressChange }: MonitoringPanelProps) {
  return (
    <section className="panel monitor-panel">
      <div className="panel-header">
        <h2>Monitoring and Tracking</h2>
        <span>Execution progress by task</span>
      </div>

      <div className="monitor-list">
        {allocations.map((allocation) => {
          const progress = progressMap[allocation.task.id] ?? 0
          const status = getTrackingStatus(progress)

          return (
            <article key={allocation.task.id} className="monitor-item">
              <div className="monitor-top">
                <strong>{allocation.task.name}</strong>
                <span className="monitor-status">{status}</span>
              </div>

              <div className="monitor-meta">
                <span>{allocation.assigned.length} assigned</span>
                <span>{allocation.coverage}</span>
              </div>

              <div className="progress-row">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(event) => onProgressChange(allocation.task.id, Number(event.target.value))}
                  aria-label={`Progress for ${allocation.task.name}`}
                />
                <span>{progress}%</span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
