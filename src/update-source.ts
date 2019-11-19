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

  const compProp = findComponentProperty(source)
  if (!compProp) {
    return {
      result: source,
      updated: false
    }
  }

  // Template prompt assignmment
  if (compProp.value) {
    // const templateString = findTemplateString(source, compProp.varName)

  //  Call the Vue compiler
    const compiled = compileTemplate({
      // tslint:disable-next-line: no-eval
      source: eval(compProp.value),
      filename: options.fileName,
      compiler,
      transformAssetUrls: false,
      isProduction: false
  })

  // Wrap the compiled result in a property
    const code = `template: (() => {
${compiled.code}
  return { render, staticRenderFns }
})()`

  // Replace the 'template' property by 'render' and 'staticRenderFns' properties
    let result = source
    result =
    result.substr(0, compProp.start) +
    `${code}` +
    result.substr(compProp.end)

    console.log("---- SOURCE\n", source, "\n---- RESULT\n", result)

    return {
    result,
    updated: true
  }

  }


  const templateString = findTemplateString(source, compProp.varName)

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

  console.log("---- SOURCE\n", source, "\n---- RESULT\n", result)

  return {
    result,
    updated: true
  }
}
