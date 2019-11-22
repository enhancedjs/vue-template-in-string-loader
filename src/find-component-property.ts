import { FindTemplateOptions, identifier, lineBegin, templateStringRegex } from "./find-template-string"

export interface InlineTemplate {
  inlineIdentifier?: string
  inlineValue: string
}

export interface FoundProperty {
  start: number
  end: number
  code: string
  varName: string
  inlineTemplate?: InlineTemplate
}

export function findComponentProperty(
  source: string,
  options?: FindTemplateOptions
): FoundProperty | undefined {

  const compBegin = "export\\s+default\\s*(?:createComponent\\s*\\(\\s*)?{"
  const propsWithoutBrackets = "(?:[^}{]*,)*"
  const compBefore = `\\s*(?:${propsWithoutBrackets}\\s*)?`
  // tslint:disable-next-line: whitespace
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

  console.log("==find-component-property found", found)
  const [, before, code, varName, id, jsString] = found
  const start = found.index + before.length
  const inlineTemplate: InlineTemplate = {
    inlineIdentifier: id,
    // tslint:disable-next-line: no-eval
    inlineValue: eval(jsString)
  }

  return {
    start,
    end: start + code.length,
    code,
    varName: !varName ? "template" : varName,
    inlineTemplate: jsString === undefined ? undefined : inlineTemplate
  }
}
