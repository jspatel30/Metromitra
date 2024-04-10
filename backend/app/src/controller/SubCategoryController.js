const SubCategoryModel = require("../model/SubCategoryModel")

//addSubCategory
const addSubCategory = async(req,res) =>{
    try
    {
        const SubCategory = await SubCategoryModel.create(req.body)
        if(SubCategory!= null)
        {
            res.status(201).json({
                message:"SubCategory added Successfully..!",
                data:SubCategory,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"SubCategory NOT Added..!",
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


//getSubCategory
const getSubCategory = async(req,res) =>{
    try
    {
        const SubCategory = await SubCategoryModel.find().populate("Category")
        if(SubCategory != null)
        {
            res.status(200).json({
                message:"SubCategory Retrieved",
                data:SubCategory,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"No SubCategory Found"
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

//updateCategoryById
const updateSubCategoryById = async(req,res) =>{
    try
    {
        const id = req.params.id
        const newCategory = req.body
        const updatedSubCategory = await SubCategoryModel.findByIdAndUpdate(id,newCategory)
        res.status(200).json({
            message:"SubCategory Updated Successfully..!",
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

//deleteSubCategoryById
const deleteSubCategoryById = async(req,res) =>{
    try
    {
        const deletedSubCategory = await SubCategoryModel.findByIdAndDelete(req.params.id)
        if(deletedSubCategory != null)
        {
            res.status(200).json({
                message:"SubCategory deleted Successfully..!",
                data:deletedSubCategory,
                flag:1
            })
        }
        else
        {
            res.status(500).json({
                message:"Category deletion failed..Maybe Category not found..!",
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
    addSubCategory,
    getSubCategory,
    updateSubCategoryById,
    deleteSubCategoryById
}