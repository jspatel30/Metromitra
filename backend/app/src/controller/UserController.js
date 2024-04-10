const UserModel = require("../model/UserModel")
const jwt = require("jsonwebtoken")
const {SEC_KEY} = process.env

//addUser
const addUser = async(req,res) =>{
    try
    {
        const user = await UserModel.create(req.body)
        res.status(201).json({
            message:"User Added..!",
            data:user,
            flag:1
        })
    }
    catch(error)
    {
        res.status(500).json({
            message:"Server Error",
            error:error,
            flag:-1,
        })
    }
}

//getUser
const getUser = async(req,res) =>{
    try
    {
        const user = await UserModel.find().populate("role")
        if(user != null)
        {
            res.status(200).json({
                message:"User Retrieved",
                data:user,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"No User Found",
            })
        }
    }
    catch(error)
    {
        res.status(500).json({
            message:"Server Error",
            error:error,
            flag:-1
        })
    }
}

//loginUser
const loginUser = async(req,res) =>{
    try
    {
        const user = await UserModel.findOne({email:req.body.email})
        // console.log("user - ",user)
        if(user != null)
        {
            if(user.password == req.body.password)
            {
                const token = jwt.sign({"email":user.email,"userId":user._id},SEC_KEY)
                res.status(200).json({
                    message:"User Login Successfully",
                    data:user,
                    token:token,
                    flag:1
                })
            }
            else
            {
                res.status(400).json({
                    message:"Password is Incorrect",
                    flag:-1
                })
            }
        }
        else
        {
            res.status(400).json({
                message:"Email is Wrong Or User Not Found",
                flag:-1
            })
        }
    }
    catch(error)
    {
        res.status(500).json({
            message:"Server Error",
            error:error,
            flag:-1
        })
    }

}

//updateUserById
const updateUserById = async(req,res) =>{
    try
    {
        const id = req.params.id
        console.log(id)
        const updateUserDetail = req.body 
        console.log("...",req.body)
        const user = await UserModel.findByIdAndUpdate(id,updateUserDetail)
        if(user != null)
        {
            res.status(200).json({
                message:"User updated Successfully",
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"User Updation Failed",
            })
        }
    }
    catch(error)
    {
        res.status(500).json({
            message:"Server Error",
            flag:-1,
            error:error
        })
    }
}


//getUserById
const getUserById = async(req,res) =>{
    try
    {
        const id = req.params.userId
        const user = await UserModel.findOne({ _id: id })  //(id,updateUserDetail)
        if(user != null)
        {
            res.status(200).json({
                message:"User found Successfully",
                user:user,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"User not found",
            })
        }
    }
    catch(error)
    {
        res.status(500).json({
            message:"Server Error",
            flag:-1,
            error:error
        })
    }
}


//deleteUserById
const deleteUserById = async(req,res) =>{
    try
    {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id)
        if(deletedUser != null)
        {
            res.status(200).json({
                message:"User Deleted Successfully",
                data:deletedUser,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"User Deletion fails OR User not found"
            })
        }
    }
    catch(error)
    {
        res.status(500).json({
            message:"Server Error",
            flag:-1
        })
    }
}

module.exports = {
    addUser,
    getUser,
    updateUserById,
    deleteUserById,
    loginUser,
    getUserById
}