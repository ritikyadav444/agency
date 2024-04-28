const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Quote = require("../models/quoteModel");
const ErrorHander = require("../utils/errorHander");
const Service = require("../models/serviceModel");

//create quote
// exports.createQuote = (async (req, res, next) => {
//     const body = req.body;
//     const servicePresent = await Service.exists({ _id: body.serviceId });
//     const combinedId = req.session.combinedId
//     const combinedWorkSpaceName = req.session.combinedWorkSpaceName
//     body.createdBy = combinedId
//     body.workspace_name = combinedWorkSpaceName

//     console.log(combinedId)
//     console.log(combinedWorkSpaceName)

//     if (!servicePresent) {
//         return res.status(400).json({
//             success: false,
//             message: 'Service not found. Unable to create the order.'
//         });
//     }
//     console.log('--------------CreateQuote--------------');
//     const lastQuote = await Quote.findOne({}, {}, { sort: { quoteId: -1 } });
//     body.quoteId = lastQuote ? lastQuote.quoteId + 1 : 1;
//     console.log("qt", body.quoteId)
//     body.quoteId = this.quoteId;

//     const quote = await Quote.create(req.body);
//     res.status(201).json({
//         success: true,
//         quote,
//     })
// });


exports.createQuote = (async (req, res, next) => {
    const body = req.body
    const servicePresent = await Service.exists({ _id: body.serviceId });
    const combinedId = req.session.combinedId
    const combinedWorkSpaceName = req.session.combinedWorkSpaceName
    body.createdBy = combinedId
    body.workspace_name = combinedWorkSpaceName
    body.serviceId = req.body.serviceId

    console.log(combinedId)
    console.log(combinedWorkSpaceName)
    console.log("body------------------", req.body)
    // console.log(req.file)
    if (req.file) {
        console.log('HI')
        req.body.attachment = {
            data: req.file.buffer,
            contentType: req.file.mimetype,
        };
    } else {
        req.body.attachment = {
            data: Buffer.from(''), // Empty buffer
            contentType: 'image/jpeg', // Set the appropriate content type
        };
    }
    if (!servicePresent) {
        return res.status(400).json({
            success: false,
            message: 'Service not found. Unable to create the order.'
        });
    }
    console.log('--------------CreateQuote--------------');
    const lastQuote = await Quote.findOne({}, {}, { sort: { quoteId: -1 } });
    body.quoteId = lastQuote ? lastQuote.quoteId + 1 : 1;
    console.log("qt", body.quoteId)
    body.quoteId = this.quoteId;

    const quote = await Quote.create(req.body);
    res.status(201).json({
        success: true,
        quote,
    })
});


//getAll
exports.getAllQuotes = async (req, res) => {
    clientId = req.session.combinedId
    combinedWorkSpaceName = req.session.combinedWorkSpaceName;
    const quotes = await Quote.find({
        workspace_name: combinedWorkSpaceName,
    });
    res.status(200).json({
        success: true,
        quotes
    });
    // if (req.user) {
    //     clientId = req.session.userId;
    //     userWorkSpaceName = req.session.userWorkSpaceName;
    //     const quotes = await Quote.find({
    //         createdUnder: userWorkSpaceName,
    //     });
    //     res.status(200).json({
    //         success: true,
    //         quotes
    //     });
    // } else if (req.client) {
    //     clientId = req.session.clientId;
    //     userWorkSpaceName = req.session.clientWorkSpaceName;
    //     const quotes = await Quote.find({
    //         // createdBy: clientId
    //     });
    //     res.status(200).json({
    //         success: true,
    //         quotes
    //     });
    // }
}


exports.getQuoteDetails = catchAsyncErrors(async (req, res, next) => {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
        return next(new ErrorHander("Quote not found", 404));
    }
    res.status(200).json({
        success: true,
        quote,
    });
    console.log(quote);
});


//update quote
exports.updateQuote = async (req, res, next) => {
    let quote = await Quote.findById(req.params.id)

    if (!quote) {
        return res.selected(500).json({
            success: false,
            message: "Quote Not Found"
        })
    }
    if (quote.selected === "Accepted") {
        return next(new ErrorHander("You have Accepted This Quote"))
    }
    if (quote.selected === "Rejected") {
        return next(new ErrorHander("You have Rejected This Quote"))
    }
    quote.selected = req.body.selected;
    if (req.body.selected === "") {
        quote.selectedAt = Date.now()
    }
    await quote.save({ validateBeforeSave: false });
    quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        usefindAndModify: false
    });
    res.status(200).json({
        success: true,
        quote
    })
}

//delete quote
exports.deleteQuote = async (req, res, next) => {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
        return res.status(500).json({
            success: false,
            message: "Quote Not found"
        })
    }
    console.log(quote);
    await quote.deleteOne();
    res.status(200).json({
        success: true,
        message: "Quote Deleted Successfully"
    })
}