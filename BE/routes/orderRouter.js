const express = require('express');
const { getAllOrders, createOrder, updateOrder, deleteOrder, getOrderDetails } = require('../controller/orderController');
const { authorizeRoles, isAuthenticatedUser } = require('../middleware/authentication');

const router = express.Router();


router.route("/orders").get(isAuthenticatedUser, getAllOrders);
router.route("/order/:id").get(isAuthenticatedUser, getOrderDetails);
router.route("/new/order").post(isAuthenticatedUser, createOrder);
router.route("/order/delete/:id").delete(isAuthenticatedUser, deleteOrder)
router.route("/order/update/:id").put(isAuthenticatedUser, updateOrder)


module.exports = router