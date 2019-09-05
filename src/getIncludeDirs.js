const path = require("path")
const constants = require("./constants")

module.exports = options => {
  const includes = []
    .concat(options.include || [])
    .map(include => path.resolve(constants.CWD, include))

  if (typeof options.input === "string") {
    return includes.concat(
      path.dirname(path.resolve(constants.CWD, options.input))
    )
  }

  const dirs = []

  Object.keys(options.input).forEach(key => {
    const dir = path.dirname(path.resolve(constants.CWD, options.input[key]))

    if (dirs.indexOf(dir) < 0) {
      dirs.push(dir)
    }
  })

  return includes.concat(dirs)
}
