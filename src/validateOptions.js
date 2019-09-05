module.exports = (options) => {
    if (!options || typeof options !== 'object' || Array.isArray(options)) {
        throw new Error('Invalid config options - must be an object')
    }

    if (!('mode' in options)) {
        throw new Error('No "mode" in config options')
    } else if (!['development', 'production'].includes(options.mode)) {
        throw new Error('"mode" option is invalid')
    }

    if (!('input' in options)) {
        throw new Error('No "input" in config options')
    }

    if (
        !options.input ||
        (typeof options.input !== 'string' && typeof options.input !== 'object') ||
        Array.isArray(options.input)
    ) {
        throw new Error('Invalid "input" option - must be a string or keyed object')
    }

    if (typeof options.input === 'object' && !Object.keys(options.input).length) {
        throw new Error('No keys in "input" option')
    }

    if (!('outDir' in options)) {
        throw new Error('No "outDir" in config options')
    }

    if (!options.outDir || typeof options.outDir !== 'string') {
        throw new Error('Invalid "outDir" option - must be a string')
    }

    if (!('tsconfig' in options)) {
        throw new Error('No "tsconfig" in config options')
    }

    if (!options.tsconfig || typeof options.tsconfig !== 'string') {
        throw new Error('Invalid "tsconfig" in config options - must be a string')
    }

    if (
        (typeof options.env !== 'object' && typeof options.env !== 'undefined') ||
        (typeof options.env === 'object' && !options.env) ||
        Array.isArray(options.env)
    ) {
        throw new Error('Invalid "env" option - must be a keyed object')
    }

    if (
        !(
            Array.isArray(options.rawFileExtensions) ||
            typeof options.rawFileExtensions === 'undefined'
        )
    ) {
        throw new Error('Invalid "rawFileExtensions" option - must be an array')
    }

    if (typeof options.rootDir !== 'string' && typeof options.rootDir !== 'undefined') {
        throw new Error('Invalid "rootDir" options - must be a string')
    }

    if (typeof options.rootDir === 'string' && !options.rootDir) {
        throw new Error('Invalid "rootDir" option - cannot be an empty string')
    }

    if (
        typeof options.include !== 'undefined' &&
        !(typeof options.include === 'string' || Array.isArray(options.include))
    ) {
        throw new Error('Invalid "include" option - must be a string or array')
    }

    if (typeof options.include === 'string' && !options.include) {
        throw new Error('Invalid "include" option - cannot be an empty string')
    }

    if (Array.isArray(options.include) && !options.include.length) {
        throw new Error('Invalid "include" option - cannot be an empty array')
    }
}
