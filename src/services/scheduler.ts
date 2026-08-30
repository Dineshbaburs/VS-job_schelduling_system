import type { Allocation, DashboardMetrics, Employee, Task } from '../types/workforce'
import { priorityScore } from '../types/workforce'

const getScore = (employee: Employee, task: Task) => {
  const taskSkillWeight = task.requirements.reduce((total, requirement) => {
    const employeeSkill = employee.skills[requirement.skill] ?? 0
    const gap = Math.max(0, requirement.minLevel - employeeSkill)
    return total + (employeeSkill * 10 - gap * 12)
  }, 0)

  const experienceBonus = employee.experience * 2.7
  const seniorityBonus = employee.seniority * 3.5
  const performanceBonus = employee.performance * 0.9
  const workloadPenalty = employee.workload * 20
  const mistakePenalty = employee.mistakes * 8
  const previousWorkBonus = employee.previousWork * 3

  return (
    taskSkillWeight +
    experienceBonus +
    seniorityBonus +
    performanceBonus +
    previousWorkBonus -
    workloadPenalty -
    mistakePenalty
  )
}

export const buildSchedule = (employees: Employee[], tasks: Task[], attendanceMap: Record<number, boolean>) => {
  const presentEmployees = employees.filter((employee) => attendanceMap[employee.id] !== false)
  const allocations: Allocation[] = []

  const sortedTasks = [...tasks].sort(
    (left, right) => priorityScore[right.priority] - priorityScore[left.priority],
  )

  const usedEmployees = new Set<number>()

  sortedTasks.forEach((task) => {
    const eligible = presentEmployees
      .filter((employee) => !usedEmployees.has(employee.id))
      .map((employee) => ({
        ...employee,
        score: getScore(employee, task),
      }))
      .sort((left, right) => right.score - left.score)

    const assigned = [] as Allocation['assigned']

    task.requirements.forEach((requirement) => {
      const matchingEmployees = eligible
        .filter((employee) => !assigned.some((member) => member.id === employee.id))
        .filter((employee) => (employee.skills[requirement.skill] ?? 0) >= requirement.minLevel)
        .slice(0, requirement.count)

      assigned.push(...matchingEmployees)
    })

    while (assigned.length < task.requiredPeople) {
      const bestCandidate = eligible.find(
        (employee) => !assigned.some((member) => member.id === employee.id),
      )

      if (!bestCandidate) break
      assigned.push(bestCandidate)
    }

    const normalizedAssigned = assigned.slice(0, task.requiredPeople)
    normalizedAssigned.forEach((member) => usedEmployees.add(member.id))

    const coverage = task.requirements.every((requirement) => {
      const skillCount = normalizedAssigned.filter(
        (member) => (member.skills[requirement.skill] ?? 0) >= requirement.minLevel,
      ).length
      return skillCount >= requirement.count
    })
      ? 'Covered'
      : 'Shortage'

    const shortage = Math.max(0, task.requiredPeople - normalizedAssigned.length)
    const totalHours = task.requiredPeople * task.durationHours
    const utilization = Math.min(100, (totalHours / (presentEmployees.length * 8 || 1)) * 100)

    allocations.push({
      task,
      assigned: normalizedAssigned,
      shortage,
      totalHours,
      coverage,
      utilization,
    })
  })

  return allocations
}

export const calculateDashboardMetrics = (
  employees: Employee[],
  allocations: Allocation[],
  attendanceMap: Record<number, boolean>,
): DashboardMetrics => {
  const presentEmployees = employees.filter((employee) => attendanceMap[employee.id] !== false)
  const totalRequiredPeople = allocations.reduce((sum, item) => sum + item.assigned.length, 0)
  const totalDemandHours = allocations.reduce((sum, item) => sum + item.totalHours, 0)
  const totalAvailableHours = presentEmployees.length * 8
  const capacityUtilization = Math.min(100, (totalDemandHours / (totalAvailableHours || 1)) * 100)
  const totalPriorityWeight = allocations.reduce(
    (sum, item) => sum + priorityScore[item.task.priority],
    0,
  )

  return {
    presentCount: presentEmployees.length,
    totalRequiredPeople,
    totalDemandHours,
    totalAvailableHours,
    capacityUtilization,
    totalPriorityWeight,
  }
}
