import type { Employee, Task } from '../types/workforce'

type StoredState = {
  employees: Employee[]
  tasks: Task[]
  attendanceMap: Record<number, boolean>
  progressMap: Record<string, number>
  dataSource: string
  settings: {
    companyName: string
    shiftHours: number
    perDayTarget: number
  }
  currentView: string
}

const STORAGE_KEY = 'wfs_merged_state_v1'

const fallbackState: StoredState = {
  employees: [],
  tasks: [],
  attendanceMap: {},
  progressMap: {},
  dataSource: 'No dataset loaded',
  settings: {
    companyName: 'Production Company Ltd',
    shiftHours: 8,
    perDayTarget: 600,
  },
  currentView: 'dashboard',
}

export const loadState = (): StoredState => {
  if (typeof window === 'undefined') return fallbackState

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallbackState

    const parsed = JSON.parse(raw) as Partial<StoredState>
    return {
      employees: parsed.employees ?? [],
      tasks: parsed.tasks ?? [],
      attendanceMap: parsed.attendanceMap ?? {},
      progressMap: parsed.progressMap ?? {},
      dataSource: parsed.dataSource ?? 'No dataset loaded',
      settings: parsed.settings ?? fallbackState.settings,
      currentView: parsed.currentView ?? 'dashboard',
    }
  } catch {
    return fallbackState
  }
}

export const saveState = (state: StoredState) => {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage write can fail in private modes or quota-limited environments.
  }
}

export const clearState = () => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}
