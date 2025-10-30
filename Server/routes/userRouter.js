import express from 'express';
import { getCurrentUser, getProfile, getSuggestedUsers, search, updateProfile } from '../controllers/userController.js';
import isAuth from '../middlewares/isAuth.js';
import upload from '../middlewares/multer.js'

const userRouter = express.Router();

userRouter.get('/current-user',isAuth, getCurrentUser);
userRouter.put('/updateProfile',isAuth, upload.fields([
    {name: 'profileImage', maxCount: 1},
    {name: 'coverImage', maxCount: 1},
]), updateProfile);

userRouter.get('/getProfile/:userName', isAuth, getProfile);
userRouter.get('/search', isAuth, search);
userRouter.get('/suggestedUsers', isAuth, getSuggestedUsers);

export default userRouter;