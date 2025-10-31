import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { 
    FaUserPlus, 
    FaUserFriends, 
    FaUsers,
    FaSearch,
} from 'react-icons/fa';
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from 'react-icons/io5';
import Navbar from '../Components/Navbar';
import { authContextData } from '../Context/AuthContext';
import profilepic from '../assets/profilepic.png';
import { userContextData } from '../Context/UserContext';

const Network = () => {
    const { serverUrl } = useContext(authContextData);
    const { userData } = useContext(userContextData);
    const [activeTab, setActiveTab] = useState('invitations');
    const [connections, setConnections] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMoreOptions, setShowMoreOptions] = useState(null);
    
    const tabs = [
        { id: 'invitations', label: 'Invitations', icon: <FaUserPlus className="mr-2" /> },
        { id: 'connections', label: 'Connections', icon: <FaUserFriends className="mr-2" /> },
        { id: 'suggestions', label: 'People you may know', icon: <FaUsers className="mr-2" /> }
    ];

    const fetchData = async () => {
        try {
            setIsLoading(true);
            // Fetch connection requests
            const requests = await axios.get(`${serverUrl}/api/connection/requests`, {
                withCredentials: true
            });
            setConnections(requests.data);
            
            // Fetch suggested users
            const suggestionsRes = await axios.get(`${serverUrl}/api/user/suggestedUsers`, {
                withCredentials: true
            });
            setSuggestions(suggestionsRes.data || []);
            
        } catch (error) {
            console.error('Error fetching network data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleAcceptConnection = async (requestId) => {
        try {
            await axios.put(`${serverUrl}/api/connection/accept/${requestId}`, {}, {
                withCredentials: true
            });
            setConnections(connections.filter(con => con._id !== requestId));
        } catch (error) {
            console.error('Error accepting connection:', error);
        }
    };

    const handleRejectConnection = async (requestId) => {
        try {
            await axios.put(`${serverUrl}/api/connection/reject/${requestId}`, {}, {
                withCredentials: true
            });
            setConnections(connections.filter(con => con._id !== requestId));
        } catch (error) {
            console.error('Error rejecting connection:', error);
        }
    };
    
    const handleConnect = async (userId) => {
        try {
            await axios.post(`${serverUrl}/api/connection/send/${userId}`, {}, {
                withCredentials: true
            });
            // Update UI to show pending status
            setSuggestions(suggestions.map(user => 
                user._id === userId ? { ...user, connectionStatus: 'pending' } : user
            ));
        } catch (error) {
            console.error('Error sending connection request:', error);
        }
    };
    
    const renderConnectionStatus = (user) => {
        if (user.connectionStatus === 'pending') {
            return (
                <span className="text-sm text-gray-500">Request sent</span>
            );
        }
        return (
            <button 
                onClick={() => handleConnect(user._id)}
                className="px-4 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            >
                Connect
            </button>
        );
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="animate-pulse flex space-x-4 w-full">
                                <div className="rounded-full bg-gray-200 h-14 w-14"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (activeTab === 'invitations') {
            if (connections.length === 0) {
                return (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <FaUserFriends className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No pending invitations</h3>
                        <p className="mt-1 text-gray-500">When you have connection requests, you'll see them here.</p>
                    </div>
                );
            }

            return (
                <div className="space-y-4">
                    {connections.map((connection) => (
                        <div key={connection._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-4">
                                <div className="flex items-start">
                                    <img 
                                        src={connection.sender?.profileImage || profilepic} 
                                        alt={`${connection.sender?.firstName} ${connection.sender?.lastName}`} 
                                        className="h-14 w-14 rounded-full object-cover border border-gray-200"
                                    />
                                    <div className="ml-4 flex-1">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {`${connection.sender?.firstName} ${connection.sender?.lastName}`}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {connection.sender?.headline || 'No headline provided'}
                                        </p>
                                        <div className="mt-3 flex space-x-3">
                                            <button
                                                onClick={() => handleAcceptConnection(connection._id)}
                                                className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors flex items-center"
                                            >
                                                <IoCheckmarkCircleOutline className="mr-1.5" />
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleRejectConnection(connection._id)}
                                                className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors flex items-center"
                                            >
                                                <IoCloseCircleOutline className="mr-1.5" />
                                                Decline
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (activeTab === 'suggestions') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestions.length > 0 ? (
                        suggestions.map((user) => (
                            <div key={user._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-4">
                                    <div className="flex flex-col items-center text-center">
                                        <img 
                                            src={user.profileImage || profilepic} 
                                            alt={`${user.firstName} ${user.lastName}`}
                                            className="h-20 w-20 rounded-full object-cover border-2 border-white shadow-sm"
                                        />
                                        <h3 className="mt-3 text-lg font-medium text-gray-900">
                                            {`${user.firstName} ${user.lastName}`}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {user.headline || 'No headline provided'}
                                        </p>
                                        <div className="mt-4 w-full">
                                            {renderConnectionStatus(user)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-12 bg-white rounded-lg shadow-sm">
                            <FaUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No suggestions available</h3>
                            <p className="mt-1 text-gray-500">We'll suggest people for you to connect with based on your profile.</p>
                        </div>
                    )}
                </div>
            );
        }

        // Connections tab (to be implemented)
        return (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <FaUserFriends className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Your connections will appear here</h3>
                <p className="mt-1 text-gray-500">Start connecting with people to see them here.</p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Manage my network</h1>
                            <div className="relative w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Search by name"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        {/* Tabs */}
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                        {tab.id === 'invitations' && connections.length > 0 && (
                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {connections.length}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
                
                {/* Content */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
  )
}

export default Network
