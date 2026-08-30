export type AppView =
  | 'dashboard'
  | 'attendance'
  | 'employees'
  | 'tasks'
  | 'scheduling'
  | 'monitoring'
  | 'reports'
  | 'settings'

type SidebarNavProps = {
  currentView: AppView
  onChangeView: (view: AppView) => void
}

const navItems: Array<{ label: string; section?: string; view?: AppView; icon?: string }> = [
  { label: 'Overview', section: 'MAIN' },
  { view: 'dashboard', icon: '📊', label: 'Dashboard' },
  { label: 'WORKFORCE', section: 'WORKFORCE' },
  { view: 'attendance', icon: '✅', label: 'Attendance' },
  { view: 'employees', icon: '👥', label: 'Employees and Skills' },
  { label: 'OPERATIONS', section: 'OPERATIONS' },
  { view: 'tasks', icon: '📋', label: 'Daily Tasks' },
  { view: 'scheduling', icon: '⚙️', label: 'Scheduling Engine' },
  { view: 'monitoring', icon: '📈', label: 'Monitoring' },
]

export function SidebarNav({ currentView, onChangeView }: SidebarNavProps) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <aside className="left-sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🏭</div>
        <div className="logo-title">Smart Workforce Scheduler</div>
        <div className="logo-subtitle">AI-Powered Allocation System</div>
      </div>

      <nav className="sidebar-nav-list">
        {navItems.map((item) => {
          if (item.section) {
            return (
              <div key={item.section} className="nav-section-label">
                {item.label}
              </div>
            )
          }

          const isActive = currentView === item.view
          return (
            <button
              key={item.view}
              type="button"
              className={isActive ? 'nav-item active' : 'nav-item'}
              onClick={() => onChangeView(item.view as AppView)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="current-date-card">
          <div className="date-label">Today</div>
          <div className="date-value">{dateStr}</div>
          <div className="date-label">{timeStr}</div>
        </div>
      </div>
    </aside>
  )
}
