import type { Employee } from '../types/workforce'

type AttendancePanelProps = {
  employees: Employee[]
  attendanceMap: Record<number, boolean>
  onToggleAttendance: (id: number) => void
}

export function AttendancePanel({ employees, attendanceMap, onToggleAttendance }: AttendancePanelProps) {
  return (
    <section className="panel attendance-panel">
      <div className="panel-header">
        <h2>Attendance and staffing</h2>
        <span>Daily workforce input</span>
      </div>

      <div className="employee-list">
        {employees.map((employee) => (
          <div key={employee.id} className="employee-row">
            <div>
              <strong>{employee.name}</strong>
              <small>{employee.role}</small>
            </div>
            <div className="employee-meta">
              <span>{employee.performance}% performance</span>
              <button
                type="button"
                className={attendanceMap[employee.id] === false ? 'toggle off' : 'toggle on'}
                onClick={() => onToggleAttendance(employee.id)}
                aria-label={`Toggle attendance for ${employee.name}`}
              >
                {attendanceMap[employee.id] === false ? 'Absent' : 'Present'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
