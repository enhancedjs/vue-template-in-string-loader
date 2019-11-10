export interface FoundProperty {
  start: number
  end: number
  code: string
}

export function findComponentProperty(source: string, varName: string): FoundProperty | undefined {
  const compBegin = "export\\s+default\\s*(?:createComponent\\s*\\(\\s*)?{"
  const compBefore = "\\s*(?:.*,\\s*)?"
  const compEnd = "\\s*(?:}|,)"
  const templProp = varName === "template" ? "template(?:\\s*:\\s*template)?" : `template(?:\\s*:\\s*${varName})?`

  const reg = new RegExp(`(${compBegin}${compBefore})(${templProp})${compEnd}`, "g")

  const result: FoundProperty[] = []
  let found: RegExpExecArray | null

  while ((found = reg.exec(source)) !== null) {
    // console.log(found)
    const [, before, code] = found
    const start = found.index + before.length
    result.push({
      start,
      end: start + code.length,
      code
    })
  }

  if (result.length >= 2)
    throw new Error(`There are several candidate properties for the template '${varName}'`)

  return result[0]
}