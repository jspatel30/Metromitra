const router = require("express").Router()
const TypeController = require("../controller/TypeController")

router.get("/getType",TypeController.getType)
router.post("/addType",TypeController.addType)
router.delete("/deleteTypeById/:id",TypeController.deleteTypeById)
router.put("/updateTypeById/:id",TypeController.updateTypeById)

module.exports = router