# @enhancedjs/vue-template-in-string-loader

[![Build Status](https://travis-ci.com/enhancedjs/vue-template-in-string-loader.svg?branch=master)](https://travis-ci.com/enhancedjs/vue-template-in-string-loader)
[![Dependencies Status](https://david-dm.org/enhancedjs/vue-template-in-string-loader/status.svg)](https://david-dm.org/enhancedjs/vue-template-in-string-loader)
[![npm](https://img.shields.io/npm/dm/@enhancedjs/vue-template-in-string-loader)](https://www.npmjs.com/package/@enhancedjs/vue-template-in-string-loader)
![Type definitions](https://img.shields.io/npm/types/@enhancedjs/vue-template-in-string-loader)
[![GitHub](https://img.shields.io/github/license/enhancedjs/vue-template-in-string-loader)](https://github.com/enhancedjs/vue-template-in-string-loader)

Compile Vue templates in template strings at build time.

It allows to write single file components in standard JavaScript and TypeScript source files.

## How to use

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

## Contribute

With VS Code, our recommanded plugin is:

* **TSLint** from Microsoft (`ms-vscode.vscode-typescript-tslint-plugin`)
