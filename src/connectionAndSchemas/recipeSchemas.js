let mongoose = require("mongoose")
let receipeschemas = mongoose.Schema({
    title: { type: String },
    author: { type: String },
    image: { type: String },
    ingradients: { type: String },
    directions: { type: String }
})
module.exports= mongoose.model("recipe", receipeschemas)