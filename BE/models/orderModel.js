const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: Number,
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Combined',
        required: true,
    },
    serviceId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Service',
        required: true,
    },
    order_brief: {
        type: String,
    },
    attachment: {
        data: Buffer,
        contentType: String,
    },
    note: {
        type: String,
    },
    kick_off_date: {
        type: String,
        // default: Date.now
    },
    end_date: {
        type: String,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    budget: {
        type: Number,
        required: true,
        default: 1

    },
    status: {
        type: String,
        required: true,
        enum: ["Review", "Ongoing", "Cancelled", "Completed"],
        default: "Ongoing"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Combined',
    },
    workspace_name: {
        type: mongoose.Schema.Types.String,
        ref: 'Combined',
    },

});
orderSchema.pre('save', async function (next) {
    if (!this.orderId) {
        try {
            const result = await Order.findOneAndUpdate({}, { $inc: { orderId: 1 } }, { sort: { orderId: -1 }, new: true });
            this.orderId = result ? result.orderId : 1;
            console.log(this.orderId);
        } catch (error) {
            console.error('Error updating orderId:', error);
        }
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;