import { Notification } from "../models/notification.model.js";

export const createNotification = async (notificationData) => {
    try {
        const notification = new Notification(notificationData);
        await notification.save();
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};

export const getNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ recipient: req.userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('reference.id');

        const total = await Notification.countDocuments({ recipient: req.userId });

        res.status(200).json({
            success: true,
            notifications,
            pagination: {
                current: page,
                total: Math.ceil(total / limit),
                hasMore: skip + notifications.length < total
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.userId,
            isRead: false
        });
        res.status(200).json({ success: true, count });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({ success: true, notification });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.userId, isRead: false },
            { isRead: true }
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.userId
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully"
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ recipient: req.userId });
        res.status(200).json({
            success: true,
            message: "All notifications deleted successfully"
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};