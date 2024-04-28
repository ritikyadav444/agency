const Notification = require("../models/notificationModel");
const Combined = require('../models/combinedModel');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

exports.createNotification = catchAsyncErrors(async(req, res, next) => {
    try {
        const { userId, message } = req.body;
        const combinedId = req.session.combinedId;
        const combinedWorkSpaceName = req.session.combinedWorkSpaceName;
        // Create a new notification
        const notification = new Notification({
          userId,
          message,
          workspace_name:combinedWorkSpaceName
        });
    
        // Save the notification to the database
        await notification.save();
    
        res.status(201).json({ success: true, notification });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
    }
);

exports.getAllNotificationForAUser = catchAsyncErrors(async(req, res, next) => {
    try {
        const userId  = req.params.id;
        console.log(userId);
        const notifications = await Notification.find({ userId: userId });
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

exports.getAllNotificationUnderWorkspace = catchAsyncErrors(async(req, res, next) => {
    try {
        const workspaceName  = req.params.workspaceName; // Assuming workspaceName is passed in the request parameters
        console.log(workspaceName);
        
        // Find all users belonging to the workspace
        const usersInWorkspace = await Combined.find({ workspace_name: workspaceName }, 'userId');
        console.log(usersInWorkspace)

        // Find all notifications for these users
        const notifications = await Notification.find({ userId: { $in: usersInWorkspace } });
        
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


exports.printAllNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find();
        console.log(notifications);
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


exports.deleteNotificationById = catchAsyncErrors(async(req, res, next) => {
    try {
        const notificationId = req.params.id; // Assuming the notification ID is passed as a URL parameter
        console.log(notificationId);

        // Find the notification by its ID and delete it
        const deletedNotification = await Notification.findByIdAndDelete(notificationId);

        if (!deletedNotification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.status(200).json({ success: true, data: deletedNotification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

exports.deleteAllNotificationsForUser = catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.params.id; // Assuming the user ID is passed as a URL parameter
      console.log(userId);
  
      // Delete all notifications for the given user
      await Notification.deleteMany({ userId });
  
      res.status(200).json({ success: true, message: "Notifications deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  
