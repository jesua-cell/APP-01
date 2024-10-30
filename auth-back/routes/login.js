const { jsonResponde } = require("../lib/jsonResponse")
const router = require("express").Router()
const User = require("../schema/user")
const getUserInfo = require("../lib/getUserInfo")

router.post("/", async (req, res) => {
    const { username, password } = req.body
    
    if (!!!username || !!!password) {
        return res.status(400).json(
            jsonResponde(400, {
                error: "Archivos Requeridos"
            })
        )
    }

    const user = await User.findOne({ username })
    if (user) {
        const correctPassword = await user.comparePassword(password, user.password)

        if (correctPassword) {
            //Autenticar usuario
            const accessToken = user.createAccessToken()
            const refreshToken =  await user.createRefreshToken()
            return res.status(200).json(jsonResponde(200, { user: getUserInfo(user), accessToken, refreshToken }))
            res.send("signout")
        } else {
            res.status(400).json(
                jsonResponde(400, {
                    error: "Usuario o Contraseña Incorrectos"
                })
            )
        }

    } else {
        return res.status(400).json(
            jsonResponde(400, {
                error: "User not Found"
            })
        )
    }
})

module.exports = router