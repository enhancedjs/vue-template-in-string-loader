import loaderUtils from "loader-utils"
import { basename } from "path"
import { updateSource } from "./update-source"

export = function (source: string) {
  const options = Object.assign(loaderUtils.getOptions(this) || {}, {
    sourceMap: this.sourceMap,
    filePath: this.resourcePath,
    fileName: basename(this.resourcePath)
  })
  const result = updateSource(source, options)
  // if (result !== source)
  //   console.log(">>>> result:", result, "\n  >>source:", source)
  return result
}
