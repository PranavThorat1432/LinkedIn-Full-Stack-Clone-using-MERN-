import React, { useContext, useEffect, useState } from 'react'
import { authContextData } from '../Context/AuthContext'
import axios from 'axios'
import { userContextData } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../Context/SocketContext';

function ConnectionButton({userId}) {

    let {serverUrl} = useContext(authContextData);
    let {userData, setUserData} = useContext(userContextData);
    const { socket } = useSocket();
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const handleSendConnection = async() => {
        try {
            let result = await axios.post(`${serverUrl}/api/connection/send/${userId}`, {},
                {withCredentials: true} 
            )
            console.log(result);

        } catch (error) {
            console.log(error);
        }
    }

    const handleRemoveConnection = async() => {
        try {
            let result = await axios.delete(`${serverUrl}/api/connection/remove/${userId}`, {
                withCredentials: true
            });
            console.log(result);
            // Update status immediately to 'Connect' since we know the removal was successful
            setStatus('Connect');
        } catch (error) {
            console.error('Error removing connection:', error);
        }
    }

    const handleGetStatus = async() => {
        try {
            let result = await axios.get(`${serverUrl}/api/connection/getStatus/${userId}`, 
                {withCredentials: true}
            )
            console.log(result);
            setStatus(result.data.status);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!socket) return;
        
        handleGetStatus()

        const handleStatusUpdate = ({updatedUserId, newStatus}) => {
            if(updatedUserId == userId) {
                setStatus(newStatus);
            }
        }

        socket.on('statusUpdate', handleStatusUpdate)

        // Cleanup function to remove the listener
        return () => {
            socket.off('statusUpdate', handleStatusUpdate)
        }

    }, [socket, userId])
    
    const handleClick = async () => {
        if(status === 'Disconnect') {
            await handleRemoveConnection();

        } else if(status === 'received') {
            navigate('/network');

        } else {
            await handleSendConnection();
        }
    }

  return (
    <button onClick={handleClick} className='min-w-[100px] h-[40px] rounded-full border-2 bg-[#0099ff] text-white cursor-pointer px-[15px]' disabled={status == 'pending'}>{status}</button>
  )
}

export default ConnectionButton
