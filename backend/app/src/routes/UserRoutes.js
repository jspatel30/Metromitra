const UserController = require("../controller/UserController")
const routes = require("express").Router()

routes.get("/getUser",UserController.getUser)
// routes.post("/addUser",UserController.addUser)
routes.put("/updateUserById/:id",UserController.updateUserById)
routes.delete("/deleteUserById/:id",UserController.deleteUserById)


module.exports = routes