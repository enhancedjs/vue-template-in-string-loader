import { updateSource, UpdateSourceOptions } from "./update-source"

describe("Tests of 'updateSource'", () => {
  const options: UpdateSourceOptions = {
    fileName: "file1.js",
    filePath: "a/b/c/file1.js"
  }

  test("One variable named 'template'", () => {
    const source = `
export default createComponent({
  name: "Comp1",
  template: /*  html */ df \`<p>abc</p>\`,
  setup() {
  }
})
    `
    const { result, updated } = updateSource(source, options)
    // console.log(result)
    expect(updated).toBe(true)
    expect(result).toEqual(expect.not.stringContaining("<p>"))
  })

  test("Declare a variable", () => {
    const source = `
const template = \`abc\`
export default createComponent({
  name: "Comp1",
  template,
  setup() {
  }
})
    `
    const { result, updated } = updateSource(source, options)
    // console.log(result)
    expect(updated).toBe(true)
    expect(result).toEqual(expect.not.stringContaining("<p>"))
  })
})
