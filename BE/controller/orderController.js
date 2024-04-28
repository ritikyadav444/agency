const Order = require("../models/orderModel");
// const Client = require('../models/clientModel');
const Combined = require('../models/combinedModel')
const Service = require("../models/serviceModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorHander");

//create order
exports.createOrder = async (req, res, next) => {
    try {
        const body = req.body;
        // const clientPresent = await Client.exists({ _id: body.clientId });
        const clientPresentInCombined = await Combined.exists({ _id: body.clientId })
        const servicePresent = await Service.exists({ _id: body.serviceId });
        const combinedId = req.session.combinedId
        const combinedWorkSpaceName = req.session.combinedWorkSpaceName
        req.body.createdBy = combinedId
        req.body.workspace_name = combinedWorkSpaceName
        console.log(body)
        if (!clientPresentInCombined) {
            return res.status(400).json({
                success: false,
                message: 'Client not found. Unable to create the order.'
            });
        }
        if (!servicePresent) {
            return res.status(400).json({
                success: false,
                message: 'Service not found. Unable to create the order.'
            });
        }

        console.log('--------------CreateOrder--------------');

        const lastOrder = await Order.findOne({}, {}, { sort: { orderId: -1 } });
        body.orderId = lastOrder ? lastOrder.orderId + 1 : 1;
        console.log("ord", body.orderId)
        body.orderId = this.orderId;

        const order = await Order.create(body);
        res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

//getAll
exports.getAllOrders = async (req, res) => {
    const combinedWorkSpaceName = req.session.combinedWorkSpaceName;
    const orders = await Order.find({ workspace_name: combinedWorkSpaceName })
    console.log(combinedWorkSpaceName)
    res.status(200).json({
        success: true,
        orders
    })
}

//get Order Details
exports.getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHander("Order not found", 404));
    }
    res.status(200).json({
        success: true,
        order,
    });
    console.log(order);
});


//update order
exports.updateOrder = async (req, res, next) => {
    let order = await Order.findById(req.params.id)

    if (!order) {
        return res.status(500).json({
            success: false,
            message: "Order Not Found"
        })
    }
    if (order.status === "Completed") {
        return next(new ErrorHander("You have Completed This Order"))
    }
    if (order.status === "Cancelled") {
        return next(new ErrorHander("You have Cancelled This Order"))
    }
    order.status = req.body.status;
    if (req.body.status === "Completed") {
        order.completedAt = Date.now()
    }
    await order.save({ validateBeforeSave: false });
    order = await Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        usefindAndModify: false
    });
    res.status(200).json({
        success: true,
        order
    })
}

//delete order
exports.deleteOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(500).json({
            success: false,
            message: "Order Not found"
        })
    }
    console.log(order);
    await order.deleteOne();
    res.status(200).json({
        success: true,
        message: "Order Deleted Successfully"
    })
}