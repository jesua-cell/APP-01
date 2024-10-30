const jwt = require("jsonwebtoken")

function sign(payload, inAccesToken) {
    return jwt.sign(
        payload,
        inAccesToken
            ? process.env.ACCES_TOKEN_SECRET
            : process.env.REFRESH_TOKEN_SECRET,
        {
            algorithm: "HS256",
            expiresIn: 3600
        }
    )
}

function generateAccesToken(user) {
    return sign({ user }, true)
}

function generateRefreshToken(user) {
    return sign({ user }, false)
}

module.exports = { generateAccesToken, generateRefreshToken }