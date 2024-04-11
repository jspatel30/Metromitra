const router = require("express").Router()
const OrderListController = require("../controller/OrderListController")

router.get("/getOrderList",OrderListController.getOrderList)
router.post("/addOrderList",OrderListController.addOrderList)
router.get("/getOrderListByOrderId/:id",OrderListController.getOrderListByOrderId)
router.delete("/deleteAllOrderList",OrderListController.deleteAllOrderList)

module.exports = router