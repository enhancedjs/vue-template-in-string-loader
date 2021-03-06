import { FindTemplateOptions, identifier, lineBegin, templateStringRegex } from "./find-template-string"

export interface FoundProperty {
  start: number
  end: number
  code: string
  varName: string
  inlineValue?: string
}

export function findComponentProperty(
  source: string,
  options?: FindTemplateOptions
): FoundProperty | undefined {

  const compBegin = "export\\s+default\\s*(?:(?:defineComponent|createComponent)\\s*\\(\\s*)?{"
  const propsWithoutBrackets = "(?:[^}{]*,)*"
  const compBefore = `\\s*(?:${propsWithoutBrackets}\\s*)?`
  const propValue = `(${identifier}|${templateStringRegex(options?.templateStringPrefix)})`
  const templProp = `template(?:\\s*:\\s*${propValue})?`
  const compAfter = "\\s*(?:}|,)"

  const reg = new RegExp(
    `(${lineBegin}${compBegin}${compBefore})(${templProp})${compAfter}`,
    "g"
  )

  const found = reg.exec(source)
  if (!found)
    return
  if (reg.exec(source))
    throw new Error(`There are several candidates for the component`)

  const [, before, code, varName, jsString] = found
  const start = found.index + before.length

  return {
    start,
    end: start + code.length,
    code,
    varName: !varName ? "template" : varName,
    // tslint:disable-next-line: no-eval
    inlineValue: jsString === undefined ? undefined : eval(jsString)
  }
}
