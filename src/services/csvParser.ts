export const parseCsv = (csvText: string): string[][] => {
  const rows: string[][] = []
  let currentValue = ''
  let currentRow: string[] = []
  let inQuotes = false

  for (let index = 0; index < csvText.length; index += 1) {
    const character = csvText[index]
    const nextCharacter = csvText[index + 1]

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        currentValue += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (character === ',' && !inQuotes) {
      currentRow.push(currentValue.trim())
      currentValue = ''
    } else if ((character === '\n' || character === '\r') && !inQuotes) {
      if (character === '\r' && nextCharacter === '\n') {
        index += 1
      }
      currentRow.push(currentValue.trim())
      if (currentRow.some((value) => value.length > 0)) {
        rows.push(currentRow)
      }
      currentRow = []
      currentValue = ''
    } else {
      currentValue += character
    }
  }

  if (currentValue.length > 0 || currentRow.length > 0) {
    currentRow.push(currentValue.trim())
    if (currentRow.some((value) => value.length > 0)) {
      rows.push(currentRow)
    }
  }

  return rows
}

export const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value ?? fallback)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const getField = (entry: Record<string, string>, aliases: string[]) => {
  const key = aliases.find((alias) => entry[alias] !== undefined && entry[alias].trim().length > 0)
  return key ? entry[key] : ''
}
