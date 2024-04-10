const router = require("express").Router()
const ServiceController = require("../controller/ServiceController")
const multer = require("multer")
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

router.get("/getService",ServiceController.getService)
router.get("/getServiceById/:Serviceid",ServiceController.getServiceById)
// router.post("/getServiceByName",ServiceController.getServiceByName)
router.post("/addService",upload.single('File'),ServiceController.addService)
router.put("/updateServiceById/:id",ServiceController.updateServiceById)
router.delete("/deleteServiceById/:id",ServiceController.deleteServiceById)

router.get("/getServiceByServiceProviderId/:id",ServiceController.getServiceByServiceProviderId)

module.exports = router