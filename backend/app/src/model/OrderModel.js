const mongoose = require("mongoose")
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    Date:{
        type:Date
    },
    Time:{
        type:String
    },
    Status:{
        type:String
    },
    Work:{
        type:String
    },
    UserReview:{
        type:String
    },
    ServiceProviderReview:{
        type:String
    },
    Address:{ //User address   
        type:String
    },
    Stars:
    {
        type:Number,
        default:0
    },
    User:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    Service:{
        type:Schema.Types.ObjectId,
        ref:"Service"
    },
    
})

module.exports = mongoose.model("Orders",OrderSchema)