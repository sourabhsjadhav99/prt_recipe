let express =require("express")
let dotenv = require("dotenv").config()
let port =process.env.PORT
let app = express()
let cors = require("cors")
require("./src/connectionAndSchemas/config")
let loginRoutes = require("./src/router/login")
let recipeRoutes = require("./src/router/recipe")
app.use(cors())

app.use("/images", express.static("uploads"))
app.use("/",loginRoutes)
app.use("/api", recipeRoutes)
app.listen(port, ()=>{
    console.log(`server listening at ${port}`)

})
module.exports =app

