const Order = require("../models/orderModel");
const Team = require("../models/teamModel")
const Task = require("../models/taskModel");
const ErrorHander = require("../utils/errorHander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Combined = require("../models/combinedModel");


//create task
exports.createTask = (async (req, res, next) => {
    const combinedId = req.cookies.combinedId
    const combinedWorkSpaceName = req.cookies.combinedWorkSpaceName
    req.body.createdBy = combinedId
    req.body.workspace_name = combinedWorkSpaceName
    console.log(combinedId)
    console.log(combinedWorkSpaceName)

    const user = await Combined.findOne({ _id: req.body.assigneeId });
    console.log(user)
    const allowedRoles = ['ADMIN', 'SUPERADMIN', 'PROJECTMANAGER', 'ASSIGNEE'];
    if (allowedRoles.includes(user.role)) {
        const task = await Task.create(req.body);
        res.status(201).json({
            success: true,
            task,
        })
    }
    else{
        return res.status(500).json({
            success: false,
            message: "Role Client"
        })
    }
});

//get task
exports.getAllTasks = async (req, res) => {
        const combinedId = req.cookies.combinedId;
        const combinedWorkSpaceName = req.cookies.combinedWorkSpaceName;
        const tasks = await Task.find({
            workspace_name: combinedWorkSpaceName,
        });
        res.status(200).json({
            success: true,
            tasks
        });

}

exports.getTaskByOrderId = async (req, res) => {
    const combinedId = req.cookies.combinedId;
    const combinedWorkSpaceName = req.cookies.combinedWorkSpaceName;
    const tasks = await Task.find({
        workspace_name: combinedWorkSpaceName,
        orderId: req.params.id
    });
    res.status(200).json({
        success: true,
        tasks
    });

}

exports.getTaskDetails = catchAsyncErrors(async (req, res, next) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return next(new ErrorHander("task not found", 404));
    }
    res.status(200).json({
        success: true,
        task,
    });
    console.log(task);
});

//update Task
exports.updateTask = async (req, res, next) => {
    let task = await Task.findById(req.params.id)

    if (!task) {
        return res.status(500).json({
            success: false,
            message: "task Not Found"
        })
    }
    if (task.status === "Done") {
        return next(new ErrorHander("You have Done This task"))
    }

    task.status = req.body.status;
    if (req.body.status === "") {
        task.statusAt = Date.now()
    }
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        usefindAndModify: false
    });
    await task.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        task
    })
}


//delete Task 

exports.deleteTask = async (req, res, next) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(500).json({
            success: false,
            message: "Task Not found"
        })
    }
    console.log(task);
    await task.deleteOne();
    res.status(200).json({
        success: true,
        message: "Task Deleted Successfully"
    })
}