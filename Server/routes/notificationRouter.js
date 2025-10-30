import express from "express";
import { clearAllNotifications, deleteNotification, getNotifications } from "../controllers/notificationControllers.js";
import isAuth from '../middlewares/isAuth.js'

const notificationRouter = express.Router();

notificationRouter.get('/getNotifications', isAuth, getNotifications)
notificationRouter.delete('/deleteNotification/:id', isAuth, deleteNotification)
notificationRouter.delete('/', isAuth, clearAllNotifications)

export default notificationRouter;