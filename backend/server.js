const express = require("express")
const app = express()
var cors = require('cors')
require("./app/src/config/dbConfig").getDbConnection()
const RoleRoutes = require("./app/src/routes/RoleRoutes")
const UserRoutes = require("./app/src/routes/UserRoutes")
const LoginRoutes = require("./app/src/routes/LoginRoutes")
const ServiceRoutes = require("./app/src/routes/ServiceRoutes")
const ServiceProviderRoutes = require("./app/src/routes/ServiceProviderRoutes")
const GetUserByIdRoutes = require("./app/src/routes/GetUserByIdRoutes")
const CategoryRoutes = require("./app/src/routes/CategoryRoutes")
const SubCategoryRoutes = require("./app/src/routes/SubCategoryRoutes")
const TypeRoutes = require("./app/src/routes/TypeRoutes")
const OrderRoutes = require("./app/src/routes/OrderRoutes")
const OrderListRoutes = require("./app/src/routes/OrderListRoutes")
const EmailRoutes = require("./app/src/routes/EmailRoutes")
const authMiddleware = require("./app/src/middleware/auth.middleware")


//converting raw data to json
app.use(express.json())

//cors
app.use(cors())
//Server Starts
app.listen(5000,()=>{
    console.log("Server Started at 5000")
})

//RoleRoutes
app.use("/role",RoleRoutes)

//LoginRoutes
app.use("/login",LoginRoutes)

//UserRoutes
// app.use("/user",authMiddleware,UserRoutes)
app.use("/user",UserRoutes)

//GetUserById
app.use("/getuser",GetUserByIdRoutes)

//ServiceRoutes
app.use("/service",ServiceRoutes)

//ServiceProviderRoutes
app.use("/serviceprovider",ServiceProviderRoutes)

//EmailRoutes
app.use("/email",EmailRoutes)

//Order Routes
app.use("/order",OrderRoutes)

//Order List Routes
app.use("/orderList",OrderListRoutes)


//CategoryRoutes
app.use("/category",CategoryRoutes)

//SubCategoryRoutes
app.use("/subcategory",SubCategoryRoutes)

//TypeRoutes
app.use("/type",TypeRoutes)