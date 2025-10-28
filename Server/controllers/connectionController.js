import Connection from "../models/ConnectionModel.js";
import Notification from "../models/NotificationModel.js";
import User from "../models/UserModel.js";
import {io, userSocketMap} from '../server.js';


export const sendConnection = async (req, res) => {
    try {
        const {id} = req.params;
        const sender = req.userId;

        if(sender === id) {
            return res.status(400).json({
                message: 'You cannot send a connection request to yourself!'
            })
        }

        // Refresh user data from database to get latest connections
        const user = await User.findById(sender);
        if(user.connections.includes(id)) {
            return res.status(400).json({
                message: 'You are already connected!'
            })
        }

    const existingConnection = await Connection.findOne({ 
        sender,
        receiver: id,
        status: 'pending'
    })

    if(existingConnection) {
        return res.status(400).json({
            meassage: 'Connection request already sent!'
        })
    }

    const newRequest = await Connection.create({
        sender,
        receiver: id
    })

    const receiverSocketId = userSocketMap.get(id);
    const senderSocketId = userSocketMap.get(sender);

    if(receiverSocketId) {
        io.to(receiverSocketId).emit('statusUpdate', {updatedUserId: sender, newStatus: 'received'});
    }

    if(senderSocketId) {
        io.to(senderSocketId).emit('statusUpdate', {updatedUserId: id, newStatus: 'pending'});
    }

    return res.status(200).json(newRequest);

    } catch (error) {
        return res.status(500).json({
            message: `Send connection error: ${error}`
        })
    }
};

export const acceptConnection = async (req, res) => {
    try {
        const {connectionId} = req.params;
        const connection = await Connection.findById(connectionId);

        if(!connection) {
            return res.status(404).json({
                message: 'Connection not found!'
            })
        }

        if(connection.status != 'pending') {
            return res.status(404).json({
                message: 'Request under process'
            })
        }

        connection.status = 'accepted';
        let notification = await Notification.create({
            receiver: connection.sender,
            type: 'connectionAccepted',
            relatedUser: connection.sender._id,
        });
        await connection.save();
        await User.findByIdAndUpdate(req.userId, {
            $addToSet: {
                connections: connection.sender._id
            }
        })
        await User.findByIdAndUpdate(connection.sender._id, {
            $addToSet: {
                connections: req.userId
            }
        })

        const receiverSocketId = userSocketMap.get(connection.receiver._id.toString());
        const senderSocketId = userSocketMap.get(connection.sender._id.toString());

        if(receiverSocketId) {
            io.to(receiverSocketId).emit('statusUpdate', {updatedUserId: connection.sender._id, newStatus: 'Disconnect'});
        }

        if(senderSocketId) {
            io.to(senderSocketId).emit('statusUpdate', {updatedUserId: connection.sender._id, newStatus: 'Disconnect'});
        }

        return res.status(200).json({
            message: 'Connection Accepted!'
        })

    } catch (error) {
        return res.status(500).json({
            message: `Accept Connection Error: ${error}`
        })
    }
};


export const rejectConnection = async (req, res) => {
    try {
        const {connectionId} = req.params;
        const connection = await Connection.findById(connectionId);

        if(!connection) {
            return res.status(404).json({
                message: 'Connection not found!'
            })
        }

        if(connection.status != 'pending') {
            return res.status(404).json({
                message: 'Request under process'
            })
        }

        connection.status = 'rejected';
        await connection.save();

        return res.status(200).json({
            message: 'Connection Rejected!'
        })

    } catch (error) {
        return res.status(500).json({
            message: `Reject Connection Error: ${error}`
        })
    }
};


export const getConnectionStatus = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.userId;

        const currentUser = await User.findById(currentUserId);
        if(currentUser.connections.includes(targetUserId)) {
            return res.json({
                status: 'Disconnect'
            })
        }

        const pendingRequest = await Connection.findOne({
            $or: [
                {sender: currentUserId, receiver: targetUserId},
                {sender: targetUserId, receiver: currentUserId},
            ],
            status: 'pending'
        });

        if(pendingRequest) {
            if(pendingRequest.sender.toString() === currentUserId.toString()) {
                return res.json({
                    status: 'pending'
                });
            } else {
                return res.json({
                    status: 'received',
                    requestId: pendingRequest._id
                });
            }
        }

        //If no connection or pending request found
        return res.json({
            status: 'Connect'
        });

    } catch (error) {
        return res.status(500).json({
            message: `Get Connection Status Error: ${error}`
        })
    }
};


export const removeConnection = async (req, res) => {
    try {
        const myId = req.userId;
        const otherUserId = req.params.userId;

        await User.findByIdAndUpdate(myId, {$pull: {connections: otherUserId}});
        await User.findByIdAndUpdate(otherUserId, {$pull: {connections: myId}});

        const receiverSocketId = userSocketMap.get(otherUserId);
        const senderSocketId = userSocketMap.get(myId); 

        if(receiverSocketId) {
            io.to(receiverSocketId).emit('statusUpdate', {updatedUserId: otherUserId, newStatus: 'Connect'});
        }

        if(senderSocketId) {
            io.to(senderSocketId).emit('statusUpdate', {updatedUserId: otherUserId, newStatus: 'Connect'});
        }
        
        return res.json({
            message: 'Connection Removed'
        });

    } catch (error) {
        res.status(500).json({
            message: `Connection Remove Error: ${error}`
        });
    }
};


export const getConnectionRequests = async (req, res) => {
    try {
        const userId = req.userId;

        const requests = await Connection.find({receiver: userId, status: 'pending'}).populate('sender', 'firstName lastName email userName profileImage headline');

        return res.status(200).json(requests);

    } catch (error) {
        console.log(`Error in getConnectionRequests: ${error}`);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};


export const getUserConnections = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).populate('connections', 'firstName lastName userName profileName headline connections');

        return res.status(200).json(user.connections);

    } catch (error) {
        console.log(`Error in getUserConnections: ${error}`);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};