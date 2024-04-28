const express = require('express');
const { activateToken, verifyTeamEmail, loginCombined, getAllClient, getAllSuperAdmin, getAllTeam, logoutCombined, register, invite, createClient, deleteMembers, getAllUnderOne, updateClient, getClientDetails, updateTeam1, getTeamDetails, updatePassword, forgotPassword, resetPassword, getAllExceptClient, updateUserLoggedIn } = require('../controller/combinedController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/authentication');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();


router.route("/combined/newUser").post(register);
router.route("/combined/confirm/:token").get(activateToken)
router.route("/combined/newTeam").post(isAuthenticatedUser, invite, authorizeRoles('SUPERADMIN'));
router.route("/combined/newClient").post(isAuthenticatedUser, createClient, authorizeRoles('SUPERADMIN'));
router.route("/combined/getAllClient").get(isAuthenticatedUser, getAllClient)
router.route("/client/update/:id").put(upload.single('profile_img'), isAuthenticatedUser, updateClient)
router.route("/get/client/:id").get(isAuthenticatedUser, getClientDetails)
router.route("/getAll").get(isAuthenticatedUser, getAllUnderOne)
router.route("/getAllExceptClient").get(isAuthenticatedUser, getAllExceptClient)
router.route("/combined/getAllSuperAdmin").get(isAuthenticatedUser, getAllSuperAdmin)
router.route("/combined/verifyTeam/:token").put(verifyTeamEmail)
router.route("/combined/getAllTeam").get(isAuthenticatedUser, getAllTeam)
router.route("/team/update/:id").put(upload.single('profile_img'), isAuthenticatedUser, updateTeam1)
router.route("/get/team/:id").get(isAuthenticatedUser, getTeamDetails)
router.route("/member/delete/:id").delete(isAuthenticatedUser, deleteMembers)
router.route("/combined/login").post(loginCombined);
router.route("/combined/logout").get(logoutCombined);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:resetToken").put(resetPassword);
router.route("/combined/updateUserLoggedIn/:id").put(upload.single('profile_img'), isAuthenticatedUser, updateUserLoggedIn);


module.exports = router