const webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const WriteFileWebpackPlugin = require('write-file-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const constants = require('./constants')

const { EnvironmentPlugin, DefinePlugin, IgnorePlugin } = webpack

const shared = (options) =>
    [
        new MiniCssExtractPlugin({
            filename: options.mode === 'development' ? '[name].css' : '[name].[contenthash].css',
            chunkFilename: options.mode === 'development' ? '[id].css' : '[id].[contenthash].css',
        }),
        new ForkTsCheckerWebpackPlugin(),
        new CircularDependencyPlugin({
            failOnError: true,
            exclude: /node_modules/,
            cwd: constants.CWD,
        }),
        new EnvironmentPlugin(options.env || {}),
        ...(options.mode === 'development'
            ? [new WriteFileWebpackPlugin(), new webpack.HotModuleReplacementPlugin()]
            : []),
        ...(options.plugins && options.plugins.length ? options.plugins : []),
    ].filter(Boolean)

const client = (options) =>
    [
        new DefinePlugin({
            __SERVER__: 'false',
            __BROWSER__: 'true',
        }),
        new CaseSensitivePathsPlugin(),
        new IgnorePlugin(/^\.\/locale$/, /moment$/),
        new ManifestPlugin({ fileName: 'manifest.json' }),
        ...(options.mode === 'development'
            ? [
                  new BundleAnalyzerPlugin({
                      port: 8502,
                  }),
              ]
            : []),
    ].filter(Boolean)

const server = [
    new DefinePlugin({
        __SERVER__: 'true',
        __BROWSER__: 'false',
    }),
].filter(Boolean)

module.exports = {
    shared,
    client,
    server,
}
