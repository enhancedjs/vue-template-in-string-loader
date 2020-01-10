export const identifier = "[a-zA-Z_][a-zA-Z0-9_]*"
const newLine = `(?:\\r?\\n|\\r)`
export const lineBegin = `(?:^|${newLine})`

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
  const reg = new RegExp(
    // tslint:disable-next-line: whitespace
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

  if (code[0] === "\r" && code[1] === "\n") {
    start += 2
    code = code.substr(2)
  } else if (code[0] === "\n" || code[0] === "\r") {
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
