const mongoose = require('mongoose');
const serviceSchema = mongoose.Schema({
    service_name: {
        type: String,
        required: [true, 'Please Enter Service Name'],
        trim: true,
    },
    service_desc: {
        type: String,
        required: [true, 'Please Enter Description'],
    },
    service_cover_img: {
        data: Buffer,
        contentType: String,
        name: String
    } || null || undefined,

    service_pricing_type: {
        type: String,
        enum: ['One-Time', 'Recurring'],
        // required: true,
        default: "One-Time"
    },
    service_amount: {
        type: Number,
        required: [true, 'Please Enter Amount'],
    },
    value: {
        type: Number,
        default: 1
    },
    unit: {
        type: String,
        enum: ['Days', 'Weeks', 'Months'],
        default: "Days"
    },
    service_publish: {
        type: Boolean,
        default: true
    },
    service_createdAt: {
        type: Date,
        default: Date.now
    },
    service_createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Combined',
    },
    workspace_name: {
        type: mongoose.Schema.Types.String,
        ref: 'Combined',
    },
});

const Services = mongoose.model('Service', serviceSchema);
module.exports = Services;