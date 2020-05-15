const logoutRouter = require('express').Router()

logoutRouter.get('/', (req, res) => {
  const logoutUrl = req.headers.shib_logout_url || req.headers.logout_url
  if (logoutUrl) {
    return res
      .status(200)
      .send({ logoutUrl: `${logoutUrl}` })
      .end()
  } else {
    return res.status(500).end()
  }
})

module.exports = logoutRouter