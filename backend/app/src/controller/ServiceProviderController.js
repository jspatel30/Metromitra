const ServiceProviderModel = require("../model/ServiceProviderModel")
// const multer = require("multer")
// const sharp = require("sharp")
const jwt = require("jsonwebtoken")
const {SEC_KEY} = process.env



//getServiceProvider
const getServiceProvider = async(req,res) =>{
    try
    {
        const provider = await ServiceProviderModel.find().populate("role")
        if(provider != null)    //What to put in this condtion..?
        {
            res.status(200).json({
                message:"Service Provider Retrieved",
                data:provider,
                flag:1                
            })
        }
        else
        {
            res.status(400).json({
                message:"Service Provider not found",

            })
        }
    }
    catch(error)
    {
        res.status(500).json({
            message:"Server Error",
            error:error
        })
    }
}

//addServiceProvider
const addServiceProvider = async(req,res) =>{
    try
    {
        // const resizedBuffer = await sharp(req.file.buffer)
        // .resize({ width: 250, height: 250 })
        // .png()
        // .toBuffer();
        // const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()


        // const base64Data = resizedBuffer.toString('base64');
        // const retrievedBuffer = Buffer.from(base64Data, 'base64');

        
        // const dataDatabase = {
        //     name:req.body.name,
        //     email:req.body.email,
        //     password:req.body.password,
        //     phone:req.body.phone,
        //     role:req.body.role,
        //     image: retrievedBuffer,
        // }

        const newProvider = await ServiceProviderModel.create(req.body)
        res.status(201).json({
            message:"Service Provider Added Successfully",
            flag:1
        })
    }
    catch(error)
    {
        console.log(error)
        res.status(500).json({
            message:"Server Error",
            error:error,
            flag:-1
        })
    }
}


//getServiceProviderById
const getServiceProviderById = async(req,res)=>{
    try
    {
        const id = req.params.ServiceProviderid
        const serviceProvider = await ServiceProviderModel.findById({_id:id})
        if(serviceProvider != null)
        {
            res.status(200).json({
                message:"Service Provider Retrieved",
                data:serviceProvider,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"Service Provider Not Retrieved",
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

//loginServiceProvider
const loginServiceProvider = async(req,res) =>{
    try
    {
        const ServiceProvider = await ServiceProviderModel.findOne({email:req.body.email})
        // console.log("ServiceProviderModel - ",ServiceProvider)
        if(ServiceProvider != null)
        {
            if(ServiceProvider.password == req.body.password)
            {
                const token = jwt.sign({"email":ServiceProvider.email,"userId":ServiceProvider._id},SEC_KEY)
                res.status(200).json({
                    message:"ServiceProvider Login Successfully",
                    data:ServiceProvider,
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

//deleteServiceProviderById
const deleteServiceProviderById = async(req,res) =>{
    try
    {
        const deletedProvider = await ServiceProviderModel.findByIdAndDelete(req.params.id)
        if(deletedProvider != null)
        {
            res.status(200).json({
                message:"Service Provider Deleted Successfully..",
                data:deletedProvider,
                flag:1
            })
        }
        else
        {
            res.status(400).json({
                message:"Deletion fail, maybe Service Provider not found"
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

//updateServiceProviderById
const updateServiceProviderById = async(req,res) =>{
    const id = req.params.id
    const updatedProvider = req.body
    try
    {
        const newProvider = await ServiceProviderModel.findByIdAndUpdate(id,updatedProvider)
        res.status(200).json({
            message:"Service Provider Updated Successfully",
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

module.exports = {
    getServiceProvider,
    addServiceProvider,
    deleteServiceProviderById,
    updateServiceProviderById,
    loginServiceProvider,
    getServiceProviderById
}