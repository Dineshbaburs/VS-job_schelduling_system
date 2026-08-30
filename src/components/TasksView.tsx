import type { Task } from '../types/workforce'

type TasksViewProps = {
  tasks: Task[]
  onCyclePriority: (id: string) => void
}

export function TasksView({ tasks, onCyclePriority }: TasksViewProps) {
  return (
    <div>
      <div className="panel-header page-section-header">
        <h2>Daily Tasks</h2>
        <span>Configure production priorities and task demand</span>
      </div>

      <section className="panel">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>People</th>
                <th>Target</th>
                <th>Duration</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <strong>{task.name}</strong>
                    <div className="status-caption">{task.dueIn}</div>
                  </td>
                  <td>{task.requiredPeople}</td>
                  <td>{task.targetUnits}</td>
                  <td>{task.durationHours}h</td>
                  <td>
                    <button
                      type="button"
                      className={`priority badge-${task.priority.toLowerCase()} priority-toggle`}
                      onClick={() => onCyclePriority(task.id)}
                    >
                      {task.priority}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
