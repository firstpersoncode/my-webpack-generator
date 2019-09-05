const path = require("path")

const createEntry = require("./createEntry")
const getRootDir = require("./getRootDir")
const validateOptions = require("./validateOptions")
const loaders = require("./loaders")
const resolvers = require("./resolvers")
const plugins = require("./plugins")

const baseClientConfig = require('./baseClientConfig')
const baseServerConfig = require('./baseServerConfig')

module.exports = options => {
  validateOptions(options)

  const entry = createEntry(options)
  const rootDir = getRootDir(options)
  const outFile = typeof options.input === "string" ? "bundle.js" : "[name].js"
  const outDir = path.resolve(constants.CWD, options.outDir)
  const output = {
    path: outDir,
    filename: outFile,
    publicPath: options.publicPath,
    ...(options.isServer
      ? {}
      : {
          chunkFilename: "[name].[chunkhash:8].chunk.js"
        })
  }

  return {
    ...(options.isServer ? baseServerConfig : baseClientConfig),
    performance: {
      hints: false
    },
    stats: {
      timings: true
    },
    // devtool: "source-map",
    entry,
    output,
    module: {
      rules: options.isServer
        ? loaders.server(!options.omitSourceMap)
        : loaders.client(!options.omitSourceMap)
    },
    resolve: resolvers(options, rootDir),
    plugins: [
      ...plugins.shared(options),
      ...(options.isServer ? plugins.server : plugins.client)
    ]
  }
}
