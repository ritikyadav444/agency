// const Workspace = require('../models/workspaceModel');
const Team = require('../models/teamModel');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");

// const { verifyMail } = require('../utils/jwtTokens');
const verifyMail1 = require('../utils/jwtTeams');
const TokenTeam = require('../models/tokenTeamModel');
const ErrorHander = require('../utils/errorHander');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');

// Super admin creates a new team by sending an email invitation
exports.inviteTeamToWorkspace = async (req, res, next) => {
    try {
        const { team_email, role, team_createdUnder } = req.body;

        // Check if the team already exists in the workspace
        const existingTeam = await Team.findOne({ team_email, team_createdUnder: team_createdUnder });

        if (existingTeam) {
            return res.status(400).json({ success: false, message: 'Team already exists in the workspace.' });
        }

        // Create a new team with a verification token
        // console.log(req.cookies)
        const userEmail = req.cookies.userEmail
        const userWorkSpaceName = req.cookies.userWorkSpaceName
        req.body.team_createdUnder = userWorkSpaceName

        const newTeam = new Team({
            team_email: req.body.team_email,
            role: req.body.role,
            team_createdUnder: req.body.team_createdUnder,
        });

        const team = await newTeam.save();
        // console.log('Team: ', team)
        const token = new TokenTeam({
            teamId: team._id,
            tokenTeam: crypto.randomBytes(16).toString('hex')
        });
        await token.save();


        // Encode the token before appending it to the URL

        // console.log(token.tokenTeam)
        // Create the verification link
        const verificationLink = `http://127.0.0.1:4001/test/v1/users/verify/${token.tokenTeam}`;


        console.log(token)
        // Send verification email to the team
        await verifyMail1(team_email, 'Join and complete you registration', `${userEmail}has invited you\n\n\nFor Role:${team.role}\n\nClick <a href="${verificationLink}">here</a> to join under workspace:${userWorkSpaceName}.`);

        res.status(201).json({
            success: true,
            message: 'Team invitation sent successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Team verifies their email and completes registration
exports.verifyTeamEmail = async (req, res, next) => {
    try {
        const { tokenTeam } = req.params;

        const tokenObj = await TokenTeam.findOne({ tokenTeam });
        // console.log(tokenObj)
        if (!tokenObj) {
            return res.status(404).json({ success: false, message: 'Token not found.' });
        }

        const team = await Team.findById(tokenObj.teamId);

        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found.' });
        }

        const { team_fname, team_lname, team_password } = req.body;

        if (!team_password) {
            return res.status(400).json({ success: false, message: "Password is required." });
        }

        // Update team details
        team.team_fname = team_fname;
        team.team_lname = team_lname;
        team.team_password = bcrypt.hashSync(team_password, team.team_password, 10);
        team.verified = true;

        await team.save();

        await TokenTeam.findByIdAndDelete(tokenObj._id);
        console.log(team_password)
        const jwtToken = team.generateAuthToken();
        res.cookie('jwt', jwtToken, {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            message: 'Email verified. You are now logged in.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
};

//login
exports.loginTeam = async (req, res, next) => {
    const { team_email, team_password, team_createdUnder, verified } = req.body;
    try {
        if (!team_email || !team_password) {
            return next(new ErrorHander("Please Enter Email, Password, and Workspace Name", 400));
        }

        const team = await Team.findOne({ team_email }).select("+password");

        if (!team) {
            return next(new ErrorHander("Invalid Email, Password, or Workspace Name", 401));
        }

        const isPasswordMatched = await bcrypt.compare(team_password, team.team_password);

        if (!isPasswordMatched) {
            return next(new ErrorHander("Invalid Password", 401));
        }
        // if (user.verified == false) {
        //     return next(new ErrorHander("Please Verify First", 400));
        // }
        const jwtToken = team.getJWTToken();

        res.cookie('jwt', jwtToken, {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            message: "Login successful.",
            team
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

//get all team
exports.getAllTeams = async (req, res) => {
    const userWorkSpaceName = req.cookies.userWorkSpaceName;
    const teams = await Team.find({})
    console.log(req.body.workspace_name)
    res.status(200).json({
        success: true,
        teams
    })
}

//get team details


//update team

//delete team
exports.deleteTeam = async (req, res, next) => {
    const team = await Team.findById(req.params.id);

    if (!team) {
        return res.status(500).json({
            success: false,
            message: " Team Not found"
        })
    }
    console.log(team);
    await team.deleteOne();
    res.status(200).json({
        success: true,
        message: "Team Deleted Successfully"
    })
}