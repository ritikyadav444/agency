const Ticket = require("../models/ticketmodel");
const Client = require('../models/clientModel');
const Order = require("../models/orderModel");
const Team = require("../models/teamModel");
const Combined = require('../models/combinedModel')
const ErrorHander = require("../utils/errorHander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
//create Ticket
exports.createTicket = (async (req, res, next) => {
    const combinedId = req.session.combinedId
    const combinedWorkSpaceName = req.session.combinedWorkSpaceName
    req.body.createdBy = combinedId
    req.body.workspace_name = combinedWorkSpaceName
    console.log(combinedId)
    console.log(combinedWorkSpaceName)
    const body = req.body;
    const clientPresent = await Combined.exists({ _id: body.client_name });
    const orderPresent = await Order.exists({ _id: body.orderId });
    const teamPresent = await Combined.exists({ _id: body.assignee });
    if (!clientPresent) {
        return res.status(400).json({
            success: false,
            message: 'Client not found. Unable to create the ticket.'
        });
    }
    if (!teamPresent) {
        return res.status(400).json({
            success: false,
            message: 'Team not found. Unable to create the ticket.'
        });
    }
    if (!orderPresent) {
        return res.status(400).json({
            success: false,
            message: 'Order not found. Unable to create the ticket.'
        });
    }
    const ticket = await Ticket.create(req.body);
    res.status(201).json({
        success: true,
        ticket,
    })
});

// getAll
exports.getAllTicket = async (req, res) => {
    const combinedWorkSpaceName = req.session.combinedWorkSpaceName;
    const tickets = await Ticket.find({ workspace_name: combinedWorkSpaceName })
    res.status(200).json({
        success: true,
        tickets
    })
}

exports.getTicketDetails = catchAsyncErrors(async (req, res, next) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        return next(new ErrorHander("Ticket not found", 404));
    }
    res.status(200).json({
        success: true,
        ticket,
    });
    console.log(ticket);
});

//update ticket
exports.updateTicket = async (req, res, next) => {
    let ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
        return res.status(500).json({
            success: false,
            message: "ticket Not Found"
        })
    }
    ticket.status = req.body.status;
    if (req.body.status === "Closed") {
        ticket.closedAt = Date.now()
    }
    ticket.priority = req.body.priority;
    if (req.body.priority === "") {
        ticket.changedAt = Date.now()
    }
    await ticket.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        ticket
    })
}
//delete ticket
exports.deleteTicket = async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        return res.status(500).json({
            success: false,
            message: "Ticket Not found"
        })
    }
    console.log(ticket);
    await ticket.deleteOne();
    res.status(200).json({
        success: true,
        message: "Ticket Deleted Successfully"
    })
}