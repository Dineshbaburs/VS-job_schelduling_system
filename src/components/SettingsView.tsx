type AppSettings = {
  companyName: string
  shiftHours: number
  perDayTarget: number
}

type SettingsViewProps = {
  settings: AppSettings
  onChange: (settings: AppSettings) => void
}

export function SettingsView({ settings, onChange }: SettingsViewProps) {
  return (
    <div>
      <div className="panel-header page-section-header">
        <h2>Settings</h2>
        <span>System-level scheduling configuration</span>
      </div>

      <section className="panel settings-grid">
        <label>
          Company Name
          <input
            type="text"
            value={settings.companyName}
            onChange={(event) => onChange({ ...settings, companyName: event.target.value })}
          />
        </label>

        <label>
          Shift Hours
          <input
            type="number"
            min={1}
            max={24}
            value={settings.shiftHours}
            onChange={(event) => onChange({ ...settings, shiftHours: Number(event.target.value) || 8 })}
          />
        </label>

        <label>
          Per Day Target
          <input
            type="number"
            min={0}
            value={settings.perDayTarget}
            onChange={(event) => onChange({ ...settings, perDayTarget: Number(event.target.value) || 0 })}
          />
        </label>
      </section>
    </div>
  )
}

export type { AppSettings }
