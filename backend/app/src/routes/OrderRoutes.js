const routes = require("express").Router()
const OrderController = require("../controller/OrderController")

routes.get("/getOrder",OrderController.getOrder)
routes.get("/getOrderById/:id",OrderController.getOrderById)
routes.post("/addOrder",OrderController.addOrder)
routes.delete("/deleteAllOrder",OrderController.deleteAllOrder)
routes.delete("deleteOrderById/:id",OrderController.deleteOrderById)
routes.put("/updateOrderById/:id",OrderController.updateOrderById)
routes.get("/getOrderByServiceProviderIdForReview/:id",OrderController.getOrderByServiceProviderIdForReview)
routes.get("/getOrderByUserId/:id",OrderController.getOrderByUserId)
routes.post("/getAvgStar/:id",OrderController.getOrderStatsByServiceId)

routes.get("/getOrderByUserIdHistory/:id",OrderController.getOrderByUserIdHistory)
routes.get("/getOrderByServiceProviderId/:id",OrderController.getOrderByServiceProviderId)

module.exports = routes