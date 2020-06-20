# @enhancedjs/vue-template-in-string-loader

[![Build Status](https://travis-ci.com/enhancedjs/vue-template-in-string-loader.svg?branch=master)](https://travis-ci.com/enhancedjs/vue-template-in-string-loader)
[![Dependencies Status](https://david-dm.org/enhancedjs/vue-template-in-string-loader/status.svg)](https://david-dm.org/enhancedjs/vue-template-in-string-loader)
[![npm](https://img.shields.io/npm/dm/@enhancedjs/vue-template-in-string-loader)](https://www.npmjs.com/package/@enhancedjs/vue-template-in-string-loader)
![Type definitions](https://img.shields.io/npm/types/@enhancedjs/vue-template-in-string-loader)
[![GitHub](https://img.shields.io/github/license/enhancedjs/vue-template-in-string-loader)](https://github.com/enhancedjs/vue-template-in-string-loader)

It is a webpack loader that pre-compiles Vue templates in JavaScript or TypeScript template strings at compile time. It allows to write single file components in standard JavaScript and TypeScript source files.

## Example

```js
const template = vueTemplate`
<div class="MyComponent">
  … some Vue template code…
</div>
`

export default defineComponent({
  name: "MyComponent",
  template,
})
```

The tag `vueTemplate` is optional. It helps the vscode extension [enhancedjs.html-in-template-string](https://marketplace.visualstudio.com/items?itemName=enhancedjs.html-in-template-string) to add some HTML syntax highlighting.

This webpack loader will replace the template string and its tag `vueTemplate` at compile time, so it is unecessary to provide an implementation for runtime. But, in a TypeScript project, a declaration has to be provided:

```ts
// global.d.ts
declare function vueTemplate(text: TemplateStringsArray): string;
```

## How to configure

First, add `@enhancedjs/vue-template-in-string-loader` to a Vue application:

```sh
npm install @enhancedjs/vue-template-in-string-loader --save-dev
```

In the `vue.config.js` file, add a `configureWebpack` section:

```js
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(js|ts)$/,
          exclude: /node_modules/,
          use: {
            loader: "@enhancedjs/vue-template-in-string-loader"
          }
        }
      ]
    }
  },
```

## See also

* The Visual Studio Code plugin [enhancedjs.html-in-template-string](https://github.com/enhancedjs/html-in-template-string-vscode);
* The webpack loader [@enhancedjs/css-in-template-string-loader](https://github.com/enhancedjs/css-in-template-string-loader);
* The Visual Studio Code plugin [enhancedjs.sass-in-template-string](https://github.com/enhancedjs/sass-in-template-string-vscode).

## Contribute

With VS Code, our recommanded plugin is:

* **TSLint** from Microsoft (`ms-vscode.vscode-typescript-tslint-plugin`)
