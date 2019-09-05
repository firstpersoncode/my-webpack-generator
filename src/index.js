const { EnvironmentPlugin } = require("webpack")
const path = require("path")

const TerserPlugin = require("terser-webpack-plugin")
const nodeExternals = require("webpack-node-externals")

const createEntry = require("./createEntry")
const getRootDir = require("./getRootDir")
const validateOptions = require("./validateOptions")
const loaders = require("./loaders")
const resolvers = require("./resolvers")
const plugins = require("./plugins")

const baseClientConfig = {
  name: "client",
  target: "web",
  node: {
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty"
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        // TerserPlugin config is taken entirely from react-scripts
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true
          }
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: true
      })
    ],
    namedModules: true,
    noEmitOnErrors: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        }
      }
    }
  },
  stats: {
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkModules: false,
    children: false,
    colors: true,
    hash: false,
    modules: false,
    reasons: false,
    timings: true,
    version: false
  }
}

const baseServerConfig = {
  name: "server",
  target: "node",
  externals: [
    nodeExternals({
      // we still want imported css from external files to be bundled otherwise 3rd party packages
      // which require us to include their own css would not work properly
      whitelist: /\.css$/
    })
  ],
  stats: {
    assets: false,
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkModules: false,
    children: false,
    colors: true,
    hash: false,
    modules: false,
    performance: false,
    reasons: false,
    timings: true,
    version: false
  },
  node: {
    __dirname: false
  }
}

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
