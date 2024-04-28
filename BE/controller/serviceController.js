const { isAuthenticatedUser } = require("../middleware/authentication");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Service = require("../models/serviceModel");
const ErrorHander = require("../utils/errorHander");


exports.createService = (async (req, res, next) => {
    const combinedId = req.session.combinedId
    const combinedWorkSpaceName = req.session.combinedWorkSpaceName
    req.body.service_createdBy = combinedId
    req.body.workspace_name = combinedWorkSpaceName
    console.log(combinedId)
    console.log(combinedWorkSpaceName)
    console.log(req.file)
    if (req.file) {
        req.body.service_cover_img = {
            data: req.file.buffer,
            contentType: req.file.mimetype,
            name: req.file.originalname,
        };
    } else {
        req.body.service_cover_img = {
            data: Buffer.from(''), // Empty buffer
            contentType: 'image/jpeg', // Set the appropriate content type
        };
    }
    const service = await Service.create(req.body);
    console.log("service", service)
    res.status(201).json({
        success: true,
        service,
    })
});


//getAll
exports.getAllServices = async (req, res, next) => {
    const combinedId = req.session.combinedId;
    // const clientWorkSpaceName = req.session.clientWorkSpaceName;
    const combinedWorkSpaceName = req.session.combinedWorkSpaceName;
    console.log("getAll service", combinedId, combinedWorkSpaceName)
    // const services = await Service.find({ service_createdUnder: userWorkSpaceName, service_createdUnder: clientWorkSpaceName, service_publish: true })
    const services = await Service.find({ workspace_name: combinedWorkSpaceName, service_publish: true })
    res.status(200).json({
        success: true,
        services
    })
}


//get admin services
exports.getAdminServices = catchAsyncErrors(async (req, res, next) => {
    const combinedWorkSpaceName = req.session.combinedWorkSpaceName;
    const services = await Service.find({ workspace_name: combinedWorkSpaceName })
    // const services = await Service.find({})

    res.status(200).json({
        success: true,
        services,
    });
});

//get service details
exports.getServiceDetails = catchAsyncErrors(async (req, res, next) => {
    const service = await Service.findById(req.params.id);
    if (!service) {
        return next(new ErrorHander("Service not found", 404));
    }
    res.status(200).json({
        success: true,
        service,
    });
    // console.log(service);
});

//update service
exports.updateService = async (req, res, next) => {
    let service = await Service.findById(req.params.id)
    if (!service) {
        return res.status(500).json({
            success: false,
            message: "Service Not Found"
        })

    }
    console.log("file", req.file)
    if (req.file != undefined) {
        service.service_cover_img = {
            data: req.file.buffer,
            contentType: req.file.mimetype,
            name: req.file.originalname,

        };
    }
    if (req.file === undefined) {
        req.body.service_cover_img = {
            data: Buffer.from(''), // Empty buffer
            contentType: 'image/jpg', // Set the appropriate content type
        };
    }
    service.service_name = req.body.service_name;
    service.service_amount = req.body.service_amount;
    service.service_desc = req.body.service_desc;
    service.service_pricing_type = req.body.service_pricing_type;
    service.value = req.body.value;
    service.unit = req.body.unit;
    console.log(service.service_cover_img.contentType)
    await service.save();
    return res.status(200).json({
        success: true,
        service
    });
    // service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    //     new: true,
    //     runValidators: true,
    //     usefindAndModify: false
    // });
    // res.status(200).json({
    //     success: true,
    //     service
    // })
}

//delete service
exports.deleteService = async (req, res, next) => {
    const service = await Service.findById(req.params.id);
    if (!service) {
        return res.status(500).json({
            success: false,
            message: " Service Not found"
        })
    }
    await service.deleteOne();
    res.status(200).json({
        success: true,
        message: "Service Deleted Successfully"
    })
}