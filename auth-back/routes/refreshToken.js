const { generateAccesToken, verifyRefreshToken } = require("../auth/generateTokems")
const getTokenFromHeader = require("../auth/getTokenFromHeader")
const { jsonResponde } = require("../lib/jsonResponse")
const Token = require("../schema/token")


const router = require("express").Router()

router.post("/", async (req, res) => {

    const refreshToken = getTokenFromHeader(req.headers)

    if (refreshToken) {
        try {
            const found = await Token.findOne({ token: refreshToken })
            if (!found) {
                return res.status(401).send(jsonResponde(401, { error: "No Autorizado" }))
            }

            const payload = verifyRefreshToken(found.token)
            if (payload) {
                const accessToken = generateAccesToken(payload.user)
                return res.status(200).json(jsonResponde(200, { accessToken }))
            } else {
                return res.status(401).send(jsonResponde(401, { error: "No Autorizado" }))
            }
        } catch (error) {
            return res.status(401).send(jsonResponde(401, { error: "No Autorizado" }))
        }
    } else {
        res.status(401).send(jsonResponde(401, { error: "No autorizado" }))
    }

    res.send("Refresh Token")
})

module.exports = router