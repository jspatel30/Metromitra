const OrderListModel = require("../model/OrderListModel")
const OrderModel = require("../model/OrderModel")
const ServiceProviderModel = require("../model/ServiceProviderModel")

//addOrderList
const addOrderList = async(req,res) =>{

    const DataList = req.body.OrderList;
    console.log(req.body);
    const orderID = req.body.orderId;
    try
    {
        var orderList;
        DataList.forEach( async (element) => {
            const Data = {
                "ItemName": element.ItemList,
                "Price": element.Price,
                "Order":orderID
            }
            orderList = await OrderListModel.create(Data)
        })


            res.status(201).json({
                messagae:"OrderList Added",
                flag:1
            })
     
  }
    catch(error)
    {
        res.status(500).json({
            message:"Server Error",
            error:error,
            flag:-1
        })
    }
}

//getOrderList
const getOrderList = async(req,res) =>{
    try{
        const orderList = await OrderListModel.find().populate("Order")
        if(orderList != null)
        {
            res.status(200).json({
                message:"Order List Retrieved",
                data:orderList,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"Order List not Retrieved"
            })
        }
    }
    catch(error)
    {
        res.status(500).json({
            message:"Server Error",
            error:error,
            flag:-1
        })
    }
}

//getOrderListByOrderId
const getOrderListByOrderId = async(req,res) =>{
    try
    {
        const orderId = req.params.id        
        const orderList = await OrderListModel.find({ Order: orderId }).populate("Order")
        const order = await OrderModel.findOne({_id:orderId}).populate("Service")
        const ServiceProviderId = order.Service.ServiceProvider
        const serviceProvider = await ServiceProviderModel.findById({_id:ServiceProviderId})
        if(orderList != [])
        {
            res.status(200).json({
                message:"OrderList found Successfully",
                orderList:orderList,
                order:order,
                ServiceProviderName:serviceProvider.name,
                flag:1,
                // orderID : orderId
            })
        }
        else
        {
            res.status(400).json({
                message:"OrderList Not Found",
                orderID : orderId
            })
        }
    }
    catch(error)
    {
        res.status(500).json({
            message:"Server Error",
            flag:-1,
            error:error
        })
    }
}



//deleteAllOrderList
const deleteAllOrderList = async(req,res) =>{
    try
    {
        const deletedOrder = await OrderListModel.deleteMany()    //findByIdAndDelete(req.params.id)
        if(deletedOrder != null)
        {
            res.status(200).json({
                message:"All Order List deleted Succussfully",
                data:deletedOrder,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"Order List not deleted.",
                //Ask Sir.. What to pass in flag when role is not found...
            })
        }
    }
    catch(error)
    {
        res.status(500).json({
            message:"Server Error",
            flag:-1
        })
    }
}


module.exports = {
    addOrderList,
    getOrderList,
    deleteAllOrderList,
    getOrderListByOrderId
}