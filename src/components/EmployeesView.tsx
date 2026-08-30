import { useMemo, useState } from 'react'
import type { Employee } from '../types/workforce'

type EmployeesViewProps = {
  employees: Employee[]
}

export function EmployeesView({ employees }: EmployeesViewProps) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const lower = search.trim().toLowerCase()
    return employees.filter((employee) => {
      const skillMatches = Object.keys(employee.skills).some((skill) => skill.toLowerCase().includes(lower))
      return (
        employee.name.toLowerCase().includes(lower) ||
        String(employee.id).includes(lower) ||
        employee.role.toLowerCase().includes(lower) ||
        skillMatches
      )
    })
  }, [employees, search])

  return (
    <div>
      <div className="panel-header page-section-header">
        <h2>Workforce Directory</h2>
        <span>Manage employee profiles, skills, and performance</span>
      </div>

      <section className="panel">
        <div className="table-toolbar">
          <input
            type="text"
            className="search-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by employee number, name, role, or skill"
          />
          <span className="header-badge">
            Showing: {filtered.length}/{employees.length}
          </span>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Profile</th>
                <th>Primary Task</th>
                <th>Skills</th>
                <th>Productivity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>No employees match “{search.trim()}”.</td>
                </tr>
              ) : (
                filtered.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <strong>{employee.name}</strong>
                      <div className="status-caption">Employee #{employee.id} | {employee.gender ?? 'Unknown'}</div>
                    </td>
                    <td>
                      Age {employee.age ?? '-'} | Exp {employee.experience}y
                    </td>
                    <td>{employee.primaryTask ?? employee.role}</td>
                    <td>
                      <div className="pill-wrap">
                        {Object.entries(employee.skills).map(([skill, level]) => (
                          <span key={skill} className="member-pill">
                            {skill} L{level}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{(employee.avgProductivity ?? employee.performance).toFixed(1)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
