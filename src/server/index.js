const path = require('path')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const manifestHelpers = require('express-manifest-helpers')
const errorHandler = require('./middleware/errorHandler')
const serverRenderer = require('./middleware/serverRenderer')
// const addStore = require('./middleware/addStore')
// const webhookVerification = require('./middleware/webhookVerification')
const app = express()

module.exports = (options) => {

    // Use Nginx or Apache to serve static assets in production or remove the if() around the following
    // lines to use the express.static middleware to serve assets for production (not recommended!)
    // if (process.env.NODE_ENV === 'development') {
    //     app.use(options.publicPath, express.static(path.join(options.buildClient, options.publicPath)))
    // }
    app.use(options.publicPath, express.static(path.join(options.buildClient, options.publicPath)))
    app.use(cors())

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    // app.get('/locales/refresh', webhookVerification, refreshTranslations)
    // // It's probably a good idea to serve these static assets with Nginx or Apache as well:
    // app.get('/locales/:locale/:ns.json', i18nextXhr)

    // app.use(addStore(options.store))

    const manifestPath = path.join(options.buildClient, options.publicPath)

    app.use(
        manifestHelpers.default({
            manifestPath: `${manifestPath}/manifest.json`,
        })
    )

    app.use(serverRenderer(options))

    app.use(errorHandler)

    return app
}
