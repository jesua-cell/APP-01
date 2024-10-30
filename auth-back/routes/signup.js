const { jsonResponde } = require("../lib/jsonResponse")
const router = require("express").Router()
const User = require("../schema/user")

router.post("/", async (req, res) => {
    const { username, name, password } = req.body

    if (!!!username || !!!name || !!!password) {
        return res.status(400).json(
            jsonResponde(400, {
                error: "Archivos Requeridos"
            })
        )
    }
    //Crear usuario en BD  

    try {
        const user = new User()
        const exists = await user.usernameExist(username)

        if (exists) {
            return res.status(400).json(
                jsonResponde(400, {
                    error: 'Ya existe este Usuario'
                })
            )
        }

        const newUser = new User({ username, name, password })

        newUser.save()
            .then(() => {
                res.status(200).json(jsonResponde(200, { message: 'Usuario Creado' }))
            })
            .catch(err => {
                res.status(500).json(jsonResponde(500, { error: 'Error al crear usuario' }))
            });
    } catch (error) {
        res.status(500).json(
            jsonResponde(500, {
                error: 'Error en la creacion del Usuario'
            })
        )
    }
})

module.exports = router