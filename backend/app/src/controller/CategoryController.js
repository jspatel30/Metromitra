const CategoryModel = require("../model/CategoryModel")

//addCategory
const addCategory = async(req,res) =>{
    try
    {
        const category = await CategoryModel.create(req.body)
        if(category!= null)
        {
            res.status(201).json({
                message:"Category added Successfully..!",
                data:category,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"Category NOT Added..!",
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


//getCategory
const getCategory = async(req,res) =>{
    try
    {
        const category = await CategoryModel.find()
        if(category != null)
        {
            res.status(200).json({
                message:"Category Retrieved",
                data:category,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"No Category Found"
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
const updateCategoryById = async(req,res) =>{
    try
    {
        const id = req.params.id
        const newCategory = req.body
        const updatedCategory = await CategoryModel.findByIdAndUpdate(id,newCategory)
        res.status(200).json({
            message:"Category Updated Successfully..!",
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

//deleteCategoryById
const deleteCategoryById = async(req,res) =>{
    try
    {
        const deletedCategory = await CategoryModel.findByIdAndDelete(req.params.id)
        if(deletedCategory != null)
        {
            res.status(200).json({
                message:"Category deleted Successfully..!",
                data:deletedCategory,
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
    addCategory,
    getCategory,
    updateCategoryById,
    deleteCategoryById
}