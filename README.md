# My Webpack Generator

**A utility for generate webpack configs with common settings**

## About

This utility will create a webpack config that should function as a drop-in for any Javascript or TypeScript project.

It features:

-   Tree shaking
-   Circular dependency checking
-   Synthetic default imports (TypeScript)
-   Project root alias (`^`)
-   Type checking in separate worker
-   Transpiling from ES6+ (and React) to target browsers
-   Polyfilling ES6+ features

## Installation

```shell
# with npm
npm i my-webpack-generator -S
# with yarn
yarn add my-webpack-generator
```

Install peer dependencies (TypeScript must be at least version 2):

```shell
npm i typescript@2 webpack-cli@3 webpack@4 @babel/polyfill@7 -S
```

## Setup

### Creating your config file

Create a file called `index.js` inside `config/webpack` and add the following contents, adjusting options as desired.

This will bundle your `index.ts` file and all dependencies into a `bundle.js` in the `static/build/js` directory.

`config/webpack/index.js`

```js
const myWebpackGenerator = require("my-webpack-generator");

module.exports = myWebpackGenerator({
  // required
  mode: process.NODE_ENV || "development",
  input: {
    bundle: "./static/src/ts/index.ts"
  },
  outDir: "./static/build/js",
  tsconfig: "./tsconfig.dist.json",
  publicPath: '/',
  resolve: {
      ext: ["js", "ts", ...],
      modules: ["static", "node_modules", ...],
  },

  // optional
  omitSourceMap: false,
  isServer: false,
  plugins: [
      // by default this already have plugins packed with the generator for analyzer, hot module etc..
      // you can add your own here if you want
      // eg:
      // new CopyPlugin([
      //     {
      //         from: 'static/src/locales',
      //         to: path.join('static/build', 'locales'),
      //         ignore: '*.missing.json',
      //     },
      // ]),
  ],
  loaders: [
    // by default this already have babel, typescript, css, postcss, svg, fileloader
    // you can add your own loader here if you want..
    // eg:
    // {
    //   test: /\.(js|jsx|ts|tsx|mjs)$/,
    //   exclude: /node_modules/,
    //   loader: require.resolve('babel-loader'),
    // }
  ],
  env: {
    NODE_ENV: "production"
  }
});
```

If you require multiple bundles you can supply more than 1 entry in `input`. Files will be created in the `outDir` with names corresponding to the keys in your `input` object.

The following generator will create `static/build/js/frontend.js` and `static/build/js/admin.js`.

`config/webpack/index.js`

```js
const myWebpackGenerator = require('my-webpack-generator')

module.exports = myWebpackGenerator({
    input: {
        frontend: './static/src/ts/index.ts',
        admin: './static/src/ts/admin.ts',
    },
    outDir: './static/build/js',
    tsconfig: './tsconfig.dist.json',
    env: {
        NODE_ENV: 'production',
    },
})
```

If you require multiple bundles, but your source files do not both have the same parent directory, you will have to manually supply a `rootDir` option in order to use the root dir alias (`^`) e.g.

```js
{
  input: {
    frontend: './src/frontend/index.ts',
    admin: './src/admin/index.ts'
  },
  rootDir: './src'
}
```

If you require multiple generators to differentiate between client bundler and server bunder, you can add `isServer` flag.

```js
{
    isServer: true
}
```

### Browser support

Create a `.browserslistrc` file in the root of your project and add the following contents, adjusting as desired.

This file is used by webpack, and other tools such as autoprefixer to make our code compatible with the browsers we want to support.

`.browserslistrc`

```
last 10 Chrome versions
last 10 Firefox versions
last 10 Edge versions
last 10 iOS versions
last 10 Android versions
last 10 Opera versions
last 10 Safari versions
last 10 ExplorerMobile versions
Explorer >= 9
```

### TypeScript base config

Create a `tsconfig.json` in the root of the project and add the following contents, adjusting `include`, `paths`, and `typeRoots` as needed.

This will contain all of our base TypeScript config.

By default `allowJs` is set to `false`. If your project contains Javascript you should set this to `true`.

You may enable type checking on Javascript files by setting `checkJs` to `true`. This can be useful if migrating a Javascript project to TypeScript.

`allowSyntheticDefaultImports` and `esModuleInterop` allow us to import modules that don't have default exports as if they did, in TypeScript, so that we can be consistent across Javascript and TypeScript projects. E.g. `import React from 'react';` as opposed to `import * as React from 'react';`

`tsconfig.json`

<!-- ```json
{
    "compilerOptions": {
        "strict": true,
        "noImplicitAny": true,
        "pretty": true,
        "sourceMap": true,
        "skipLibCheck": true,
        "allowSyntheticDefaultImports": true,
        "esModuleInterop": true,
        "allowJs": false,
        "checkJs": false,
        "jsx": "react",
        "target": "es6",
        "moduleResolution": "node",
        "typeRoots": ["./node_modules/@types/", "./static/src/ts/types/"],
        "baseUrl": "./",
        "paths": {
            "^*": ["./static/src/ts*"]
        }
    },
    "include": ["./static/src/ts/"]
}
``` -->

<!-- ### TypeScript distribution config

Create a `tsconfig.dist.json` file in the root of your project and add the following contents, adjusting `exclude`, or replacing with `include` as needed.

This is necessary to allow us to build our source without also type checking our tests or other Javascript and TypeScript files in the project.

`tsconfig.dist.json`

```json
{
    "extends": "./tsconfig.json",
    "exclude": ["./static/src/ts/__tests__/", "./static/src/ts/__mocks__/"]
}
``` -->

### Build scripts

Add the following scripts to your `package.json`.

`package.json`

```json
{
    "scripts": {
        "start": "my-webpack-generator start",
        "build": "my-webpack-generator build"
    }
}
```

```bash
$ my-webpack-generator start
# start dev mode, by default the port will be 8500
# you can visit http://localhost:8500 to start working on your project

$ my-webpack-generator build
# bundle your project
```

> As for now, the generator script require 2 generators (client and server) to run the compilers..

## TODO:

[x] Scripts
[x] Multiple Compiler
[] Single Compiler
[] TypeScript distribution config
