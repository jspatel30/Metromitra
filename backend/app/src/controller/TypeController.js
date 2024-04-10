const TypeModel = require("../model/TypeModel")

//addType
const addType = async(req,res) =>{
    try
    {
        const type = await TypeModel.create(req.body)
        if(type!= null)
        {
            res.status(201).json({
                message:"Type added Successfully..!",
                data:type,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"Type NOT Added..!",
                // what should be the value of Flag ?
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


//getType
const getType = async(req,res) =>{
    try
    {
        const type = await TypeModel.find()
        if(type != null)
        {
            res.status(200).json({
                message:"Type Retrieved",
                data:type,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"No type Found"
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

//updateTypeById
const updateTypeById = async(req,res) =>{
    try
    {
        const id = req.params.id
        const newCategory = req.body
        const type = await TypeModel.findByIdAndUpdate(id,newCategory)
        res.status(200).json({
            message:"Type Updated Successfully..!",
            flag:1
        }) 
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

//deleteTypeById
const deleteTypeById = async(req,res) =>{
    try
    {
        const deletedType = await TypeModel.findByIdAndDelete(req.params.id)
        if(deletedType != null)
        {
            res.status(200).json({
                message:"Type deleted Successfully..!",
                data:deletedType,
                flag:1
            })
        }
        else
        {
            res.status(500).json({
                message:"Type deletion failed..Maybe Type not found..!",
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


module.exports = {
    addType,
    getType,
    updateTypeById,
    deleteTypeById
}