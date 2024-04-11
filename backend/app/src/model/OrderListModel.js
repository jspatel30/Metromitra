const mongoose = require("mongoose")
const Schema = mongoose.Schema

const OrderListSchema = new Schema({

    ItemName: {
        type: String
    },
    Price: {
        type: String
    },
    Order: {
        type: Schema.Types.ObjectId,
        ref: "Orders"
    }
})


module.exports = mongoose.model("OrderList",OrderListSchema)
