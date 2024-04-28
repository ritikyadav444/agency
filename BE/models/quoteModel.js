const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    quoteId: {
        type: Number,
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    },
    order_brief: {
        type: String,
        required: [true, 'Order Brief Required'],
    },
    attachment: {
        data: Buffer,
        contentType: String,
    } || null || undefined,
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
    value: {
        type: Number,
        required: true,
        default: 1
    },
    unit: {
        type: String,
        enum: ['Days', 'Weeks', 'Months'],
        required: true,
        default: "Days"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    selected: {
        type: String,
        enum: ['Accepted', 'Rejected', 'Pending'],
        required: true,
        default: "Pending"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Combined',
    },
    workspace_name: {
        type: mongoose.Schema.Types.String,
        ref: 'User',

    },
});

quoteSchema.pre('save', async function (next) {
    if (!this.quoteId) {
        try {
            const lastQuote = await Quote.findOne({}, {}, { sort: { quoteId: -1 } });
            if (lastQuote) {
                this.quoteId = lastQuote.quoteId + 1;
            } else {
                this.quoteId = 1;
            }
            console.log("lq", lastQuote, this.quoteId, this.createdUnder);
        } catch (error) {
            console.error('Error finding last quote:', error);
        }
    }
    next();
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;