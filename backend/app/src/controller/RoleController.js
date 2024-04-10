const RoleModel = require("../model/RoleModel")

//addRole
const addRole = async(req,res) =>{
    try
    {
        const role = await RoleModel.create(req.body)
        if(role != null)
        {
            res.status(201).json({
                messagae:"Role Added",
                data:role,
                flag:1
            })
        }
        else
        {
            res.json({
                message:"Role not Added"
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

//getRole
const getRole = async(req,res) =>{

    try{
        const role = await RoleModel.find()
        if(role != null)
        {
            res.status(200).json({
                message:"Role Retrieved",
                data:role,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"Role not Retrieved"
            })
        }
    }
    catch(error)
    {
        res.status(500).json({
            message:"Server Error in retrieving",
            error:error,
            flag:-1
        })
    }
}


//updateRoleById
const updateRoleById = async(req,res) =>{
    try
    {
        const role = await RoleModel.findByIdAndUpdate(req.params.id,req.body)
        if(role != null)
        {
            res.status(200).json({
                message:"Role Updated",
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"Role Updation FAILED"
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


//deleteRoleById
const deleteRoleById = async(req,res) =>{
    try
    {
        const deletedRole = await RoleModel.findByIdAndDelete(req.params.id)
        if(deletedRole != null)
        {
            res.status(200).json({
                message:"Role deleted Succussfully",
                data:deletedRole,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"Role not deleted..Maybe Role not Found",
                //Ask Sir.. What to pass in flag when role is not found...
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
    addRole,
    deleteRoleById,
    updateRoleById,
    getRole,
}