const ServiceModel = require("../model/ServicesModel")
const OrderModel = require("../model/OrderModel")
const multer = require("multer")
const sharp = require("sharp")
const { ObjectId } = require("mongodb")


//addService
const addService = async (req, res) => {
    try {
        const resizedBuffer = await sharp(req.file.buffer)
            .png()
            .resize({ width: 250, height: 250 })
            .toBuffer();

        const base64Data = resizedBuffer.toString('base64');
        const retrievedBuffer = Buffer.from(base64Data, 'base64');

        const dataDatabase = {
            ServiceName: req.body.ServiceName,
            Fees: req.body.Fees,
            Area: req.body.Area,
            City: req.body.City,
            State: req.body.State,
            Maximum: req.body.Maximum,
            Minimum: req.body.Minimum,
            image: retrievedBuffer,
            ServiceProvider: req.body.ServiceProvider,
        }

        const service = await ServiceModel.create(dataDatabase)
        // console.log("Resized Buffer:", retrievedBuffer);

        res.status(201).json({
            message: "Service Added",
            data: service,
            flag: 1
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error,
            flag: -1
        })
    }
}


//getService
const getService = async (req, res) => {
    try {
        // const service = await ServiceModel.find().populate("Category").populate("SubCategory").populate("Type").populate("ServiceProvider")
        const services = await ServiceModel.find({Status:1}).populate("ServiceProvider")

        const aggregatePipeline = [
            // Group by Service and calculate the average star rating
            {
                $group: {
                    _id: "$Service",
                    avgStar: { $avg: "$Stars" }
                }
            }
        ];

        const serviceAggregate = await OrderModel.aggregate(aggregatePipeline);

        const avgStarMap = new Map();
        serviceAggregate.forEach(item => {
            avgStarMap.set(item._id.toString(), item.avgStar);
            // console.log(item);
            // console.log(avgStarMap);
        });
        // console.log(avgStarMap.get('65f9be4e6d76550bda7db1ef'))
        const servicesWithAvgStar = services.map(service => {
            // console.log(avgStarMap.get(service._id.toString()));
            return {
                service,
                averageStar: avgStarMap.get(service._id.toString()) || 0
            };
        });
        if (servicesWithAvgStar != null) {
            res.status(200).json({
                message: "Service Retrieved",
                data: servicesWithAvgStar,
                flag: 1
            })
        }
        else {
            res.status(400).json({
                message: "Service Not Retrieved",
            })
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error,
            flag: -1
        })
    }
}


//getServiceById
const getServiceById = async (req, res) => {
    try {
        const id = req.params.Serviceid
        const service = await ServiceModel.findById({ _id: id, Status: 1 })
        if (service != null) {
            res.status(200).json({
                message: "Service  Retrieved",
                data: service,
                flag: 1
            })
        }
        else {
            res.status(400).json({
                message: "Service  Not Retrieved",
            })
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error,
            flag: -1
        })
    }
}


//deleteServiceById
const deleteServiceById = async (req, res) => {
    try {
        // const deletedService = await ServiceModel.findByIdAndDelete(req.params.id)
        const deletedService = await ServiceModel.findByIdAndUpdate(req.params.id, { Status: 0 })

        if (deletedService != null) {
            res.status(200).json({
                message: "Service deleted Successfully..!",
                data: deletedService,
                flag: 1
            })
        }
        else {
            res.status(500).json({
                message: "Service deletion failed..Maybe Service not found..!",
            })
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error,
            flag: -1
        })
    }
}


///updateServiceById
const updateServiceById = async (req, res) => {
    const id = req.params.id
    const updatedService = req.body
    try {
        const newService = await ServiceModel.findByIdAndUpdate(id, updatedService)
        res.status(200).json({
            message: "Service Updated Successfully",
            flag: 1
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error,
            flag: -1
        })
    }
}


//getServiceByServiceProviderId
const getServiceByServiceProviderId = async (req, res) => {
    try {
        const ServiceProviderid = req.params.id
        console.log(ServiceProviderid)
        const service = await ServiceModel.find({ ServiceProvider: ServiceProviderid, Status: 1 }).populate("ServiceProvider")
        console.log(service)
        if (service != null) {
            res.status(200).json({
                message: "Service  Retrieved by Service Provider Id",
                data: service,
                flag: 1
            })
        }
        else {
            res.status(400).json({
                message: "Service  Not Retrieved",
            })
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error,
            flag: -1
        })
    }
}



module.exports = {
    addService,
    getService,
    deleteServiceById,
    updateServiceById,
    // getServiceByName,
    getServiceById,
    getServiceByServiceProviderId
}