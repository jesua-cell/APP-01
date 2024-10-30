const jwc = require("jsonwebtoken")

function verifyAccessToken(token) {
    return jwc.verify(token, process.env.ACCES_TOKEN_SECRET)
}

function verifyRefreshToken(token) {
    return jwc.verify(token, process.env.REFRESH_TOKEN_SECRET)
}

module.exports = { verifyAccessToken, verifyRefreshToken }