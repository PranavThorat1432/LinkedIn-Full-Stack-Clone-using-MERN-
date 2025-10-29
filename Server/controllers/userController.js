import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/UserModel.js"

export const getCurrentUser = async (req, res) => {
    try {
        const id = req.userId;
        const user = await User.findById(id).select('-password');
        if(!user) {
            return res.status(400).json({
                message: 'User not found'
            })
        }

        return res.status(200).json({user});
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
        })
    }
}


export const updateProfile = async (req, res) => {
    try {
        const {firstName, lastName, userName, headline, location, gender} = req.body;
        const skills = req.body.skills?JSON.parse(req.body.skills) : [];
        const education = req.body.education?JSON.parse(req.body.education) : [];
        const experience = req.body.experience?JSON.parse(req.body.experience) : [];

        const updateData = {
            firstName, 
            lastName, 
            userName, 
            headline, 
            location, 
            gender, 
            skills, 
            education, 
            experience
        };

        console.log(req.files);
        
        if (req.files?.profileImage) {
            const profileImageUrl = await uploadOnCloudinary(req.files.profileImage[0].path);
            updateData.profileImage = profileImageUrl;
        }

        if (req.files?.coverImage) {
            const coverImageUrl = await uploadOnCloudinary(req.files.coverImage[0].path);
            updateData.coverImage = coverImageUrl;
        }

        let user = await User.findByIdAndUpdate(
            req.userId,
            updateData,
            { new: true }
        ).select('-password');

        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}


export const getProfile = async (req, res) => {
    try {
        const {userName} = req.params;
        const user = await User.findOne({userName}).select('-password');

        if(!user) {
            return res.status(400).json({
                message: 'Username doest not exist!'
            })
        }

        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Get Profile Error: ${error}`
        })
    }
}


export const search = async (req, res) => {
    try {
        let {query} = req.query;
        if(!query) {
            return res.status(400).json({
                message: 'Query is required'
            });
        }

        let users = await User.find({
            $or: [
                {firstName: {$regex: query, $options: 'i'}},
                {lastName: {$regex: query, $options: 'i'}},
                {userName: {$regex: query, $options: 'i'}},
                {skills: {$in: [query]}},
            ]
        })

        return res.status(200).json(users);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Search Error: ${error}`
        })
    }
}


export const getSuggestedUsers = async (req, res) => {
    try {
        let currentUser = await User.findById(req.userId).select('connections');

        const suggestedUser = await User.find({
            _id: {
                $ne: currentUser,
                $nin: currentUser.connections
            }
        }).select('-password')

        return res.status(200).json(suggestedUser);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Suggested User Error: ${error}`
        })
    }
}