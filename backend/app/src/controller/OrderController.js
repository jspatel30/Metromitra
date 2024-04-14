const { ObjectId } = require("mongodb")
const OrderModel = require("../model/OrderModel")

//addOrder
const addOrder = async(req,res) =>{
    try
    {
        const order = await OrderModel.create(req.body)
        if(order != null)
        {
            res.status(201).json({
                messagae:"Order Added",
                data:order,
                flag:1
            })
        }
        else
        {
            res.json({
                message:"Order not Added"
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

//getOrder
const getOrder = async(req,res) =>{
    try{
        const order = await OrderModel.find().populate("User").populate("Service")
        if(order != null)
        {
            res.status(200).json({
                message:"Order Retrieved",
                data:order,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"Order not Retrieved"
            })
        }
    }
    catch(error)
    {
        res.status(500).json({
            message:"Server Error in retrieving",
            error:error,
            flag:-1
        })
    }
}


//updateOrderById
const updateOrderById = async(req,res) =>{
    try
    {
        const orderId = req.params.id
        console.log("orderId... ",orderId)
        const updateOrderDetail = req.body 
        console.log("updateOrderDetail.... ",updateOrderDetail)
        const order = await OrderModel.findByIdAndUpdate(orderId,updateOrderDetail)
        if(order != null)
        {
            res.status(200).json({
                message:"Order updated Successfully",
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"Order Updation Failed",
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

//getOrderById
const getOrderById = async(req,res) =>{
    try
    {
        const orderId = req.params.id        
        const order = await OrderModel.findOne({ _id: orderId }).populate("User")//.populate("Service")
        if(order != null)
        {
            res.status(200).json({
                message:"Order found Successfully",
                data:order,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"Order Not Found",
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


const getOrderByServiceProviderId = async(req,res) =>{
    try
    {
        const serviceProviderId = req.params.id      
        console.log("id..",serviceProviderId)  
        const order = await OrderModel.find().populate("User")
        .populate({
            path: "Service",
            match: { ServiceProvider: serviceProviderId },
            select: '-image'
        })

        const filteredOrders = order.filter(order => order.Service !== null);

        if(filteredOrders != null)
        {
            res.status(200).json({
                message:"Order found Successfully",
                data:filteredOrders,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"Order Not Found",
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


//getOrderByServiceProviderId
const getOrderByServiceProviderIdForReview = async(req,res) =>{
    try
    {
        const Id = req.params.id        
      
        const orders = await OrderModel.find({ 
            $and: [
                { UserReview: { $ne: null } },
                { Stars: { $ne: null } }
            ]
        })
        .populate({
            path: "Service",
            match: { ServiceProvider: Id },
            select: '-image'
        })
        .populate("User");

        const order = orders.filter(order => order.Service !== null);
        // const count = order.length;
        // console.log("..............!",count)
        if(order.length > 0)
        {
            res.status(200).json({
                message:"Order found Successfully",
                data:order,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"Order Not Found",
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


//getOrderByUserId
const getOrderByUserId = async(req,res) =>{
    try
    {
        const Id = req.params.id        
        const order = await OrderModel.find({
            // User: Id, // Filter orders where the User matches the provided user ID
            ServiceProviderReview: { $ne: null }  
        })
        .populate({
            path:"User",
            match: { _id: Id }, 
        })
        .populate({
            path: "Service",
            select: '-image'
        })
        // const order = orders.filter(order => order.Service !== null);

        if(order.length > 0)
        {
            res.status(200).json({
                message:"Order found Successfully",
                data:order,
                flag:1
            })
        }
        else
        {
            res.status(200).json({
                message:"Order Not Found",
                data:[]
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


// getOrderByUserIdHistory
const getOrderByUserIdHistory = async(req,res) =>{
    try
    {
        const Id = req.params.id        
        const order = await OrderModel.find({User: Id})
        .populate("User")
        .populate({
            path: "Service",
            select: '-image'
        })
        // const order = orders.filter(order => order.Service !== null);

        if(order.length > 0)
        {
            res.status(200).json({
                message:"Order found Successfully",
                data:order,
                flag:1
            })
        }
        else
        {
            res.status(200).json({
                message:"Order Not Found",
                data:[]
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


//deleteAllOrder
const deleteAllOrder = async(req,res) =>{
    try
    {
        const deletedOrder = await OrderModel.deleteMany()    //findByIdAndDelete(req.params.id)
        if(deletedOrder != null)
        {
            res.status(200).json({
                message:"All Order deleted Succussfully",
                data:deletedOrder,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"Order not deleted.",
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


//deleteOrderById
const deleteOrderById = async(req,res) =>{
    try
    {
        const deletedOrder = await OrderModel.findByIdAndDelete(req.params.id)
        if(deletedOrder != null)
        {
            res.status(200).json({
                message:"Order deleted Successfully..!",
                data:deletedOrder,
                flag:1
            })
        }
        else
        {
            res.status(500).json({
                message:"Order deletion failed..Maybe Order not found..!",
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


//getOrderStatsByServiceId
const getOrderStatsByServiceId = async (req,res) => {

    try {
        // const serviceProviderId =  new ObjectId("65f9be4e6d76550bda7db1ef")
        const serviceProviderId = req.params.id
        // Query the database to get count of orders and sum of stars
        const result = await OrderModel.aggregate([
            {
                $match: {
                    Service: serviceProviderId,
                    Stars: { $ne: 0 }
                }
            },
            {
               $group: {
 		   _id: null,
		    count: { $sum: 1 },
		    sumStars: { $sum: "$Stars" },
  		    avgStars: { $avg: "$Stars" }
	   }

            }
        ]);

        if (result.length > 0) {
            // return {
                res.status(200).json({
                    count: result[0].count,
                    sumStars: result[0].sumStars,
                    avgStars: result[0].avgStars,
                    result
                    
                })
            // };
        } else {
            // return {
                res.status(400).json({
                count: 0,
                sumStars: 0,
		        avgStars:0,
                result
                })
            // };
        }
    } catch (error) {
        // return {
        //     error: error
        // };
        res.status(500).json({
            error: error
            })
    }
};




module.exports = {
    deleteOrderById,
    deleteAllOrder,
    getOrder,
    getOrderById,
    addOrder,
    updateOrderById,
    getOrderStatsByServiceId,
    getOrderByServiceProviderIdForReview,
    getOrderByUserId,
    getOrderByServiceProviderId,
    getOrderByUserIdHistory
}