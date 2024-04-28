const catchAsyncErrors = require("./catchAsyncErrors");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const ErrorHander = require("../utils/errorHander");
const Client = require("../models/clientModel");
const Combined = require("../models/combinedModel");



// exports.isAuthenticatedClient = catchAsyncErrors(async (req, res, next) => {
//     console.log('---------------------isAuthenticatedClient---------------------------')
//     const tokenAuth1 = req.cookies.clientJwt;
//     console.log("auth", tokenAuth1)
//     if (!tokenAuth1) {
//         return next(new ErrorHander("Please login to access this resource", 401));
//     }
//     try {
//         const decodedData = jwt.verify(tokenAuth1, process.env.JWT_SECRET);
//         req.client = await Client.findById(decodedData.id);
//         req.cookies.clientId = req.client._id;
//         req.cookies.clientEmail = req.client.client_email
//         req.cookies.clientWorkSpaceName = req.client.client_createdUnder;
//         console.log(req.client._id, req.client.client_createdUnder)
//         next();
//     } catch (error) {
//         return next(new ErrorHander("Invalid Token. Please Login again", 401));
//     }
// });

// isAuthenticatedUser middleware
// exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
//     console.log('---------------------isAuthenticatedUser---------------------------')
//     const userToken = req.cookies.jwt;
//     console.log("authuser:" + userToken);
//     if (!userToken) {
//         return next(new ErrorHander("Please login to access this resource", 401));
//     }
//     try {
//         const decodedData = jwt.verify(userToken, process.env.JWT_SECRET);
//         req.user = await User.findById(decodedData.id);
//         req.cookies.userId = req.user._id;
//         req.cookies.userEmail = req.user.user_email
//         req.cookies.userWorkSpaceName = req.user.workspace_name;
//         console.log(req.user._id, req.user.workspace_name)
//         next();
//         // return {userId:req.user._id, userWorkspaceName: req.user.user_workspace_name}
//     } catch (error) {
//         return next(new ErrorHander("Invalid Token. Please Login again", 401));
//     }
// });

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    console.log('---------------------isAuthenticatedUser---------------------------')
    // console.log(req.cookies)
    const userToken = req.cookies.jwt;
    console.log("authuser:" + userToken);
    if (!userToken) {
        return next(new ErrorHander("Please login to access this resource", 401));
    }
    try {
        const decodedData = jwt.verify(userToken, process.env.JWT_SECRET);
        req.combined = await Combined.findById(decodedData.id);

        req.session.combinedId = req.combined._id;
        req.session.combinedEmail = req.combined.email
        req.session.combinedWorkSpaceName = req.combined.workspace_name;
        console.log("Id and workspace name from auth", req.combined._id, req.combined.workspace_name)
        next();
        // return {userId:req.user._id, userWorkspaceName: req.user.user_workspace_name}
    } catch (error) {
        return next(new ErrorHander("Invalid Token. Please Login again", 401));
    }
});


exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.combined.role)) {
            return next(
                new ErrorHander(
                    `Role: ${req.combined.role} is not allowed to access this resouce `,
                    403
                )
            );
        }
        next();
    };
};

// exports.authorizeRolesClient = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.client.role)) {
//             return next(
//                 new ErrorHander(
//                     `Role: ${req.client.role} is not allowed to access this resouce `,
//                     403
//                 )
//             );
//         }
//         next();
//     };
// };