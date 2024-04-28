const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    client_name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Combined',
        required: true,
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Combined',
        // required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        enum: ["Open", "Hold", "Close"],
        default: "Open"
    },
    priority: {
        type: String,
        required: true,
        enum: ["Normal", "High", "Highest", "Low", "Lowest"],
        default: "Normal"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Combined',
    },
    workspace_name: {
        type: mongoose.Schema.Types.String,
        ref: 'Combined',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;