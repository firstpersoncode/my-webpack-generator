// This middleware is useful in cases when you want to add webhooks that
// call certain endpoints in your server side build. Add a WEBHOOK_TOKEN
// env variable and use this middleware to protect against unwanted requests.
// You will need to add ?webhookToken=[token] to your webhook's url then.
module.exports = (token) => (req, res, next) => {
    if (req.query.webhookToken !== token) {
        return res.sendStatus(403)
    }

    return next()
}
