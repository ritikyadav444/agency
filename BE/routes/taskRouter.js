const express = require('express');
const { getAllQuotes, createQuote, updateQuote, deleteQuote } = require('../controller/quoteController');
const { isAuthenticatedClient, authorizeRolesClient, isAuthenticatedUser, authorizeRoles } = require('../middleware/authentication');
const { createTask, getAllTasks, deleteTask, updateTask, getTaskDetails, getTaskByOrderId } = require('../controller/taskController');

const router = express.Router();

router.route("/task/new").post(isAuthenticatedUser, createTask)
router.route("/client/tasks").get(getAllTasks)
router.route("/tasks").get(isAuthenticatedUser, getAllTasks)
router.route("/task/order/:id").get(isAuthenticatedUser, getTaskByOrderId)

router.route("/task/:id").get(isAuthenticatedUser, getTaskDetails)


router.route("/task/delete/:id").delete(isAuthenticatedUser, deleteTask)
router.route("/task/update/:id").put(isAuthenticatedUser, updateTask)


module.exports = router