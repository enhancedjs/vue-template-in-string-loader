import { FindTemplateOptions, findTemplateString } from "./find-template-string"

describe("Tests of 'findTemplateString'", () => {
  test("With prefix '/* html */'", () => {
    const result = findTemplateString(
      `
// before
const template = /* html */ def\`<p>abc</p>\`;
  // after
      `,
      "template"
    )
    expect(result).toBeDefined()
  })

  test("Multilines", () => {
    const result = findTemplateString(
      `const template = /*  html */\`
<p>
  <span>abc</span>
</p>
\`
    `,
      "template"
    )
    expect(result).toBeDefined()
  })

  test("With a backquote", () => {
    const result = findTemplateString(
      `const template = /*  html */\`<p>a \\\` b</p>\`
      `,
      "template"
    )
    expect(result).toBeDefined()
  })

  test("With prefix user prefix 'def'", () => {
    const prefix: FindTemplateOptions = {
      templateStringPrefix: "def"
    }
    const source = `
// before
const template = def \`<p>abc</p>\`;
  // after
    `
    const result = findTemplateString(source, "template", prefix)
    // console.log(
    //   result,
    //   "\nBEFORE:", "{{{" + source.substr(0, result.start) + "}}}",
    //   "\nAFTER:", "{{{" + source.substr(result.end) + "}}}",
    // )
    expect(result).toBeDefined()
  })

  test("With many variables candidate to property", () => {
    const source = `
  // before
  const template = \`<p>abc</p>\`;
  const template = \`<p>abc</p>\`;
    // after
    `
    expect(() => findTemplateString(source, "template")).toThrowError()
  })
})
