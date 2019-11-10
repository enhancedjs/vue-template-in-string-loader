import { findTemplateString } from "./find-template-string"

describe("Tests of 'findTemplateString'", () => {

  test("With prefix '/* html */'", () => {
    const result = findTemplateString(`
// before
const template = /*  html */\`<p>abc</p>\`;
// after
    `)
    // console.log(result)
    expect(result.length).toBe(1)
  })

  test("Multilines", () => {
    const result = findTemplateString(`
const template = /*  html */\`
<p>
  <span>abc</span>
</p>
\`
    `)
    // console.log(result)
    expect(result.length).toBe(1)
  })

  test("With a backquote", () => {
    const result = findTemplateString(`
const template = /*  html */\`<p>a \\\` b</p>\`
    `)
    // console.log(result)
    expect(result.length).toBe(1)
  })
})