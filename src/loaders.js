const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/

// temporary wrapper function around getCSSModuleLocalIdent until this issue is resolved:
// https://github.com/webpack-contrib/css-loader/pull/965
const getLocalIdentWorkaround = (context, localIdentName, localName, options) => {
    if (options && options.context === null) {
        options.context = undefined
    }
    return getCSSModuleLocalIdent(context, localIdentName, localName, options)
}

const babelLoader = (mode) => ({
    test: /\.(js|jsx|ts|tsx|mjs)$/,
    exclude: /node_modules/,
    loader: require.resolve('babel-loader'),
    options: {
        plugins: [
            [
                require.resolve('babel-plugin-named-asset-import'),
                {
                    loaderMap: {
                        svg: {
                            ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
                        },
                    },
                },
            ],
        ],
        cacheDirectory: true,
        cacheCompression: mode === 'production',
        compact: mode === 'production',
    },
})

const cssModuleLoaderClient = (generateSourceMap) => ({
    test: cssModuleRegex,
    use: [
        require.resolve('css-hot-loader'),
        MiniCssExtractPlugin.loader,
        {
            loader: require.resolve('css-loader'),
            options: {
                localsConvention: 'camelCase',
                modules: {
                    // getLocalIdent: getCSSModuleLocalIdent,
                    getLocalIdent: getLocalIdentWorkaround,
                },
                importLoaders: 1,
                sourceMap: generateSourceMap,
                // localIdentName: '[name]__[local]--[hash:base64:5]',
                // getLocalIdent: getCSSModuleLocalIdent,
            },
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                sourceMap: generateSourceMap,
            },
        },
    ],
})

const cssLoaderClient = (generateSourceMap) => ({
    test: cssRegex,
    exclude: cssModuleRegex,
    use: [
        require.resolve('css-hot-loader'),
        MiniCssExtractPlugin.loader,
        require.resolve('css-loader'),
        {
            loader: require.resolve('postcss-loader'),
            options: {
                sourceMap: generateSourceMap,
            },
        },
    ],
})

const cssModuleLoaderServer = (generateSourceMap) => ({
    test: cssModuleRegex,
    use: [
        {
            loader: require.resolve('css-loader'),
            options: {
                onlyLocals: true,
                localsConvention: 'camelCase',
                importLoaders: 1,
                modules: {
                    // getLocalIdent: getCSSModuleLocalIdent,
                    getLocalIdent: getLocalIdentWorkaround,
                },
            },
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                sourceMap: generateSourceMap,
            },
        },
    ],
})

const cssLoaderServer = {
    test: cssRegex,
    exclude: cssModuleRegex,
    use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')],
}

const urlLoaderClient = {
    test: /\.(png|jpe?g|gif|svg)$/,
    loader: require.resolve('url-loader'),
    options: {
        limit: 2048,
        name: 'assets/[name].[hash:8].[ext]',
    },
}

const urlLoaderServer = {
    ...urlLoaderClient,
    options: {
        ...urlLoaderClient.options,
        emitFile: false,
    },
}

const fileLoaderClient = {
    exclude: [/\.(js|jsx|ts|tsx|css|mjs|html|ejs|json)$/],
    use: [
        {
            loader: require.resolve('file-loader'),
            options: {
                name: 'assets/[name].[hash:8].[ext]',
            },
        },
    ],
}

const fileLoaderServer = {
    exclude: [/\.(js|tsx|ts|tsx|css|mjs|html|ejs|json)$/],
    use: [
        {
            loader: require.resolve('file-loader'),
            options: {
                name: 'assets/[name].[hash:8].[ext]',
                emitFile: false,
            },
        },
    ],
}

const client = (mode, generateSourceMap) => [
    {
        oneOf: [
            babelLoader(mode),
            cssModuleLoaderClient(generateSourceMap),
            cssLoaderClient(generateSourceMap),
            urlLoaderClient,
            fileLoaderClient,
        ],
    },
]
const server = (mode, generateSourceMap) => [
    {
        oneOf: [
            babelLoader(mode),
            cssModuleLoaderServer(generateSourceMap),
            cssLoaderServer,
            urlLoaderServer,
            fileLoaderServer,
        ],
    },
]

module.exports = {
    client,
    server,
}
