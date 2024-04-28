const express = require('express');
const { getAllServices, createService, updateService, deleteService, getServiceDetails, getAdminServices } = require('../controller/serviceController');
const { authorizeRoles, isAuthenticatedClient, isAuthenticatedUser, authorizeRolesClient, } = require("../middleware/authentication");
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/services").get(isAuthenticatedUser, getAllServices);
router.route("/services/client").get(isAuthenticatedUser, getAllServices);
router.route("/get/service/:id").get(isAuthenticatedUser, getServiceDetails);
router.route("/admin/services").get(isAuthenticatedUser, getAdminServices);
router.route("/new/service").post(upload.single('service_cover_img'), isAuthenticatedUser, createService);

router.route("/service/delete/:id").delete(isAuthenticatedUser, deleteService)
router.route("/service/update/:id").put(upload.single('service_cover_img'), isAuthenticatedUser, updateService)
module.exports = router