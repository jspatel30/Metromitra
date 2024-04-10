const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SubCategorySchema = new Schema({
    SubCategoryName:{
        type:String
    },
    Category:{
        type:Schema.Types.ObjectId,
        ref:"Category"
    },   
 
})

module.exports = mongoose.model("SubCategory",SubCategorySchema)