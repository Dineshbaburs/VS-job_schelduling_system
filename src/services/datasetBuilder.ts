import { getField, parseCsv, toNumber } from './csvParser'
import type { Employee, Priority, Task, TaskRequirement } from '../types/workforce'

const parseSkills = (rawSkills: string): Record<string, number> => {
  const skills: Record<string, number> = {}
  if (!rawSkills) return skills

  const items = rawSkills
    .split(/[;|]/)
    .map((part) => part.trim())
    .filter(Boolean)

  items.forEach((item) => {
    const [skill, value] = item.split(/[:=]/)
    if (skill && value) {
      const cleanSkill = skill.trim()
      const cleanValue = Number(value.trim())
      if (Number.isFinite(cleanValue)) {
        skills[cleanSkill] = cleanValue
      }
    }
  })

  return skills
}

const parseRequirements = (rawRequirements: string): TaskRequirement[] => {
  if (!rawRequirements) return []

  return rawRequirements
    .split(/[;|]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const firstEquals = part.indexOf('=')
      const firstColon = part.indexOf(':')
      const separator = firstEquals >= 0 ? firstEquals : firstColon

      if (separator < 0) return null
      const skill = part.slice(0, separator).trim()
      const rest = part.slice(separator + 1).trim()
      const values = rest.split(/[:]/).map((value) => value.trim())
      const minLevel = values[0]
      const count = values[1] ?? values[0]

      if (!skill || !minLevel) return null

      const parsedMin = Number(minLevel)
      const parsedCount = Number(count)
      if (!Number.isFinite(parsedMin) || !Number.isFinite(parsedCount)) return null

      return {
        skill,
        minLevel: parsedMin,
        count: parsedCount,
      }
    })
    .filter((requirement): requirement is TaskRequirement => Boolean(requirement))
}

const normalizePriority = (value: string): Priority => {
  const normalized = value.toLowerCase()
  if (normalized.includes('critical')) return 'Critical'
  if (normalized.includes('high')) return 'High'
  if (normalized.includes('medium')) return 'Medium'
  return 'Low'
}

const getSeniorityFromAge = (age: number) => {
  if (age > 40) return { seniority: 3, experience: 10 }
  if (age > 30) return { seniority: 2, experience: 5 }
  return { seniority: 1, experience: 2 }
}

const buildAnonymousFactoryProfiles = (rowsData: string[][], headers: string[]) => {
  const employeeMap = new Map<
    string,
    {
      age: number
      gender: string
      taskCounts: Record<string, number>
      productivitySum: number
      efficiencySum: number
      records: number
    }
  >()

  const taskMap = new Map<string, Task>()

  rowsData.forEach((row) => {
    const entry = Object.fromEntries(headers.map((header, columnIndex) => [header, row[columnIndex] ?? '']))

    const age = toNumber(getField(entry, ['age']), 28)
    const gender = getField(entry, ['gender']) || 'Unknown'
    const shift = getField(entry, ['shift', 'time_of_day']) || 'General Shift'
    const taskType =
      getField(entry, ['task type', 'task_type', 'tasktype', 'task', 'operation']) || 'General'
    const productivity = toNumber(getField(entry, ['productivity score', 'productivity', 'performance']), 75)
    const efficiency = toNumber(getField(entry, ['line efficiency', 'efficiency']), 75)

    const employeeKey = `${age}-${gender}`
    const employeeRecord = employeeMap.get(employeeKey) ?? {
      age,
      gender,
      taskCounts: {},
      productivitySum: 0,
      efficiencySum: 0,
      records: 0,
    }

    employeeRecord.taskCounts[taskType] = (employeeRecord.taskCounts[taskType] ?? 0) + 1
    employeeRecord.productivitySum += productivity
    employeeRecord.efficiencySum += efficiency
    employeeRecord.records += 1
    employeeMap.set(employeeKey, employeeRecord)

    const taskKey = `${taskType}__${shift}`
    const existingTask = taskMap.get(taskKey)
    if (existingTask) {
      existingTask.requiredPeople += 1
      existingTask.targetUnits += toNumber(getField(entry, ['quantity', 'target', 'targetunits']), 0)
      return
    }

    taskMap.set(taskKey, {
      id: `T${taskMap.size + 1}`,
      name: `Daily ${taskType} Run`,
      priority: taskMap.size === 0 ? 'High' : 'Medium',
      requiredPeople: 1,
      durationHours: 8,
      targetUnits: toNumber(getField(entry, ['quantity', 'target', 'targetunits']), 0),
      description: `Auto-generated from ${shift}`,
      dueIn: shift,
      requirements: [
        {
          skill: taskType,
          minLevel: 1,
          count: 1,
        },
      ],
    })
  })

  const employees: Employee[] = Array.from(employeeMap.entries()).map(([_, record], index) => {
    const { seniority, experience } = getSeniorityFromAge(record.age)
    const primaryTask =
      Object.entries(record.taskCounts).sort((left, right) => right[1] - left[1])[0]?.[0] ?? 'General'

    return {
      id: index + 1,
      name: `Employee ${index + 1}`,
      role: 'Team Member',
      attendance: 'Present',
      age: record.age,
      gender: record.gender,
      experience,
      seniority,
      performance: record.records ? record.productivitySum / record.records : 75,
      previousWork: record.records,
      mistakes: 0,
      workload: 0.5,
      primaryTask,
      avgProductivity: record.records ? record.productivitySum / record.records : 0,
      avgLineEfficiency: record.records ? record.efficiencySum / record.records : 0,
      skills: {
        [primaryTask]: 4,
      },
    }
  })

  const tasks = Array.from(taskMap.values())
  return { employees, tasks }
}

