const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TypeSchema = new Schema({
    typeName:{
        type:String
    }
})

module.exports = mongoose.model("Type",TypeSchema)