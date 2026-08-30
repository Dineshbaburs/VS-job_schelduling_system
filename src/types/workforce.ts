export type Priority = 'Critical' | 'High' | 'Medium' | 'Low'

export type Employee = {
  id: number
  name: string
  role: string
  attendance: 'Present' | 'Absent'
  age?: number
  gender?: string
  experience: number
  seniority: number
  performance: number
  previousWork: number
  mistakes: number
  workload: number
  primaryTask?: string
  avgProductivity?: number
  avgLineEfficiency?: number
  skills: Record<string, number>
}

export type TaskRequirement = {
  skill: string
  minLevel: number
  count: number
}

export type Task = {
  id: string
  name: string
  priority: Priority
  requiredPeople: number
  durationHours: number
  targetUnits: number
  description: string
  dueIn: string
  requirements: TaskRequirement[]
}

export type TeamMember = Employee & { score: number }

export type Allocation = {
  task: Task
  assigned: TeamMember[]
  shortage: number
  totalHours: number
  coverage: 'Covered' | 'Shortage'
  utilization: number
}

export type DashboardMetrics = {
  presentCount: number
  totalRequiredPeople: number
  totalDemandHours: number
  totalAvailableHours: number
  capacityUtilization: number
  totalPriorityWeight: number
}

export const priorityScore: Record<Priority, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
}
