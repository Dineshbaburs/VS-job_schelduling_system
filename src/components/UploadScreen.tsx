import type { ChangeEvent } from 'react'

type UploadScreenProps = {
  dataSource: string
  onUpload: (event: ChangeEvent<HTMLInputElement>) => Promise<void>
}

export function UploadScreen({ dataSource, onUpload }: UploadScreenProps) {
  return (
    <div className="app-shell upload-screen">
      <section className="upload-hero panel">
        <div className="upload-hero-copy">
          <p className="eyebrow">Workforce Intelligence</p>
          <h1>Smart Workforce Scheduling System</h1>
          <p>
            Upload one manufacturing CSV and generate staffing recommendations using skill matching,
            attendance availability, and priority-based task allocation.
          </p>

          <div className="hero-badges">
            <span>One CSV Input</span>
            <span>Auto Task Discovery</span>
            <span>Live Allocation Dashboard</span>
          </div>
        </div>

        <div className="upload-layout">
          <div className="upload-panel panel large-panel">
            <div className="panel-header">
              <h2>Upload your dataset</h2>
              <span>Analysis begins right after file upload</span>
            </div>

            <div className="upload-grid">
              <label className="file-picker">
                <span className="picker-title">Manufacturing dataset CSV</span>
                <small className="picker-subtitle">Drop your file here or click to browse</small>
                <input type="file" accept=".csv,text/csv" onChange={onUpload} />
              </label>
            </div>

            <div className="csv-guide">
              <strong>CSV format guide</strong>
              <ul>
                <li>Use one CSV file only. Employee and task information are derived from the same dataset.</li>
                <li>Supported employee columns: id/worker_id, name/worker_name, role, attendance, experience, performance, workload.</li>
                <li>Supported task columns: task_type/task_name, shift/time_of_day, priority, required_people, duration_hours, target_units.</li>
                <li>Optional formats: skills as Cutting=5;Sewing=4 and requirements as Cutting=4:2;Planning=3:1.</li>
              </ul>
            </div>

            <div className="status-box">
              <strong>Current status:</strong> {dataSource}
            </div>
          </div>

          <aside className="panel upload-side-info">
            <div className="panel-header">
              <h2>Quick Start</h2>
              <span>3-step flow</span>
            </div>

            <ol className="quick-steps">
              <li>Upload your manufacturing CSV file.</li>
              <li>Review attendance, tasks, and auto-generated allocation.</li>
              <li>Track progress and apply feedback for continuous improvement.</li>
            </ol>

            <div className="status-box upload-tip">
              <strong>Tip:</strong> Include Shift and Task Type columns for best scheduling quality.
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
