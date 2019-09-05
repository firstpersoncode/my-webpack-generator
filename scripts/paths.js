const path = require('path')
const fs = require('fs')

// eslint-disable-next-line security/detect-non-literal-fs-filename
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

const paths = {
    BUILD_: resolveApp('build'),
    BUILD_CLIENT: resolveApp('build/client'),
    BUILD_SERVER: resolveApp('build/server'),
    SRC_: resolveApp('src'),
    SRC_CLIENT: resolveApp('src/client'),
    SRC_SERVER: resolveApp('src/server'),
    SRC_APP: resolveApp('src/app'),
    PUBLIC_PATH: '/',
}

paths.resolveModules = [
    paths.SRC_CLIENT,
    paths.SRC_SERVER,
    paths.SRC_APP,
    paths.SRC_,
    'node_modules',
]

module.exports = paths
