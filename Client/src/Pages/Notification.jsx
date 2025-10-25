import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { 
    FaThumbsUp, 
    FaComment, 
    FaUserPlus, 
    FaBell, 
    FaEllipsisH,
    FaCheck,
    FaUserCheck
} from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import Navbar from '../Components/Navbar';
import { authContextData } from '../Context/AuthContext';
import profilepic from '../assets/profilepic.png';
import { userContextData } from '../Context/userContext';



const Notification = () => {
    const { userData,handleGetProfile } = useContext(userContextData);
    const { serverUrl } = useContext(authContextData);
    const [notificationData, setNotificationData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    const handleGetNotification = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get(`${serverUrl}/api/notification/getNotifications`, {
                withCredentials: true
            });
            setNotificationData(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleDeleteNotification = async (id) => {
        try {
            let result = await axios.delete(`${serverUrl}/api/notification/deleteNotification/${id}`, {
                withCredentials: true
            });
            console.log(result.data);
            await handleGetNotification();
            
        } catch (error) {
            console.log(error);
        }
    };


    const handleClearNotifications = async (id) => {
        try {
            let result = await axios.delete(`${serverUrl}/api/notification`, {
                withCredentials: true
            });
            console.log(result.data);
            await handleGetNotification();

        } catch (error) {
            console.log(error);
        }
    };

    const getNotificationIcon = (type) => {
        switch(type) {
            case 'like':
                return <FaThumbsUp className="text-blue-500" />;
            case 'comment':
                return <FaComment className="text-blue-500" />;
            case 'connection':
                return <FaUserPlus className="text-blue-500" />;
            default:
                return <FaBell className="text-blue-500" />;
        }
    };

    const getNotificationMessage = (notification) => {
        const { type, relatedUser } = notification;
        const userName = `${relatedUser?.firstName} ${relatedUser?.lastName}`;
        
        switch(type) {
            case 'like':
                return `${userName} liked your post`;
            case 'comment':
                return `${userName} commented on your post`;
            case 'connection':
                return `${userName} accepted your connection request`;
            default:
                return 'New notification';
        }
    };


    useEffect(() => {
        handleGetNotification();
    }, [])



  return (
    <div className="min-h-screen bg-gray-100">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                            {notificationData.length > 0 && (
                                <span className="ml-3 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                    {notificationData.length} new
                                </span>
                            )}
                        </div>
                        
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => handleClearNotifications()}
                                disabled={notificationData.length === 0}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                                    notificationData.length > 0 
                                        ? 'text-red-600 hover:bg-red-50' 
                                        : 'text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                Clear all
                            </button>
                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                                <FaEllipsisH className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex mt-6 space-x-4 overflow-x-auto">
                        {['all', 'unread', 'mentions'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap ${
                                    activeTab === tab
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="animate-pulse space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex space-x-4 p-4 border-b border-gray-100">
                                    <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : notificationData.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {notificationData.map((notification) => (
                            <div 
                                key={notification._id} 
                                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                            >
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-4">
                                        <div className="relative">
                                            <img 
                                                src={notification.relatedUser?.profileImage || profilepic} 
                                                alt={notification.relatedUser?.firstName} 
                                                className="h-12 w-12 rounded-full object-cover"
                                            />
                                            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {getNotificationMessage(notification)}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                            
                                            <div className="flex space-x-2">
                                                <button 
                                                    onClick={() => handleDeleteNotification(notification._id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                    aria-label="Delete notification"
                                                >
                                                    <IoMdClose className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {notification.relatedPost?.desc && (
                                            <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <p className="line-clamp-2">{notification.relatedPost.desc}</p>
                                            </div>
                                        )}
                                        
                                        <div className="mt-3 flex space-x-2">
                                            {notification.type === 'connection' && (
                                                <button className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800">
                                                    <FaUserCheck className="w-3.5 h-3.5" />
                                                    <span>Connected</span>
                                                </button>
                                            )}
                                            
                                            {notification.relatedPost && (
                                                <button 
                                                    className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                                                    onClick={() => handleGetProfile(notification.relatedUser?.userName)}
                                                >
                                                    View profile
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="text-gray-400 mb-4">
                            <FaBell className="mx-auto h-12 w-12" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications yet</h3>
                        <p className="text-gray-500">When you get notifications, they'll appear here</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default Notification
