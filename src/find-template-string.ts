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

export const defaultPrefixes = ["/\\*\\s*html\\s*\\*/", "html", "vueTemplate"]

export function findTemplateString(
  source: string,
  varName: string,
  options?: FindTemplateOptions
): FoundTemplate {
  // tslint:disable-next-line: whitespace
  const prefixes = options?.prefixes ?? defaultPrefixes

  const lineBegin = `(?:^|\\n)`
  const varDeclar = `(?:const|let|var)\\s${varName}`
  const prefix = "(?:" + prefixes.join("|") + ")"
  const templateString = "`(?:[^`\\\\]*(?:\\\\.[^`\\\\]*)*)`"
  // const doubleQuote = `"(?:[^"\\\\\\n]*(?:\\\\.[^"\\\\\\n]*)*)"`
  // const singleQuote = "'(?:[^'\\\\\\n]*(?:\\\\.[^'\\\\\\n]*)*)'"
  // const singleString = `(?:${templateString}|${doubleQuote}|${singleQuote})`
  // const concatString = `${singleString}(?:\\s*\\+\\s*${singleString})*`
  const reg = new RegExp(
    `${lineBegin}${varDeclar}\\s*=\\s*${prefix}\\s*(${templateString})(?:\\s*;)?`,
    "g"
  )

  const found = reg.exec(source)

  if (!found)
    throw new Error(`Cannot find the declaration of '${varName}'`)
  if (reg.exec(source))
    throw new Error(`There are several candidates for the declaration of '${varName}'`)

  let start = found.index!
  let [code, jsString] = found
  if (code[0] === "\n") {
    ++start
    code = code.substr(1)
  }
  const lastIndex = code.length - 1
  if (code[lastIndex] === ";")
    code = code.substr(0, lastIndex)

  return {
    start,
    end: start + code.length,
    code,
    varName,
    // tslint:disable-next-line: no-eval
    value: eval(jsString)
  }
}
