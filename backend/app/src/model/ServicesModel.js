//service Provider ID
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const serviceSchema = new Schema({
    ServiceName:{
        type:String
    },
    Fees:{
        type:Number
    },
    Area:{
        type:String
    },
    City:{
        type:String
    },
    Minimum:{
        type:String
    },
    Maximum:{
        type:String
    },
    State:{
        type:String
    },
    image:{
        type: Buffer
    },
    Status:{
        type:Number,
        default:1   //1-To show service...0- To Unshow(delete) Service
    },
    ServiceProvider:{
        type:Schema.Types.ObjectId,
        ref:"ServiceProvider"
    }
   
})

module.exports = mongoose.model("Service",serviceSchema)