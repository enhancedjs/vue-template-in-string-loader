import { updateSource, UpdateSourceOptions } from "./update-source"

describe("Tests of 'updateSource'", () => {

  const options: UpdateSourceOptions = {
    fileName: "file1.js",
    filePath: "a/b/c/file1.js",
  }

  test("One variable named 'template'", () => {
    const source = `
// before
const template = /*  html */\`<p>abc</p>\`;
// after
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