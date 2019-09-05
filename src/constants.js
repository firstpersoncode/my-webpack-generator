exports.CWD = process.cwd()
exports.POLYFILLS = [
    require.resolve('core-js/stable'),
    require.resolve('regenerator-runtime/runtime'),
]
exports.MATCHES_LEADING_DOT = /^\./
