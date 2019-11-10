# vue-template-in-string-loader

[![Build Status](https://travis-ci.com/paleo/vue-template-in-string-loader.svg?branch=master)](https://travis-ci.com/paleo/vue-template-in-string-loader)

Compile Vue templates in template strings at build time.

It allow to write single file components in standard JavaScript and TypeScript source files.

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
