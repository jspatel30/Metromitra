const routes = require("express").Router()
const RoleController = require("../controller/RoleController")

routes.get("/getRole",RoleController.getRole)
routes.post("/addRole",RoleController.addRole)
routes.put("/updateRoleById/:id",RoleController.updateRoleById)
routes.delete("/deleteRoleById/:id",RoleController.deleteRoleById)

module.exports = routes