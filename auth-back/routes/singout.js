const getTokenFromHeader = require("../auth/getTokenFromHeader")
const Token = require("../schema/token")
const { jsonResponde } = require("../lib/jsonResponse")
const router = require("express").Router()

router.delete("/", async (req, res) => {

    try {
        const refreshToken = getTokenFromHeader(req.headers)

        if (refreshToken) {
            await Token.findOneAndDelete({ Token: refreshToken })
            res.status(200).json(jsonResponde(200, { message: "Token deleted" }))
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(jsonResponde(500, { message: "Server Error" }))
    }

})


module.exports = router