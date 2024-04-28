const express = require('express');
const workspaceController = require('../controller/workspaceController');
const { isAuthenticatedUser } = require('../middleware/authentication');

const router = express.Router();



router.route("/new/team").post(workspaceController.inviteTeamToWorkspace);
router.route('/users/verify/:tokenTeam').get(workspaceController.verifyTeamEmail);
router.route('/login/team').post(workspaceController.loginTeam)
router.route('/teams').get(workspaceController.getAllTeams)
router.route('/team/:id').delete(workspaceController.deleteTeam)


module.exports = router;