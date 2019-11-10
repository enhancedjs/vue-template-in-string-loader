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

export function updateSource(source: string, options: UpdateSourceOptions): UpdatedSource {
  const templateStrings = findTemplateString(source)
  if (templateStrings.length === 0) {
    return {
      result: source,
      updated: false
    }
  }

  let result = source

  for (const templStr of templateStrings.reverse()) {
    const compProp = findComponentProperty(result, templStr.varName)
    if (!compProp) {
      console.warn(`Cannot compile the template of '${templStr.varName}'`)
      continue
    }

    // Call the Vue compiler
    const compiled = compileTemplate({
      source: templStr.value,
      filename: options.fileName,
      compiler,
      transformAssetUrls: false,
      isProduction: false,
    })

    // Wrap the compiled result in a variable
    const code = `const ${templStr.varName} = (() => {
${compiled.code}
  return { render, staticRenderFns }
})()`

    // Replace the 'template' property by 'render' and 'staticRenderFns' properties
    result = result.substr(0, compProp.start) + `...${templStr.varName}` + result.substr(compProp.end)

    // Replace the template string with the variable from compilation
    result = result.substr(0, templStr.start) + code + result.substr(templStr.end)

  }

  return {
    result,
    updated: result !== source
  }
}
