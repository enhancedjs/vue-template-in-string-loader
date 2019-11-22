import { compileTemplate } from "@vue/component-compiler-utils"
import { findComponentProperty, FoundProperty, InlineTemplate } from "./find-component-property"
import { FindTemplateOptions, findTemplateString } from "./find-template-string"
const compiler = require("vue-template-compiler")

export interface UpdatedSource {
  result: string
  updated: boolean
}

export interface UpdateSourceOptions {
  templateStringPrefix?: string
  filePath: string
  fileName: string
  sourceMap?: any
}

export function updateSource(
  source: string,
  options: UpdateSourceOptions
): UpdatedSource {

  const userOptions: FindTemplateOptions = {
    templateStringPrefix: options.templateStringPrefix
  }

  const compProp = findComponentProperty(source, userOptions)
  if (!compProp) {
    return {
      result: source,
      updated: false
    }
  }

  const result = compProp.inlineTemplate ?
    updateInlineProperty(compProp, source, options) :
    updateDeclaredVariable(compProp, source, options)

  console.log("---- SOURCE\n", source, "\n---- RESULT\n", result)

  return {
    result,
    updated: true
  }
}

function updateDeclaredVariable(compProp: FoundProperty, source: string, options: UpdateSourceOptions) {
  console.log("optionsd2", options.templateStringPrefix)
  const userOptions: FindTemplateOptions = {
    templateStringPrefix: options.templateStringPrefix
  }
  const templateString = findTemplateString(source, compProp.varName, userOptions)

  //  Call the Vue compiler
  const compiled = compileTemplate({
    source: templateString.value,
    filename: options.fileName,
    compiler,
    transformAssetUrls: false,
    isProduction: false
  })

  // Replace the 'template' property by 'render' and 'staticRenderFns' properties
  let result = source
  result =
    result.substr(0, compProp.start) +
    `...${templateString.varName}` +
    result.substr(compProp.end)

  // Wrap the compiled result in a variable
  const code = `const ${templateString.varName} = (() => {
${compiled.code}
  return { render, staticRenderFns }
})()`


  if (templateString.identifier) {
    const tagFunction = `function ${templateString.identifier}(source: TemplateStringsArray): string
  {
      if (source.length !== 1)
      throw new Error("Expressions are not allowed in a '${templateString.identifier}' template string")
    return source[0]
  }`

   // Replace the template string with the variable from compilation
    result =
      result.substr(0, templateString.start) +
      code + tagFunction +
      result.substr(templateString.end)

    return result
  }

  // Replace the template string with the variable from compilation
  result =
    result.substr(0, templateString.start) +
    code +
    result.substr(templateString.end)

  return result
}

function updateInlineProperty(compProp: FoundProperty, source: string, options: UpdateSourceOptions) {
  //  Call the Vue compiler
  const compiled = compileTemplate({
    source: compProp.inlineTemplate!.inlineValue,
    filename: options.fileName,
    compiler,
    transformAssetUrls: false,
    isProduction: false
  })

  // Wrap the compiled result in properties
  const code = `...(() => {
${compiled.code}
  return { render, staticRenderFns }
})()`

  if (compProp.inlineTemplate!.inlineIdentifier) {
    const inlineTemplate: InlineTemplate = compProp.inlineTemplate!
    const tagFunction = `function ${inlineTemplate.inlineIdentifier}(source: TemplateStringsArray): string
  {
      if (source.length !== 1)
      throw new Error("Expressions are not allowed in a '${inlineTemplate.inlineIdentifier}' template string")
    return source[0]
  }`

   // Replace the 'template' property by 'render' and 'staticRenderFns' properties
    const result =
      source.substr(0, compProp.start) +
      `${code}` + tagFunction +
      source.substr(compProp.end)

    return result
  }

  // Replace the 'template' property by 'render' and 'staticRenderFns' properties
  const result =
    source.substr(0, compProp.start) +
    `${code}` +
    source.substr(compProp.end)

  return result
}