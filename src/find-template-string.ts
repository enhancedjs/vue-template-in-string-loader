export const identifier = "[a-zA-Z_][a-zA-Z0-9_]*"
export const lineBegin = `(?:^|\\n)`

const comment = "/\\*\\s*[a-zA-Z0-9_]*\\s*\\*/"
const defaultPrefix = `(?:${comment})?\\s*(?:${identifier})?`

export function templateStringRegex(prefix?: string) {
  prefix = prefix ? `(?:${prefix})` : defaultPrefix
  const templateString = "`(?:[^`\\\\]*(?:\\\\.[^`\\\\]*)*)`"
  return `${prefix}\\s*(${templateString})`
}

export interface FindTemplateOptions {
  templateStringPrefix?: string
}

export interface FoundTemplate {
  start: number
  end: number
  code: string
  varName: string
  value: string
}

export function findTemplateString(
  source: string,
  varName: string,
  options?: FindTemplateOptions
): FoundTemplate {

  const varDeclar = `(?:const|let|var)\\s${varName}`
  // const doubleQuote = `"(?:[^"\\\\\\n]*(?:\\\\.[^"\\\\\\n]*)*)"`
  // const singleQuote = "'(?:[^'\\\\\\n]*(?:\\\\.[^'\\\\\\n]*)*)'"
  // const singleString = `(?:${templateString}|${doubleQuote}|${singleQuote})`
  // const concatString = `${singleString}(?:\\s*\\+\\s*${singleString})*`
  const reg = new RegExp(
    `${lineBegin}${varDeclar}\\s*=\\s*${templateStringRegex(options?.templateStringPrefix)}(?:\\s*;)?`,
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

  const end = start + code.length

  return {
    start,
    end,
    code,
    varName,
    // tslint:disable-next-line: no-eval
    value: eval(jsString)
  }
}
