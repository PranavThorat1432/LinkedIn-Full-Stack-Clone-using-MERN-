import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { userContextData } from './userContext';

const SocketContext = createContext();

const backendUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { userData } = useContext(userContextData);

    useEffect(() => {
        // Create socket connection
        const newSocket = io(backendUrl, {
            withCredentials: true,
            transports: ['websocket']
        });

        setSocket(newSocket);

        // Cleanup on unmount
        return () => {
            newSocket.close();
        };
    }, []);

    useEffect(() => {
        // Register user when socket and userData are available
        if (socket && userData?._id) {
            socket.emit('register', userData._id);
        }
    }, [socket, userData?._id]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

