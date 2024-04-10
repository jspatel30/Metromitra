const UserController = require("../controller/UserController")
const ServiceProviderController = require("../controller/ServiceProviderController")
const routes = require("express").Router()

routes.post("/userLogin",UserController.loginUser)
routes.post("/serviceProviderLogin",ServiceProviderController.loginServiceProvider)
routes.post("/addUser",UserController.addUser)

module.exports = routes