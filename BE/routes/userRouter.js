const express = require('express');
const { registerUser, activateToken, loginUser, logout, getAllUsers, getUserDetails } = require('../controller/userController');
// const createTeamMember = require('../utils/jwtTeams');

const router = express.Router();


router.route("/new/user").post(registerUser);
router.route("/user/confirm/:token").get(activateToken)
router.route("/users").get(getAllUsers);
router.route("/user/:id").get(getUserDetails);

router.route("/login/user").post(loginUser);
router.route("/user/logout").get(logout);
module.exports = router