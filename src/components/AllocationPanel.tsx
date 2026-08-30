import type { Allocation } from '../types/workforce'

type AllocationPanelProps = {
  allocations: Allocation[]
}

export function AllocationPanel({ allocations }: AllocationPanelProps) {
  return (
    <section className="panel allocation-panel">
      <div className="panel-header">
        <h2>Allocation result</h2>
        <span>Best team selection by skill, experience, and priority</span>
      </div>

      <div className="allocation-table-wrap">
        <table className="allocation-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Priority</th>
              <th>Assigned team</th>
              <th>Hours</th>
              <th>Coverage</th>
              <th>Utilization</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((item) => (
              <tr key={item.task.id}>
                <td>
                  <div className="task-name-cell">
                    <strong>{item.task.name}</strong>
                    <small>{item.task.dueIn}</small>
                  </div>
                </td>
                <td>
                  <span className={`priority badge-${item.task.priority.toLowerCase()}`}>
                    {item.task.priority}
                  </span>
                </td>
                <td>
                  <div className="assigned-list">
                    {item.assigned.length > 0 ? (
                      item.assigned.map((employee) => (
                        <span key={`${item.task.id}-${employee.id}`} className="member-pill">
                          {employee.name}
                        </span>
                      ))
                    ) : (
                      <span className="status-muted">No team available</span>
                    )}
                  </div>
                </td>
                <td>{item.totalHours} hrs</td>
                <td>
                  <span className={item.coverage === 'Covered' ? 'status ok' : 'status warn'}>
                    {item.coverage}
                  </span>
                </td>
                <td>{item.utilization.toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
