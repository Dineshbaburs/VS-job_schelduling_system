type HeaderBarProps = {
  dataSource: string
  onReset: () => void
}

export function HeaderBar({ dataSource, onReset }: HeaderBarProps) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Dataset-driven workforce planner</p>
        <h1>Smart Workforce Scheduling & Allocation System</h1>
      </div>
      <div className="header-actions">
        <div className="header-badge">{dataSource}</div>
        <button type="button" className="reset-button" onClick={onReset}>
          Upload new CSV
        </button>
      </div>
    </header>
  )
}
