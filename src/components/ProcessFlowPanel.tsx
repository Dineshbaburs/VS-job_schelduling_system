const processSteps = [
  'Attendance Entry',
  'Employee Skill Matrix',
  'Available Human Resources',
  'Daily Task Details',
  'Requirement Analysis',
  'Scheduling and Allocation Engine',
  'Team Formation and Assignment',
  'Monitoring and Tracking',
  'Reports and Dashboard',
  'Feedback and Continuous Improvement',
]

export function ProcessFlowPanel() {
  return (
    <section className="panel process-panel">
      <div className="panel-header">
        <h2>Process Flow Structure</h2>
        <span>End-to-end scheduling lifecycle</span>
      </div>

      <div className="process-list">
        {processSteps.map((step, index) => (
          <div key={step} className="process-step">
            <div className="step-index">{index + 1}</div>
            <div className="step-name">{step}</div>
            {index < processSteps.length - 1 ? <div className="step-arrow">Down</div> : null}
          </div>
        ))}
      </div>

      <div className="feedback-loop-note">
        Feedback updates employee skill and performance information for future scheduling cycles.
      </div>
    </section>
  )
}
