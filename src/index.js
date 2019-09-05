const { EnvironmentPlugin } = require("webpack")
const path = require("path")
const CircularDependencyPlugin = require("circular-dependency-plugin")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")

const constants = require("./constants")

const createEntry = require("./createEntry")
const createFileExtensionRegex = require("./createFileExtensionRegex")
const getIncludeDirs = require("./getIncludeDirs")
const getRootDir = require("./getRootDir")
const validateOptions = require("./validateOptions")

module.exports = options => {
  validateOptions(options)

  const entry = createEntry(options)
  const rootDir = getRootDir(options)
  const includeDirs = getIncludeDirs(options)
  const outFile =
    typeof options.input === "string" ? "bundle.js" : "[name]-bundle.js"
  const outDir = path.resolve(constants.CWD, options.outDir)

  const rules = [
    (options.rawFileExtensions || []).length
      ? {
          test: createFileExtensionRegex(options),
          use: require.resolve("raw-loader")
        }
      : null,
    {
      test: /\.[tj]sx?$/,
      use: [
        {
          loader: require.resolve("babel-loader"),
          options: {
            babelrc: false,
            presets: [
              [
                require.resolve("@babel/preset-env"),
                {
                  modules: false,
                  useBuiltIns: "usage"
                }
              ]
            ]
          }
        },
        {
          loader: require.resolve("ts-loader"),
          options: {
            transpileOnly: true,
            configFile: path.resolve(constants.CWD, options.tsconfig)
          }
        }
      ],
      include: includeDirs
    }
  ].filter(rule => Boolean(rule))

  return {
    performance: {
      hints: false
    },
    stats: {
      timings: true
    },
    devtool: "source-map",
    entry,
    output: {
      filename: outFile,
      path: outDir
    },
    module: {
      rules
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      alias: {
        "^": rootDir
      }
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin(),
      new CircularDependencyPlugin({
        failOnError: true,
        exclude: /node_modules/,
        cwd: constants.CWD
      }),
      new EnvironmentPlugin(options.env || {})
    ]
  }
}
