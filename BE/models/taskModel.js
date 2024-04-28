const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    assigneeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Combined',
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    task_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        enum: ["Review", "Progress", "Done"],
        default: "Progress"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Combined',
        // required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    workspace_name: {
        type: mongoose.Schema.Types.String,
        ref: 'Combined',
        // required: true,
    },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;