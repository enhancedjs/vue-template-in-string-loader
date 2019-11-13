import { compileTemplate } from "@vue/component-compiler-utils"
import { findComponentProperty } from "./find-component-property"
import { findTemplateString } from "./find-template-string"
const compiler = require("vue-template-compiler")

export interface UpdatedSource {
  result: string
  updated: boolean
}

export interface UpdateSourceOptions {
  filePath: string
  fileName: string
  sourceMap?: any
}

export function updateSource(
  source: string,
  options: UpdateSourceOptions
): UpdatedSource {
  console.log("updateSource function")
  // const templateStrings = findTemplateString(source)
  // console.log("template string", templateStrings)
  // if (templateStrings.length === 0) {
  //   return {
  //     result: source,
  //     updated: false
  //   }
  // }

  let result = source
  const compProp = findComponentProperty(result)
  if (!compProp) throw new Error("Error Component Property not found!")

  const templateString = findTemplateString(source, compProp.varName)
  console.log("templateString", templateString)
  if (!templateString) {
    return {
      result: source,
      updated: false
    }
  }

  //  Call the Vue compiler
  const compiled = compileTemplate({
    source: templateString.value,
    filename: options.fileName,
    compiler,
    transformAssetUrls: false,
    isProduction: false
  })

  // Wrap the compiled result in a variable
  const code = `const ${templateString.varName} = (() => {
${compiled.code}
  return { render, staticRenderFns }
})()`

  // Replace the 'template' property by 'render' and 'staticRenderFns' properties
  result =
    result.substr(0, compProp.start) +
    `...${templateString.varName}` +
    result.substr(compProp.end)

  // Replace the template string with the variable from compilation
  result =
    result.substr(0, templateString.start) +
    code +
    result.substr(templateString.end)

  return {
    result,
    updated: result !== source
  }
}