export const parseCombinedFactoryCsv = (csvText: string): { employees: Employee[]; tasks: Task[] } => {
  const rows = parseCsv(csvText)
  if (rows.length < 2) {
    return { employees: [], tasks: [] }
  }

  const headers = rows[0].map((header) => header.trim().toLowerCase())
  const rowsData = rows.slice(1).filter((row) => row.some((cell) => cell.trim().length > 0))

  const hasEmployeeIdentityColumns = headers.some((header) =>
    ['id', 'employeeid', 'employee_id', 'workerid', 'worker_id', 'name', 'worker_name'].includes(header),
  )

  if (!hasEmployeeIdentityColumns) {
    return buildAnonymousFactoryProfiles(rowsData, headers)
  }

  const employeeMap = new Map<string, Employee>()
  const taskMap = new Map<string, Task>()

  rowsData.forEach((row, index) => {
    const entry = Object.fromEntries(headers.map((header, columnIndex) => [header, row[columnIndex] ?? '']))

    const rawId = getField(entry, ['id', 'employeeid', 'employee_id', 'workerid', 'worker_id'])
    const rawName = getField(entry, ['name', 'employeename', 'employee_name', 'workername', 'worker_name'])
    const employeeKey = rawId || rawName || `employee-${index + 1}`
    const numericId = Number(rawId)

    const employee: Employee = {
      id: Number.isFinite(numericId) ? numericId : index + 1,
      name: rawName || `Employee ${index + 1}`,
      role: getField(entry, ['role', 'designation', 'position']) || 'Team Member',
      attendance: getField(entry, ['attendance', 'status', 'present']).toLowerCase() === 'absent' ? 'Absent' : 'Present',
      experience: toNumber(getField(entry, ['experience', 'experienceyears', 'experience_years', 'tenure']), 1),
      seniority: toNumber(getField(entry, ['seniority', 'level', 'grade']), 1),
      performance: toNumber(
        getField(entry, ['performance', 'productivity', 'productivitylevel', 'taskcompletionrate', 'completionrate']),
        80,
      ),
      previousWork: toNumber(getField(entry, ['previouswork', 'taskscompleted', 'completedtasks']), 0),
      mistakes: toNumber(getField(entry, ['mistakes', 'errors', 'defects']), 0),
      workload: toNumber(getField(entry, ['workload', 'load', 'utilization']), 0.5),
      skills: parseSkills(getField(entry, ['skills', 'skillset', 'skill_matrix'])),
    }

    if (!employeeMap.has(employeeKey)) {
      employeeMap.set(employeeKey, employee)
    }

    const rawTaskName =
      getField(entry, ['task', 'taskname', 'task_name', 'tasktype', 'task_type', 'operation']) ||
      `${employee.role} Shift Work`
    const rawShift = getField(entry, ['shift', 'timeslot', 'time_of_day']) || 'General Shift'
    const taskKey = `${rawTaskName}__${rawShift}`

    const existingTask = taskMap.get(taskKey)
    if (existingTask) {
      existingTask.requiredPeople += 1
      existingTask.targetUnits += toNumber(
        getField(entry, ['targetunits', 'target_units', 'target', 'units', 'outputtarget']),
        0,
      )
      return
    }

    const task: Task = {
      id: getField(entry, ['taskid', 'task_id']) || `T${taskMap.size + 1}`,
      name: rawTaskName,
      priority: normalizePriority(getField(entry, ['priority', 'taskpriority']) || 'Medium'),
      requiredPeople: Math.max(
        1,
        toNumber(getField(entry, ['requiredpeople', 'required_people', 'people', 'headcount']), 1),
      ),
      durationHours: toNumber(
        getField(entry, ['durationhours', 'duration_hours', 'hours', 'shifthours', 'shift_hours']),
        8,
      ),
      targetUnits: toNumber(
        getField(entry, ['targetunits', 'target_units', 'target', 'units', 'outputtarget']),
        0,
      ),
      description: getField(entry, ['description']) || `Auto-generated from ${rawShift}`,
      dueIn: rawShift,
      requirements: parseRequirements(getField(entry, ['requirements', 'skillrequirements', 'requiredskills'])),
    }

    taskMap.set(taskKey, task)
  })

  const employees = Array.from(employeeMap.values()).map((employee, index) => ({
    ...employee,
    id: employee.id || index + 1,
  }))

  const tasks = Array.from(taskMap.values())

  if (tasks.length === 0 && employees.length > 0) {
    const roleGroups = new Map<string, number>()
    employees.forEach((employee) => {
      roleGroups.set(employee.role, (roleGroups.get(employee.role) ?? 0) + 1)
    })

    roleGroups.forEach((count, role) => {
      tasks.push({
        id: `T${tasks.length + 1}`,
        name: `${role} Daily Operations`,
        priority: 'Medium',
        requiredPeople: Math.max(1, Math.min(count, 3)),
        durationHours: 8,
        targetUnits: 0,
        description: 'Auto-created task based on workforce roles',
        dueIn: 'Current Shift',
        requirements: [],
      })
    })
  }

  return { employees, tasks }
}

export const buildInitialAttendanceMap = (list: Employee[]): Record<number, boolean> => {
  return Object.fromEntries(list.map((employee) => [employee.id, employee.attendance === 'Present']))
}
