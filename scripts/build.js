const webpack = require('webpack')
const chalk = require('chalk')

const webpackConfig = require('./config')(process.env.NODE_ENV || 'production')
const { logMessage, compilerPromise } = require('./helpers')

const single = async () => {
    const compiler = webpack(webpackConfig)
    const configPromise = compilerPromise('config', compiler)
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    compiler.watch({}, (error, stats) => {
        if (!error && !stats.hasErrors()) {
            // console.log(stats.toString(webpackConfig.stats))
            return
        }
        console.error(chalk.red(stats.compilation.errors))
    })
    try {
        await configPromise
        logMessage('Done!', 'info')
        process.exit(0)
    } catch (error) {
        logMessage(error, 'error')
        process.exit(1)
    }
}

const multi = async () => {
    const [clientConfig, serverConfig] = webpackConfig
    const multiCompiler = webpack([clientConfig, serverConfig])

    const clientCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'client')
    const serverCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'server')

    const clientPromise = compilerPromise('client', clientCompiler)
    const serverPromise = compilerPromise('server', serverCompiler)
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    serverCompiler.watch({}, (error, stats) => {
        if (!error && !stats.hasErrors()) {
            // console.log(stats.toString(serverConfig.stats))
            return
        }
        console.error(chalk.red(stats.compilation.errors))
    })
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    clientCompiler.watch({}, (error, stats) => {
        if (!error && !stats.hasErrors()) {
            // console.log(stats.toString(clientConfig.stats))
            return
        }
        console.error(chalk.red(stats.compilation.errors))
    })

    // wait until client and server is compiled
    try {
        await serverPromise
        await clientPromise
        logMessage('Done!', 'info')
        process.exit(0)
    } catch (error) {
        logMessage(error, 'error')
        process.exit(1)
    }
}

const build = () => {
    if (Array.isArray(webpackConfig) && webpackConfig.length) {
        multi()
    } else {
        single()
    }
}

build()
