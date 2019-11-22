import { compileTemplate } from "@vue/component-compiler-utils"
import { findComponentProperty, FoundProperty } from "./find-component-property"
import { findTemplateString } from "./find-template-string"
const compiler = require("vue-template-compiler")

export interface UpdateSourceOptions {
  templateStringPrefix?: string
  filePath: string
  fileName: string
  sourceMap?: any
}

export function updateSource(source: string, options: UpdateSourceOptions): string {
  const compProp = findComponentProperty(source, options)
  if (!compProp)
    return source

  return compProp.inlineValue
    ? updateInlineProperty(compProp, source, options)
    : updateDeclaredVariable(compProp, source, options)
}

function updateDeclaredVariable(compProp: FoundProperty, source: string, options: UpdateSourceOptions) {
  const templateString = findTemplateString(source, compProp.varName, options)

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
    source: compProp.inlineValue!,
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

  // Replace the 'template' property by 'render' and 'staticRenderFns' properties
  const result =
    source.substr(0, compProp.start) +
    `${code}` +
    source.substr(compProp.end)

  return result
}