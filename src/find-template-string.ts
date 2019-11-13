export interface FoundTemplate {
  start: number
  end: number
  code: string
  varName: string
  value: string
}

export interface FindTemplateOptions {
  prefixes: string[]
}

const defaultPrefixes = ["/\\*\\s*html\\s*\\*/", "html", "vueTemplate"]

export function findTemplateString(
  source: string,
  varNameFromProp: string,
  options?: FindTemplateOptions
): FoundTemplate | undefined {
  // tslint:disable-next-line: whitespace
  const prefixes = options?.prefixes ?? defaultPrefixes

  const varDeclar = `(?:const|let|var)\\s${varNameFromProp}`
  const prefix = "(?:" + prefixes.join("|") + ")"
  const templateString = "`(?:[^`\\\\]*(?:\\\\.[^`\\\\]*)*)`"
  // const doubleQuote = `"(?:[^"\\\\\\n]*(?:\\\\.[^"\\\\\\n]*)*)"`
  // const singleQuote = "'(?:[^'\\\\\\n]*(?:\\\\.[^'\\\\\\n]*)*)'"
  // const singleString = `(?:${templateString}|${doubleQuote}|${singleQuote})`
  // const concatString = `${singleString}(?:\\s*\\+\\s*${singleString})*`
  const reg = new RegExp(
    `${varDeclar}\\s*=\\s*${prefix}\\s*(${templateString})(?:\\s*;)?`,
    "g"
  )

  const result: FoundTemplate[] = []
  let found: RegExpExecArray | null

  while ((found = reg.exec(source)) !== null) {
    const [code, jsString] = found
    result.push({
      start: found.index!,
      end: found.index! + code.length,
      code,
      varName: varNameFromProp,
      // tslint:disable-next-line: no-eval
      value: eval(jsString)
    })
  }

  if (result.length >= 2)
    throw new Error(`There are several candidate variables for property`)

  if ((found = reg.exec(source)) === null) {
    console.error("Error: Template not found")
  }

  console.log("find-template-string result", result[0])
  return result[0]
}
