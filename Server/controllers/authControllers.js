import genToken from "../config/token.js";
import User from "../models/UserModel.js";
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
    try {
        let {firstName, lastName, userName, email, password} = req.body;

        let user_email = await User.findOne({email});
        if(user_email) {
            return res.status(400).json({message: 'User Email already exist!'});
        }

        let user_name = await User.findOne({userName});
        if(user_name) {
            return res.status(400).json({message: 'Username already exists!'});
        }

        if(password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long'
            })
        }

        let hashedPass = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName, 
            lastName, 
            userName, 
            email, 
            password: hashedPass
        });

        let token = await genToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });


        return res.status(201).json({user});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Signup Error!', error});
    }
}


export const login = async (req, res) => {
    try {
        let {email, password} = req.body;

        let user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: 'User does not exist!'});
        }

        let isPassMatched = await bcrypt.compare(password, user.password);
        if(!isPassMatched) {
            return res.status(400).json({
                message: 'Incorrect Password'
            })
        }

        let token = await genToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });

        return res.status(200).json({user});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Login Error!', error});
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({message: 'Logged out successfully!'});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Logout Error!', error});
    }
}