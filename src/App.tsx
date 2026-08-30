import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import './App.css'
import type { Employee, Task } from './types/workforce'
import { parseCombinedFactoryCsv, buildInitialAttendanceMap } from './services/datasetBuilder'
import { buildSchedule, calculateDashboardMetrics } from './services/scheduler'
import { UploadScreen } from './components/UploadScreen'
import { HeaderBar } from './components/HeaderBar'
import { KpiSection } from './components/KpiSection'
import { AttendancePanel } from './components/AttendancePanel'
import { TaskPanel } from './components/TaskPanel'
import { AllocationPanel } from './components/AllocationPanel'
import { BottomSummary } from './components/BottomSummary'
import { ProcessFlowPanel } from './components/ProcessFlowPanel'
import { MonitoringPanel } from './components/MonitoringPanel'
import { FeedbackPanel, type FeedbackPayload } from './components/FeedbackPanel'
import { clearState, loadState, saveState } from './services/storage'
import { SidebarNav, type AppView } from './components/SidebarNav'
import { AttendanceView } from './components/AttendanceView'
import { EmployeesView } from './components/EmployeesView'
import { TasksView } from './components/TasksView'
import { SchedulingView } from './components/SchedulingView'
import { ReportsView } from './components/ReportsView'
import { SettingsView, type AppSettings } from './components/SettingsView'

function App() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [dataSource, setDataSource] = useState('No dataset loaded')
  const [attendanceMap, setAttendanceMap] = useState<Record<number, boolean>>({})
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})
  const [currentView, setCurrentView] = useState<AppView>('dashboard')
  const [schedulerRun, setSchedulerRun] = useState(false)
  const [settings, setSettings] = useState<AppSettings>({
    companyName: 'Production Company Ltd',
    shiftHours: 8,
    perDayTarget: 600,
  })

  const isReady = employees.length > 0 && tasks.length > 0

  useEffect(() => {
    const stored = loadState()
    setEmployees(stored.employees)
    setTasks(stored.tasks)
    setAttendanceMap(stored.attendanceMap)
    setProgressMap(stored.progressMap)
    setDataSource(stored.dataSource)
    setCurrentView((stored.currentView as AppView) ?? 'dashboard')
    setSettings(stored.settings)
    setSchedulerRun(stored.tasks.length > 0)
  }, [])

  useEffect(() => {
    saveState({
      employees,
      tasks,
      attendanceMap,
      progressMap,
      dataSource,
      settings,
      currentView,
    })
  }, [employees, tasks, attendanceMap, progressMap, dataSource, settings, currentView])

  const allocations = useMemo(
    () => (isReady ? buildSchedule(employees, tasks, attendanceMap) : []),
    [employees, tasks, attendanceMap, isReady],
  )

  const metrics = useMemo(
    () => calculateDashboardMetrics(employees, allocations, attendanceMap),
    [employees, allocations, attendanceMap],
  )

  const handleCombinedCsvUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const text = await file.text()
    const parsed = parseCombinedFactoryCsv(text)
    setEmployees(parsed.employees)
    setAttendanceMap(buildInitialAttendanceMap(parsed.employees))
    setTasks(parsed.tasks)
    setProgressMap(Object.fromEntries(parsed.tasks.map((task) => [task.id, 0])))
    setDataSource(file.name)
    setSchedulerRun(false)
    setCurrentView('dashboard')
  }

  const clearDataset = () => {
    setEmployees([])
    setTasks([])
    setAttendanceMap({})
    setProgressMap({})
    setDataSource('No dataset loaded')
    setSchedulerRun(false)
    setCurrentView('dashboard')
    clearState()
  }

  const toggleAttendance = (id: number) => {
    setAttendanceMap((current) => ({
      ...current,
      [id]: !current[id],
    }))
  }

  const updateTaskProgress = (taskId: string, progress: number) => {
    setProgressMap((current) => ({
      ...current,
      [taskId]: Math.max(0, Math.min(100, progress)),
    }))
  }

  const applyFeedbackLoop = ({ employeeId, skillName, skillDelta, performanceDelta }: FeedbackPayload) => {
    setEmployees((current) =>
      current.map((employee) => {
        if (employee.id !== employeeId) return employee

        const previousSkillLevel = employee.skills[skillName] ?? 0
        const updatedSkillLevel = Math.max(0, Math.min(10, previousSkillLevel + skillDelta))
        const updatedPerformance = Math.max(0, Math.min(100, employee.performance + performanceDelta))

        return {
          ...employee,
          performance: updatedPerformance,
          previousWork: employee.previousWork + 1,
          skills: {
            ...employee.skills,
            [skillName]: updatedSkillLevel,
          },
        }
      }),
    )
  }

  const cycleTaskPriority = (taskId: string) => {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== taskId) return task
        if (task.priority === 'High') return { ...task, priority: 'Medium' }
        if (task.priority === 'Medium') return { ...task, priority: 'Low' }
        if (task.priority === 'Low') return { ...task, priority: 'Critical' }
        return { ...task, priority: 'High' }
      }),
    )
  }

  const runSchedulerView = () => {
    setSchedulerRun(true)
  }

  if (!isReady) {
    return <UploadScreen dataSource={dataSource} onUpload={handleCombinedCsvUpload} />
  }

  const dashboardContent = (
    <>
      <HeaderBar dataSource={dataSource} onReset={clearDataset} />
      <ProcessFlowPanel />
      <KpiSection metrics={metrics} />

      <main className="dashboard-grid">
        <AttendancePanel
          employees={employees}
          attendanceMap={attendanceMap}
          onToggleAttendance={toggleAttendance}
        />
        <TaskPanel tasks={tasks} />
      </main>

      <AllocationPanel allocations={allocations} />
      <BottomSummary metrics={metrics} />
    </>
  )

  const monitoringContent = (
    <section className="dashboard-grid">
      <MonitoringPanel
        allocations={allocations}
        progressMap={progressMap}
        onProgressChange={updateTaskProgress}
      />
      <FeedbackPanel employees={employees} onApplyFeedback={applyFeedbackLoop} />
    </section>
  )

  const getPageView = () => {
    if (currentView === 'dashboard') return dashboardContent
    if (currentView === 'attendance') {
      return (
        <AttendanceView
          employees={employees}
          attendanceMap={attendanceMap}
          onToggleAttendance={toggleAttendance}
        />
      )
    }
    if (currentView === 'employees') return <EmployeesView employees={employees} />
    if (currentView === 'tasks') return <TasksView tasks={tasks} onCyclePriority={cycleTaskPriority} />
    if (currentView === 'scheduling') {
      return <SchedulingView allocations={allocations} hasRun={schedulerRun} onRun={runSchedulerView} />
    }
    if (currentView === 'monitoring') return monitoringContent
    if (currentView === 'reports') return <ReportsView allocations={allocations} metrics={metrics} />
    return <SettingsView settings={settings} onChange={setSettings} />
  }

  return (
    <div className="app-layout-shell">
      <SidebarNav currentView={currentView} onChangeView={setCurrentView} />
      <main className="main-content-shell">
        <div className="app-shell">{getPageView()}</div>
      </main>
    </div>
  )
}

export default App
