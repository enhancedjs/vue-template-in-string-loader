# vue-template-in-string-loader

[![Build Status](https://travis-ci.com/tomko-team/vue-template-in-string-loader.svg?branch=master)](https://travis-ci.com/tomko-team/vue-template-in-string-loader)
[![Dependencies Status](https://david-dm.org/tomko-team/vue-template-in-string-loader/status.svg)](https://david-dm.org/tomko-team/vue-template-in-string-loader)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/136865c77ccd40a9bdbe324518270e2e)](https://www.codacy.com/manual/paleo/vue-template-in-string-loader?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=tomko-team/vue-template-in-string-loader&amp;utm_campaign=Badge_Grade)
[![npm](https://img.shields.io/npm/dm/vue-template-in-string-loader)](https://www.npmjs.com/package/vue-template-in-string-loader)
![Type definitions](https://img.shields.io/npm/types/vue-template-in-string-loader)
[![GitHub](https://img.shields.io/github/license/tomko-team/vue-template-in-string-loader)](https://github.com/tomko-team/vue-template-in-string-loader)

Compile Vue templates in template strings at build time.

It allows to write single file components in standard JavaScript and TypeScript source files.

## How to use

First, add `vue-template-in-string-loader` to a Vue application:

```sh
npm install vue-template-in-string-loader --save-dev
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
            loader: "vue-template-in-string-loader"
          }
        }
      ]
    }
  },
```

## Contribute

With VS Code, our recommanded plugin is:

* **TSLint** from Microsoft (`ms-vscode.vscode-typescript-tslint-plugin`)
