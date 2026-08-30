import { useMemo, useState } from 'react'
import type { Employee } from '../types/workforce'

type FeedbackPayload = {
  employeeId: number
  skillName: string
  skillDelta: number
  performanceDelta: number
  note: string
}

type FeedbackPanelProps = {
  employees: Employee[]
  onApplyFeedback: (payload: FeedbackPayload) => void
}

export function FeedbackPanel({ employees, onApplyFeedback }: FeedbackPanelProps) {
  const [employeeId, setEmployeeId] = useState<number>(employees[0]?.id ?? 0)
  const [skillName, setSkillName] = useState('Planning')
  const [skillDelta, setSkillDelta] = useState(1)
  const [performanceDelta, setPerformanceDelta] = useState(2)
  const [note, setNote] = useState('')
  const [lastUpdate, setLastUpdate] = useState('')

  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.id === employeeId),
    [employees, employeeId],
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!employeeId) return

    onApplyFeedback({
      employeeId,
      skillName: skillName.trim() || 'Planning',
      skillDelta,
      performanceDelta,
      note,
    })

    setLastUpdate('Feedback applied to scheduling inputs')
    setNote('')
  }

  return (
    <section className="panel feedback-panel">
      <div className="panel-header">
        <h2>Feedback and Continuous Improvement</h2>
        <span>Update future scheduling quality</span>
      </div>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <label>
          Employee
          <select value={employeeId} onChange={(event) => setEmployeeId(Number(event.target.value))}>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Skill to update
          <input
            type="text"
            value={skillName}
            onChange={(event) => setSkillName(event.target.value)}
            placeholder="Cutting"
          />
        </label>

        <label>
          Skill delta
          <input
            type="number"
            min={-2}
            max={2}
            value={skillDelta}
            onChange={(event) => setSkillDelta(Number(event.target.value))}
          />
        </label>

        <label>
          Performance delta
          <input
            type="number"
            min={-10}
            max={10}
            value={performanceDelta}
            onChange={(event) => setPerformanceDelta(Number(event.target.value))}
          />
        </label>

        <label>
          Feedback note
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Observed output quality improved in evening shift"
            rows={3}
          />
        </label>

        <button type="submit">Apply Feedback Loop</button>
      </form>

      <div className="feedback-meta">
        <span>
          Current target: {selectedEmployee ? `${selectedEmployee.name} (${selectedEmployee.role})` : 'Not selected'}
        </span>
        {lastUpdate ? <strong>{lastUpdate}</strong> : null}
      </div>
    </section>
  )
}

export type { FeedbackPayload }
