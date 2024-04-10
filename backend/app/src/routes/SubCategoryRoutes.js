const router = require("express").Router()
const SubCategoryController = require("../controller/SubCategoryController")

router.get("/getSubCategory",SubCategoryController.getSubCategory)
router.post("/addSubCategory",SubCategoryController.addSubCategory)
router.put("/updateSubCategoryById/:id",SubCategoryController.updateSubCategoryById)
router.delete("/deleteSubCategoryById/:id",SubCategoryController.deleteSubCategoryById)

module.exports = router