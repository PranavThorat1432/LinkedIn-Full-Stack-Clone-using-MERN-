import Notification from "../models/NotificationModel.js"


export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            receiver: req.userId
        }).populate('relatedUser', 'firstName lastName profileImage userName')
        .populate('relatedPost', 'image desc')

        return res.status(200).json(notifications);

    } catch (error) {
        return res.status(500).json({
            message: `Get Notifications Error: ${error}`
        });
    }
}



export const deleteNotification = async (req, res) => {
    try {
        const {id} = req.params;
        await Notification.findOneAndDelete({
            _id: id,
            receiver: req.userId
        });

        return res.status(200).json({
            message: 'Notification Deleted'
        });

    } catch (error) {
        return res.status(500).json({
            message: `Delete Notification Error: ${error}`
        });
    }
}



export const clearAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({
            receiver: req.userId
        });

        return res.status(200).json({
            message: 'Notifications Cleared'
        });

    } catch (error) {
        return res.status(500).json({
            message: `Clear All Notification Error: ${error}`
        });
    }
}


