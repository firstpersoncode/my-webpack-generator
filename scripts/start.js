const webpack = require('webpack')
const nodemon = require('nodemon')
const express = require('express')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const webpackConfig = require('../../../config/webpack')(process.env.NODE_ENV || 'development')
const { logMessage, compilerPromise } = require('./helpers')

const app = express()

const WEBPACK_PORT = 8501

const DEVSERVER_HOST = 'http://localhost'

const start = async () => {
    const [clientConfig, serverConfig] = webpackConfig
    clientConfig.entry.bundle = [
        `webpack-hot-middleware/client?path=${DEVSERVER_HOST}:${WEBPACK_PORT}/__webpack_hmr`,
        ...clientConfig.entry.bundle,
    ]

    clientConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json'
    clientConfig.output.hotUpdateChunkFilename = 'updates/[id].[hash].hot-update.js'

    const publicPath = clientConfig.output.publicPath

    clientConfig.output.publicPath = [`${DEVSERVER_HOST}:${WEBPACK_PORT}`, publicPath]
        .join('/')
        .replace(/([^:+])\/+/g, '$1/')

    serverConfig.output.publicPath = [`${DEVSERVER_HOST}:${WEBPACK_PORT}`, publicPath]
        .join('/')
        .replace(/([^:+])\/+/g, '$1/')

    const multiCompiler = webpack([clientConfig, serverConfig])

    const clientCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'client')
    const serverCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'server')

    const clientPromise = compilerPromise('client', clientCompiler)
    const serverPromise = compilerPromise('server', serverCompiler)

    const watchOptions = {
        ignored: /node_modules/,
        stats: clientConfig.stats,
    }

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*')
        return next()
    })

    app.use(
        webpackDevMiddleware(clientCompiler, {
            publicPath: clientConfig.output.publicPath,
            stats: clientConfig.stats,
            watchOptions,
        })
    )

    app.use(webpackHotMiddleware(clientCompiler))

    app.use('/static', express.static(clientConfig.output.path))

    app.listen(WEBPACK_PORT)
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    serverCompiler.watch(watchOptions, (error, stats) => {
        if (!error && !stats.hasErrors()) {
            console.log(stats.toString(serverConfig.stats))
            return
        }

        if (error) {
            logMessage(error, 'error')
        }

        if (stats.hasErrors()) {
            const info = stats.toJson()
            const errors = info.errors[0].split('\n')
            logMessage(errors[0], 'error')
            logMessage(errors[1], 'error')
            logMessage(errors[2], 'error')
        }
    })

    // wait until client and server is compiled
    try {
        await serverPromise
        await clientPromise
    } catch (error) {
        logMessage(error, 'error')
    }

    const script = nodemon({
        script: `${serverConfig.output.path}/server.js`,
        ignore: ['src', 'scripts', 'config', './*.*', 'build/client', '**/locales', '**/tmp'],
        delay: 200,
    })

    script.on('restart', () => {
        logMessage('Server side app has been restarted.', 'warning')
    })

    script.on('quit', () => {
        console.log('Process ended')
        process.exit()
    })

    script.on('error', () => {
        logMessage('An error occured. Exiting', 'error')
        process.exit(1)
    })
}

start()
