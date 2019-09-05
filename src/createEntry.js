const path = require('path')
const constants = require('./constants')

module.exports = (options) => {
    if (typeof options.input === 'string') {
        return constants.POLYFILLS.concat(path.resolve(constants.CWD, options.input))
    }

    const entry = {}

    Object.keys(options.input).forEach((key) => {
        // eslint-disable-next-line security/detect-object-injection
        entry[key] = constants.POLYFILLS.concat(path.resolve(constants.CWD, options.input[key]))
    })

    return entry
}
