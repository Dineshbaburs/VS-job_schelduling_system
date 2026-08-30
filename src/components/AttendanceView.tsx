import type { Employee } from '../types/workforce'

type AttendanceViewProps = {
  employees: Employee[]
  attendanceMap: Record<number, boolean>
  onToggleAttendance: (id: number) => void
}

export function AttendanceView({ employees, attendanceMap, onToggleAttendance }: AttendanceViewProps) {
  const presentCount = employees.filter((employee) => attendanceMap[employee.id] !== false).length

  return (
    <div>
      <div className="panel-header page-section-header">
        <h2>Daily Attendance</h2>
        <span>Mark employee availability for this shift</span>
      </div>

      <section className="kpis compact-kpis">
        <article className="card stat-card success">
          <span>Present</span>
          <strong>{presentCount}</strong>
        </article>
        <article className="card stat-card">
          <span>Absent</span>
          <strong>{employees.length - presentCount}</strong>
        </article>
      </section>

      <section className="panel">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Role</th>
                <th>Status</th>
                <th>Toggle</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => {
                const isPresent = attendanceMap[employee.id] !== false
                return (
                  <tr key={employee.id}>
                    <td>{employee.name}</td>
                    <td>{employee.role}</td>
                    <td>
                      <span className={isPresent ? 'status ok' : 'status warn'}>
                        {isPresent ? 'Present' : 'Absent'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={isPresent ? 'toggle on' : 'toggle off'}
                        onClick={() => onToggleAttendance(employee.id)}
                      >
                        {isPresent ? 'Set Absent' : 'Set Present'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
