import { FindTemplateOptions, findTemplateString } from "./find-template-string"

describe("Tests of 'findTemplateString'", () => {
    test("With prefix '/* html */'", () => {
      const result = findTemplateString(
        `
// before
const template = /* html */ \`<p>abc</p>\`;
  // after
      `,
        "template"
      )
      // console.log(result)
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
    console.log(result)
    expect(result).toBeDefined()
  })

    test("With a backquote", () => {
      const result = findTemplateString(
        `const template = /*  html */\`<p>a \\\` b</p>\`
      `,
        "template"
      )
      // console.log(result)
      expect(result).toBeDefined()
    })

    test("With prefix user prefix 'def'", () => {
      const prefix: FindTemplateOptions = {
        prefix: "def"
      }
      const result = findTemplateString(
        `
// before
const template = def \`<p>abc</p>\`;
  // after
      `,
        "template",
        prefix
      )
      // console.log(result)
      expect(result).toBeDefined()
    })

//     test("With many variables candidate to property", () => {
//       const result = findTemplateString(
//         `
// // before
// const template = \`<p>abc</p>\`;
// const template = \`<p>abc</p>\`;
//   // after
//       `,
//         "template"
//       )
//       // console.log(result)
//       expect(result).toBeUndefined()
//     })

})
