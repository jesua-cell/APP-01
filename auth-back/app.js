const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const authenticate = require("./auth/authenticate")

require('dotenv').config()
app.use(cors())
app.use(express.json())

async function main(){
    await mongoose.connect(process.env.DB_CONNECTION_STRING)
    console.log("*** Conectado a MongoDB ***")
}

main().catch(console.error)


app.use('/api/signup', require("./routes/signup"))
app.use('/api/login', require("./routes/login"))
app.use('/api/user', authenticate, require("./routes/user"))
app.use('/api/todos', authenticate,require("./routes/todos"))
app.use('/api/refresh-Token', require("./routes/refreshToken"))
app.use('/api/signout', require("./routes/singout"))

const port = process.env.PORT || 3100

app.get('/', (req, res)=>{
    res.send('Hello Word')
})

app.listen(port, ()=>{
    console.log(`Server runing in:${port}`)
    console.log(`http://localhost:3100`)
})