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

const defaultPrefixes = [
  "/\\*\\s*html\\s*\\*/",
  "html",
  "vueTemplate"
]

export function findTemplateString(source: string, options?: FindTemplateOptions): FoundTemplate[] {
  const prefixes = options?.prefixes ?? defaultPrefixes

  const varDeclar = "(?:const|let|var)\\s+([a-zA-Z_][a-zA-Z0-9_]*)"
  const prefix = "(?:" + prefixes.join("|") + ")"
  const templateString = "`(?:[^`\\\\]*(?:\\\\.[^`\\\\]*)*)`"
  // const doubleQuote = `"(?:[^"\\\\\\n]*(?:\\\\.[^"\\\\\\n]*)*)"`
  // const singleQuote = "'(?:[^'\\\\\\n]*(?:\\\\.[^'\\\\\\n]*)*)'"
  // const singleString = `(?:${templateString}|${doubleQuote}|${singleQuote})`
  // const concatString = `${singleString}(?:\\s*\\+\\s*${singleString})*`
  const reg = new RegExp(`${varDeclar}\\s*=\\s*${prefix}\\s*(${templateString})(?:\\s*;)?`, "g")

  const result: FoundTemplate[] = []
  let found: RegExpExecArray | null


  while ((found = reg.exec(source)) !== null) {
    const [code, varName, jsString] = found
    result.push({
      start: found.index!,
      end: found.index! + code.length,
      code,
      varName,
      // tslint:disable-next-line: no-eval
      value: eval(jsString)
    })
  }

  return result
}
