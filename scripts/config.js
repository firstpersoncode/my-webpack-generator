const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const myWebpackGenerator = require('../src')

const paths = require('./paths')

const sharedConfig = {
    resolve: {
        ext: ['.js', '.mjs', '.json', '.jsx', '.ts', '.tsx', '.css'],
        modules: paths.resolveModules,
    },
    publicPath: paths.PUBLIC_PATH,
    tsconfig: '../../tsconfig.json',
    env: {
        NODE_ENV: process.env.NODE_ENV,
    },
}

const clientConfig = {
    input: {
        bundle: path.resolve(paths.SRC_CLIENT, 'index.tsx'),
    },
    // rootDir: paths.SRC_,
    outDir: paths.BUILD_CLIENT,
}

const serverConfig = {
    isServer: true,
    input: {
        server: path.resolve(paths.SRC_SERVER, 'index.ts'),
    },
    // rootDir: paths.SRC_,
    outDir: paths.BUILD_SERVER,
    plugins: [
        new CopyPlugin([
            {
                from: paths.LOCALES,
                to: path.join(paths.BUILD_SERVER, 'locales'),
                ignore: '*.missing.json',
            },
        ]),
    ],
}

module.exports = (env = 'production') => {
    if (env === 'development' || env === 'dev') {
        process.env.NODE_ENV = 'development'

        // return [require('./client.dev'), require('./server.dev')]
        return [
            myWebpackGenerator({
                mode: 'development',
                ...sharedConfig,
                ...clientConfig,
            }),
            myWebpackGenerator({
                mode: 'development',
                ...sharedConfig,
                ...serverConfig,
            }),
        ]
    }

    process.env.NODE_ENV = 'production'
    // return [require('./client.prod'), require('./server.prod')]
    return [
        myWebpackGenerator({
            mode: 'production',
            omitSourceCode: true,
            ...sharedConfig,
            ...clientConfig,
        }),
        myWebpackGenerator({
            mode: 'production',
            omitSourceCode: true,
            ...sharedConfig,
            ...serverConfig,
        }),
    ]
}
