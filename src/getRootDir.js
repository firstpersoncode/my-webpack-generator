const path = require('path')
const constants = require('./constants')

module.exports = (options) => {
    if (typeof options.rootDir === 'string') {
        return path.resolve(constants.CWD, options.rootDir)
    }

    if (typeof options.input === 'string') {
        return path.dirname(path.resolve(constants.CWD, options.input))
    }

    const dirs = []

    Object.keys(options.input).forEach((key) => {
        // eslint-disable-next-line security/detect-object-injection
        const dir = path.dirname(path.resolve(constants.CWD, options.input[key]))

        if (dirs.length && !dirs.includes(dir)) {
            throw new Error(
                'More than one possible root directory - please specify a "rootDir" option'
            )
        }

        dirs.push(dir)
    })

    return dirs[0]
}
