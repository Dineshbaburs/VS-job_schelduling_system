import type { Task } from '../types/workforce'

type TaskPanelProps = {
  tasks: Task[]
}

export function TaskPanel({ tasks }: TaskPanelProps) {
  return (
    <section className="panel task-panel">
      <div className="panel-header">
        <h2>Daily tasks</h2>
        <span>Priority-based demand</span>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <article key={task.id} className="task-item">
            <div className="task-topline">
              <span className={`priority badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
              <strong>{task.name}</strong>
            </div>
            <p>{task.description}</p>
            <div className="task-metrics">
              <span>{task.requiredPeople} people</span>
              <span>{task.durationHours} hrs</span>
              <span>{task.targetUnits} target</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
