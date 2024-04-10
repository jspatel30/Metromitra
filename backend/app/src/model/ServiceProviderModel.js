const mongoose = require("mongoose")
const Schema = mongoose.Schema

const serviceProviderSchema = new Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    phone:{
        type:Number
    },
    role:{
        type:Schema.Types.ObjectId,
        ref:"Role"
    }
})

module.exports = mongoose.model("ServiceProvider",serviceProviderSchema)