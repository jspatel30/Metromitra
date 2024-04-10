const router = require("express").Router()
const CategoryController = require("../controller/CategoryController")

router.get("/getCategory",CategoryController.getCategory)
router.post("/addCategory",CategoryController.addCategory)
router.put("/updateCategoryById/:id",CategoryController.updateCategoryById)
router.delete("/deleteCategoryById/:id",CategoryController.deleteCategoryById)

module.exports = router