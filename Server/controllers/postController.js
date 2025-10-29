import uploadOnCloudinary from "../config/cloudinary.js";
import Notification from "../models/NotificationModel.js";
import Post from "../models/PostModel.js";
import { io } from "../server.js";


export const createPost = async (req, res) => {
    try {
        // console.log('Complete Request Body:', JSON.stringify(req.body, null, 2));
        // console.log('Uploaded file:', req.file);
        
        // Check all fields in the request body
        // console.log('Available fields in body:', Object.keys(req.body));
        
        // Try to get description from different possible field names
        const desc = req.body.desc || req.body.description || '';
        // console.log('Extracted description:', desc);
        
        if (!desc && !req.file) {
            return res.status(400).json({
                success: false,
                message: 'Either description or image is required'
            });
        }

        let newPostData = {
            author: req.userId,
            desc: desc || ''
        };

        if (req.file) {
            // console.log('Uploading file to Cloudinary...');
            try {
                const imageUrl = await uploadOnCloudinary(req.file.path);
                if (!imageUrl) {
                    throw new Error('Failed to upload image to Cloudinary');
                }
                newPostData.image = imageUrl;
                // console.log('File uploaded to Cloudinary:', imageUrl);
            } catch (uploadError) {
                // console.error('Cloudinary upload error:', uploadError);
                return res.status(500).json({
                    success: false,
                    message: 'Error uploading image',
                    error: uploadError.message
                });
            }
        }

        // console.log('Creating new post with data:', newPostData);
        const newPost = await Post.create(newPostData);
        
        return res.status(201).json({
            success: true,
            data: newPost
        });

    } catch (error) {
        console.error('Create Post Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating post',
            error: error.message
        });
    }
}


export const getPost = async(req, res) => {
    try {
        const post = await Post.find().populate('author', 'firstName lastName profileImage headline userName')
        .populate('comment.user', 'firstName lastName profileImage headline')
        .sort({createdAt: -1})
        return res.status(200).json(post);

    } catch (error) {
        return res.status(500).json({
            message: 'Get Post Internal Error'
        })
    }
}


export const like = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId; 

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({
                message: 'Post not found'
            })
        }

        if(post.like.includes(userId)) {
            post.like = post.like.filter((id) => id != userId);

        } else {
            post.like.push(userId);
            if(post.author != userId) {
                let notification = await Notification.create({
                    receiver: post.author,
                    type: 'like',
                    relatedUser: userId,
                    relatedPost: postId
                });
            }
        }

        await post.save();
        
        io.emit('likeUpdated', {postId, likes: post.like})

        return res.status(200).json({
            post
        })

    } catch (error) {
        return res.status(500).json({
            message: `Like Error: ${error}`
        })
    }
}


export const comment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;
        const {content} = req.body;

        const post = await Post.findByIdAndUpdate(postId, {
            $push: {
                comment: {
                    content,
                    user: userId,
                }
            }
        }, {new: true}).populate('comment.user', 'firstName lastName headline profileImage');

        if(post.author != userId) {
            let notification = await Notification.create({
                    receiver: post.author,
                    type: 'comment',
                    relatedUser: userId,
                    relatedPost: postId
                });
        }

        io.emit('commentAdded', {postId, comments: post.comment})

        return res.status(200).json(post);

    } catch (error) {
        return res.status(500).json({
            message: `Comment Error: ${error}`
        })
    }
}