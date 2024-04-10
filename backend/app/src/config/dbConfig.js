const mongoose = require("mongoose")
require('dotenv').config()
const {MONGO_URI} = process.env

//database configuration
module.exports.getDbConnection = function () {
    mongoose.connect(MONGO_URI).then(() => {
        console.log("Database Connected Successfully")
    }).catch((err) => {
        console.log("Database Connection failed", err)
    })
}