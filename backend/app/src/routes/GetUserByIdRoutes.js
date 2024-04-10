const UserController = require("../controller/UserController")
const routes = require("express").Router()

routes.get("/getUserById/:userId",UserController.getUserById)

module.exports = routes