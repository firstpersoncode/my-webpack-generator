const constants = require("./constants")

module.exports = options => {
  const joinedExtensions = options.rawFileExtensions
    .map(extension => {
      return extension.trim().replace(constants.MATCHES_LEADING_DOT, "")
    })
    .join("|")

  return new RegExp(`\\.(?:${joinedExtensions})\$`)
}
