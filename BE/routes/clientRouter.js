const express = require('express');
const { createClient, updateClient, deleteClient, getAllClients, registerClient, loginClient, logoutClient } = require('../controller/clientController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/authentication');

const router = express.Router();

router.route("/new/client").post(registerClient);
// router.route("/clients").get(isAuthenticatedUser, getAllClients);
router.route("/clients").get(getAllClients);

router.route("/client/:id").put(updateClient).delete(deleteClient)
router.route("/login/client").post(loginClient);
router.route("/client/logout").get(logoutClient);



module.exports = router