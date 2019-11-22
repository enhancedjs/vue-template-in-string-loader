import loaderUtils from "loader-utils"
import { basename } from "path"
import { updateSource } from "./update-source"

export = function (source: string) {
  const options = Object.assign(loaderUtils.getOptions(this) || {}, {
    sourceMap: this.sourceMap,
    filePath: this.resourcePath,
    fileName: basename(this.resourcePath)
  })

  console.log("optionsd", options)

  const { result, updated } = updateSource(source, options)

  console.info(
    `Source file '${options.fileName}': ${updated ? "updated" : "same"}`
  )
  // if (source !== result)
  //   console.log("==> source:", result)
  return result
}
