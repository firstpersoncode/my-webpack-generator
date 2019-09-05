const path = require("path")
const webpack = require("webpack")
const ManifestPlugin = require("webpack-manifest-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin")
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin")
const CircularDependencyPlugin = require("circular-dependency-plugin")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")

// const paths = require('../../utils/paths')
// const { clientOnly } = require('../../utils/helpers')

// const env = require('../env')()

const constants = require("./constants")

const { EnvironmentPlugin, DefinePlugin, IgnorePlugin } = webpack

const shared = options =>
  [
    new MiniCssExtractPlugin({
      filename:
        options.env && options.env.NODE_ENV === "development"
          ? "[name].css"
          : "[name].[contenthash].css",
      chunkFilename:
        options.env && options.env.NODE_ENV === "development"
          ? "[id].css"
          : "[id].[contenthash].css"
    }),
    new ForkTsCheckerWebpackPlugin(),
    new CircularDependencyPlugin({
      failOnError: true,
      exclude: /node_modules/,
      cwd: constants.CWD
    }),
    new EnvironmentPlugin(options.env || {}),
    ...(options.plugins && options.plugins.length ? options.plugins : [])
  ].filter(Boolean)

const client = [
  new DefinePlugin({
    __SERVER__: "false",
    __BROWSER__: "true"
  }),
  new CaseSensitivePathsPlugin(),
  new IgnorePlugin(/^\.\/locale$/, /moment$/),
  new ManifestPlugin({ fileName: "manifest.json" })
].filter(Boolean)

const server = [
  new DefinePlugin({
    __SERVER__: "true",
    __BROWSER__: "false"
  })
].filter(Boolean)

module.exports = {
  shared,
  client,
  server
}
