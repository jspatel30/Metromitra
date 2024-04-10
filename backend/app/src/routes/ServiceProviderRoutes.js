const router = require("express").Router()
const ServiceProviderController = require("../controller/ServiceProviderController")
const path = require("path")
const multer = require("multer")

const storage = multer.memoryStorage(); 

const upload = multer({ storage: storage });

router.get("/getServiceProvider",ServiceProviderController.getServiceProvider)

router.post("/addServiceProvider",upload.single('file'),ServiceProviderController.addServiceProvider)
router.put("/updateServiceProviderById/:id",ServiceProviderController.updateServiceProviderById)
router.delete("/deleteServiceProviderById/:id",ServiceProviderController.deleteServiceProviderById)
router.get("/getServiceProviderById/:ServiceProviderid",ServiceProviderController.getServiceProviderById)

module.exports = router