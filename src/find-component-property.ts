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

  const compBegin = "export\\s+default\\s*(?:createComponent\\s*\\(\\s*)?{"
  const compBefore = "\\s*(?:.*,\\s*)?"
  const propValue = `(${identifier}|${templateStringRegex(options?.prefix)})`
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

  // console.log("==find-component-property found", found)
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
