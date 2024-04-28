const Client = require("../models/clientModel");
const { sendEmail } = require('../utils/emailService');
const bcrypt = require("bcryptjs");
const express = require("express");
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const ErrorHander = require("../utils/errorHander");
const Token = require("../models/tokenClientModel");

async function createClient(clientData) {
    return Client.create(clientData);
}

exports.registerClient = async (req, res) => {
    try {
        const body = req.body;

        const { client_email, createdUnder } = body;

        let client = await Client.findOne({ client_email, createdUnder });
        if (client) {
            return res.status(400).json({ success: false, message: "Client with given workspace already exists!" });
        }

        const userWorkSpaceName = req.cookies.userWorkSpaceName
        body.createdUnder = userWorkSpaceName
        // console.log(clientData)

        console.log('--------------CreateClient--------------');
        const lastClient = await Client.findOne({}, {}, { sort: { clientId: -1 } });
        body.clientId = lastClient ? lastClient.clientId + 1 : 1;
        console.log(body.clientId)
        body.clientId = this.clientId;
        const clientData = body;

        client = await createClient(clientData);

        const tokenClient = new Token({
            // clientId: client._id,
            tokenClient: 'client' + crypto.randomBytes(8).toString('hex') + '_client',
        });
        await tokenClient.save();
        console.log(tokenClient)

        const emailSubject = 'Account Details';
        const clientLoginLink = `http://127.0.0.1:4001/test/v1/clientLogin/`;
        const emailText = `Your account has been created.\n\nUsername: ${client_email}\nPassword: ${client.client_password}\nWorkspace : ${userWorkSpaceName}\nCreatedAt : ${client.createdAt}\nTo Login : ${clientLoginLink}`;

        await sendEmail(client_email, emailSubject, emailText);

        return res.json({ success: true, message: 'Client registered successfully', client });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


//getAll
exports.getAllClients = async (req, res) => {
    // const userWorkSpaceName = req.cookies.userWorkSpaceName;
    // const client = await Client.find({ client_createdUnder: userWorkSpaceName })
    const client = await Client.find({})
    res.status(200).json({
        success: true,
        client
    })
}

//update client
exports.updateClient = async (req, res, next) => {
    let client = await Client.findById(req.params.id)

    if (!client) {
        return res.status(500).json({
            success: false,
            message: "Client Not Found"
        })
    }
    client = await Client.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        usefindAndModify: false
    });
    res.status(200).json({
        success: true,
        client
    })
}

//delete client
exports.deleteClient = async (req, res, next) => {
    const client = await Client.findById(req.params.id);

    if (!client) {
        return res.status(500).json({
            success: false,
            message: " Client Not found"
        })
    }
    console.log(client);
    await client.deleteOne();
    res.status(200).json({
        success: true,
        message: "Client Deleted Successfully"
    })
}


//login Client

exports.loginClient = async (req, res, next) => {
    try {
        const { client_email, client_password, createdUnder } = req.body;

        if (!client_email || !client_password || !createdUnder) {
            return next(new ErrorHander("Please Enter Email, Password, and Workspace Name", 400));
        }

        const client = await Client.findOne({ client_email, createdUnder }).select("+client_password");

        if (!client) {
            return next(new ErrorHander("Invalid Email, Password, or Workspace Name", 401));
        }

        // const clientCookieValue = 'client_' + crypto.randomBytes(8).toString('hex');
        // res.cookie('clientJwt', clientCookieValue, { httpOnly: true });


        // const jwtToken = jwt.sign({ id: client._id }, process.env.JWT_SECRET, {
        //     expiresIn: process.env.JWT_EXPIRE,
        //     algorithm: 'HS256',
        // });
        // const clientCookieValue = 'client_' + crypto.randomBytes(8).toString('hex');
        // res.cookie('clientCookie', clientCookieValue, {
        //     expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        //     httpOnly: true,
        //     sameSite: 'None',
        //     secure: true,
        // });
        const jwtToken = client.getJWTTokenClient();
        res.cookie('clientJwt', jwtToken, {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        });

        return res.json({
            success: true,
            client,
            jwtToken
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};


// Logout
exports.logoutClient = async (req, res, next) => {
    res.cookie("jwt", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out"
    });
};