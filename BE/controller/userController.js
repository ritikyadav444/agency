// const jwt = require('jsonwebtoken');
// const User = require("../models/userModel");
// const bcrypt = require("bcryptjs");
// const express = require("express");
// const crypto = require("crypto");
// const verifyMail = require("../utils/jwtTokens");
// const ErrorHander = require("../utils/errorHander");
// const router = express.Router();
// const Token = require("../models/tokenUserModel");

// // Register user
// exports.registerUser = async (req, res, next) => {
//     try {
//         let user = await User.findOne({ workspace: req.body.workspace, email: req.body.email });
//         if (user) {
//             return res.status(400).json({ success: false, message: "User with given workspace already exists!" });
//         }
//         user = new User({
//             fname: req.body.fname,
//             lname: req.body.lname,
//             email: req.body.email,
//             workspace: req.body.workspace,
//             role: req.body.role,
//             password: await bcrypt.hash(req.body.password, 10)
//         });
//         user = await user.save();
//         const token = new Token({
//             userId: user._id,
//             token: crypto.randomBytes(16).toString('hex')
//         });
//         await token.save();
//         const link = `http://127.0.0.1:4001/test/v1/user/confirm/${token.token}`;
//         const email = user.email;
//         await verifyMail(email, link);
//         res.status(201).json({
//             success: true,
//             message: "Registration successful. Verification email sent.",
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// };

// // Activate
// exports.activateToken = async (req, res, next) => {
//     try {
//         const token = await Token.findOne({ token: req.params.token });

//         if (!token) {
//             return res.status(404).json({ success: false, message: "Token not found" });
//         }

//         await User.updateOne({ _id: token.userId }, { $set: { verified: true } });
//         await Token.findOneAndDelete({ _id: token._id });

//         const user = await User.findOne({ _id: token.userId });
//         const jwtToken = user.getJWTToken();

//         res.cookie('jwt', jwtToken, {
//             expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
//             httpOnly: true,
//         });

//         res.status(200).json({
//             success: true,
//             message: "Email verified. You are now logged in.",
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).send("An error occurred");
//     }
// };

// // Login user
// exports.loginUser = async (req, res, next) => {
//     const { email, password, workspace } = req.body;

//     try {
//         if (!email || !password || !workspace) {
//             return next(new ErrorHander("Please Enter Email, Password, and Workspace Name", 400));
//         }

//         const user = await User.findOne({ email, workspace }).select("+password");

//         if (!user) {
//             return next(new ErrorHander("Invalid Email, Password, or Workspace Name", 401));
//         }

//         const isPasswordMatched = await bcrypt.compare(password, user.password);

//         if (!isPasswordMatched) {
//             return next(new ErrorHander("Invalid Password", 401));
//         }

//         const jwtToken = user.getJWTToken();

//         res.cookie('jwt', jwtToken, {
//             expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
//             httpOnly: true,
//         });

//         res.status(200).json({
//             success: true,
//             message: "Login successful.",
//             user
//         });
//         // console.log(user)
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// };

// // Logout
// exports.logout = async (req, res, next) => {
//     res.cookie("jwt", "", {
//         expires: new Date(Date.now()),
//         httpOnly: true,
//     });

//     res.status(200).json({
//         success: true,
//         message: "Logged Out"
//     });
// };


// //get all
// exports.getAllUsers = async (req, res) => {
//     const users = await User.find()
//     res.status(200).json({
//         success: true,
//         users
//     })
// }




const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const express = require("express");
const crypto = require("crypto");
const verifyMail = require("../utils/jwtTokens");
const ErrorHander = require("../utils/errorHander");
const router = express.Router();
const Token = require("../models/tokenUserModel");
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// Register user
exports.registerUser = async (req, res, next) => {
    try {
        let user = await User.findOne({ workspace: req.body.workspace, email: req.body.email });
        if (user) {
            return res.status(400).json({ success: false, message: "User with given workspace already exists!" });
        }
        user = new User({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            workspace: req.body.workspace,
            role: req.body.role,
            password: await bcrypt.hash(req.body.password, 10)
        });
        user = await user.save();
        const token = new Token({
            userId: user._id,
            token: crypto.randomBytes(16).toString('hex')
        });
        await token.save();
        const link = `http://127.0.0.1:4001/test/v1/user/confirm/${token.token}`;
        const email = user.email;
        await verifyMail(email, link);
        res.status(201).json({
            success: true,
            message: "Registration successful. Verification email sent.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

// Activate
exports.activateToken = async (req, res, next) => {
    try {
        const token = await Token.findOne({ token: req.params.token });

        if (!token) {
            return res.status(404).json({ success: false, message: "Token not found" });
        }

        await User.updateOne({ _id: token.userId }, { $set: { verified: true } });
        await Token.findOneAndDelete({ _id: token._id });

        const user = await User.findOne({ _id: token.userId });
        const jwtToken = user.getJWTToken();

        res.cookie('jwt', jwtToken, {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            message: "Email verified. You are now logged in.",
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
};

// Login user
exports.loginUser = async (req, res, next) => {
    const { email, password, workspace, verified } = req.body;
    try {
        if (!email || !password || !workspace) {
            return next(new ErrorHander("Please Enter Email, Password, and Workspace Name", 400));
        }

        const user = await User.findOne({ email, workspace }).select("+password");

        if (!user) {
            return next(new ErrorHander("Invalid Email, Password, or Workspace Name", 401));
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            return next(new ErrorHander("Invalid Password", 401));
        }
        if (user.verified == false) {
            return next(new ErrorHander("Please Verify First", 400));
        }
        const jwtToken = user.getJWTToken();

        res.cookie('jwt', jwtToken, {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            message: "Login successful.",
            user
        });
        // console.log(user)
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

// Logout
exports.logout = async (req, res, next) => {
    res.cookie("jwt", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out"
    });
};


//get all
exports.getAllUsers = async (req, res) => {
    const users = await User.find()
    res.status(200).json({
        success: true,
        users
    })
}

//get user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHander("User not found", 404));
    }
    res.status(200).json({
        success: true,
        user,
    });
});