const { jsonResponde } = require("../lib/jsonResponse");
const getTokenFromHeader = require("./getTokenFromHeader");
const { verifyAccessToken } = require("./verifyTokens");

function authenticate(req, res, next) {
    const token = getTokenFromHeader(req.headers)

    if (token) {
        const decoded = verifyAccessToken(token)
        if (decoded) {
            req.user = { ...decoded.user }
            next()
        } else {
            res.status(401).json(jsonResponde(401, {
                message: "No Token Provide"
            }))
        }
    } else {
        res.status(401).json(jsonResponde(401, {
            message: "No Token Provide"
        }))
    }
}

module.exports = authenticate