const helmetCtx = {}
const routerCtx = {}

const html = ({ css, helmetCtx, scripts, state, content }) => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    ${helmetCtx.helmet.base.toString()}
    ${helmetCtx.helmet.title.toString()}
    ${helmetCtx.helmet.meta.toString()}
    ${helmetCtx.helmet.link.toString()}
    ${helmetCtx.helmet.script.toString()}
    ${css
        .filter(Boolean)
        .map((href) => {
            return `<link href="${href}" rel="stylesheet" />`
        })
        .join('\n')}
  </head>
  <body>
    <div id="app">${content}</div>
    <script>
      window.__PRELOADED_STATE__ = ${state}
    </script>
    ${scripts
        .map((src) => {
            return `<script src="${src}"></script>`
        })
        .join('\n')}
  </body>
</html>
`

const serverRenderer = (options) => (req, res) => {
    const store = options.store
    const content = options.app({
        routerCtx,
        helmetCtx,
        store,
        location: req.url,
    })
    const state = JSON.stringify(store.getState())
    return res.send(
        html({
            css: [res.locals.assetPath('bundle.css'), res.locals.assetPath('vendor.css')],
            helmetCtx,
            scripts: [res.locals.assetPath('bundle.js'), res.locals.assetPath('vendor.js')],
            state,
            content,
        })
    )
}

module.exports = serverRenderer
