const router = require("express").Router()
const SendMailController = require("../controller/SendMailController")

router.post("/sendMail",SendMailController.sendMailToUser)

module.exports = router