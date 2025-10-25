import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { userContextData } from '../Context/userContext';
import { authContextData } from '../Context/AuthContext';
import profilepic from '../assets/profilepic.png';
import { FiCamera, FiLink, FiMapPin, FiBriefcase, FiAward, FiBook, FiUserPlus } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { HiPencil, HiOutlineDotsHorizontal } from 'react-icons/hi';

import { AiOutlineMail } from 'react-icons/ai';
import EditProfile from '../Components/EditProfile';
import Post from '../Components/Post';
import ConnectionButton from '../Components/ConnectionButton';


const Profile = () => {
    const { userData, edit, setEdit, postData, profileData, handleGetProfile } = useContext(userContextData);
    const { serverUrl } = useContext(authContextData);
    const { userName } = useParams();

    const [profilePost, setProfilePost] = useState([]);
    const [currentProfileData, setCurrentProfileData] = useState(null);
    const [activeTab, setActiveTab] = useState('posts');
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (userName && profileData) {
            setCurrentProfileData(profileData);
            setIsConnected(userData?.user?.connections?.includes(profileData._id) || false);
        } else if (!userName && userData?.user) {
            setCurrentProfileData(userData.user);
            setIsConnected(true);
        }
    }, [userName, profileData, userData]);

    useEffect(() => {
        if (currentProfileData) {
            setProfilePost(postData.filter((post) => post.author._id === currentProfileData._id));
        }
    }, [currentProfileData, postData]);

    const isOwnProfile = !userName || (userData?.user?._id === currentProfileData?._id);

  return (
        <div className='min-h-screen bg-[#f3f2ef] pt-16'>
            <Navbar />
            {edit && <EditProfile />}

            {/* Cover Photo */}
            <div className='relative'>
                <div 
                    className='h-48 md:h-64 w-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center cursor-pointer relative z-10'
                    onClick={() => isOwnProfile && setEdit(true)}
                >
                    {currentProfileData?.coverImage ? (
                        <img 
                            src={currentProfileData.coverImage} 
                            alt="Cover" 
                            className='w-full h-full object-cover'
                        />
                    ) : (
                        isOwnProfile && <FiCamera className='text-white text-2xl' />
                    )}
                </div>

                {/* Profile Picture and Info */}
                <div className='bg-white'>
                    <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
                        <div className='flex flex-col md:flex-row md:justify-between md:items-end pb-6 pt-4'>
                            <div className='flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 -mt-16 relative z-20'>
                                <div 
                                    className='w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden cursor-pointer relative z-30'
                                    onClick={() => isOwnProfile && setEdit(true)}
                                >
                                    <img 
                                        src={currentProfileData?.profileImage || profilepic} 
                                        alt="Profile" 
                                        className='w-full h-full object-cover'
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = profilepic;
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Profile Details - Now in the white section below */}
                        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                            <div className='text-center md:text-left bg-white p-4 rounded-lg shadow-sm w-full md:w-auto md:bg-transparent md:shadow-none md:p-0'>
                                <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
                                    {currentProfileData ? `${currentProfileData.firstName} ${currentProfileData.lastName}` : ''}
                                </h1>
                                <p className='text-gray-700 mt-1'>{currentProfileData?.headline || 'No headline'}</p>
                                
                                <div className='flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2 text-sm text-gray-500'>
                                    {currentProfileData?.location && (
                                        <span className='flex items-center'><FiMapPin className='mr-1' /> {currentProfileData.location}</span>
                                    )}
                                    {currentProfileData?.connections?.length > 0 && (
                                        <span className='flex items-center'><FiUserPlus className='mr-1' /> {currentProfileData.connections.length} connections</span>
                                    )}
                                </div>
                
                                {!isOwnProfile && (
                                    <div className='flex flex-wrap gap-3 mt-3 justify-center md:justify-start'>
                                        <ConnectionButton userId={currentProfileData?._id} />
                                        <button className='px-4 py-1.5 bg-white text-blue-600 border border-blue-600 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors'>
                                            Message
                                        </button>
                                        <button className='p-2 text-gray-500 hover:bg-gray-100 rounded-full'>
                                            <HiOutlineDotsHorizontal />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {isOwnProfile && (
                            <div className='mt-4 md:mt-0 flex justify-center md:block'>
                                <button 
                                    onClick={() => setEdit(true)}
                                    className='px-4 py-1.5 bg-white text-blue-600 border border-blue-600 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors flex items-center gap-1'
                                >
                                    <HiPencil className='text-base' /> Edit Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6'>
                {/* Left Sidebar */}
                <div className='w-full lg:w-1/3 space-y-6'>
                    {/* About Section */}
                    <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
                        <div className='p-4 border-b border-gray-200'>
                            <h2 className='text-lg font-semibold text-gray-900'>About</h2>
                        </div>
                        <div className='p-4'>
                            <p className='text-sm text-gray-700'>{currentProfileData?.bio || 'No bio available'}</p>
                            
                            {currentProfileData?.website && (
                                <div className='mt-3 flex items-center text-sm text-blue-600 hover:underline cursor-pointer'>
                                    <FiLink className='mr-2' />
                                    {currentProfileData.website}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Experience Section */}
                    {currentProfileData?.experience?.length > 0 && (
                        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
                            <div className='p-4 border-b border-gray-200 flex justify-between items-center'>
                                <h2 className='text-lg font-semibold text-gray-900'>Experience</h2>
                                {isOwnProfile && (
                                    <button 
                                        onClick={() => setEdit(true)}
                                        className='text-blue-600 hover:text-blue-800 text-sm font-medium'
                                    >
                                        Add
                                    </button>
                                )}
                            </div>
                            <div className='divide-y divide-gray-200'>
                                {currentProfileData.experience.map((exp, index) => (
                                    <div key={index} className='p-4 hover:bg-gray-50'>
                                        <div className='flex items-start'>
                                            <div className='flex-shrink-0 mt-1'>
                                                <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600'>
                                                    <FiBriefcase className='w-5 h-5' />
                                                </div>
                                            </div>
                                            <div className='ml-4 flex-1'>
                                                <h3 className='font-medium text-gray-900'>{exp.title}</h3>
                                                <p className='text-sm text-gray-600'>{exp.company}</p>
                                                <p className='text-xs text-gray-500 mt-1'>{exp.desc}</p>
                                                <p className='text-xs text-gray-400 mt-1'>
                                                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate || 'Present'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education Section */}
                    {currentProfileData?.education?.length > 0 && (
                        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
                            <div className='p-4 border-b border-gray-200 flex justify-between items-center'>
                                <h2 className='text-lg font-semibold text-gray-900'>Education</h2>
                                {isOwnProfile && (
                                    <button 
                                        onClick={() => setEdit(true)}
                                        className='text-blue-600 hover:text-blue-800 text-sm font-medium'
                                    >
                                        Add
                                    </button>
                                )}
                            </div>
                            <div className='divide-y divide-gray-200'>
                                {currentProfileData.education.map((edu, index) => (
                                    <div key={index} className='p-4 hover:bg-gray-50'>
                                        <div className='flex items-start'>
                                            <div className='flex-shrink-0 mt-1'>
                                                <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600'>
                                                    <FaGraduationCap className='w-5 h-5' />
                                                </div>
                                            </div>
                                            <div className='ml-4 flex-1'>
                                                <h3 className='font-medium text-gray-900'>{edu.school || edu.college}</h3>
                                                <p className='text-sm text-gray-600'>{edu.degree} in {edu.fieldOfStudy}</p>
                                                <p className='text-xs text-gray-500 mt-1'>{edu.startYear} - {edu.endYear || 'Present'}</p>
                                                {edu.grade && (
                                                    <p className='text-xs text-gray-500'>Grade: {edu.grade}</p>
                                                )}
                                            </div>
                                        </div>
                            </div>
                        ))}
                    </div>
                </div>
                    )}

                    {/* Skills Section */}
                    {currentProfileData?.skills?.length > 0 && (
                        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
                            <div className='p-4 border-b border-gray-200 flex justify-between items-center'>
                                <h2 className='text-lg font-semibold text-gray-900'>Skills</h2>
                                {isOwnProfile && (
                                    <button 
                                        onClick={() => setEdit(true)}
                                        className='text-blue-600 hover:text-blue-800 text-sm font-medium'
                                    >
                                        Add
                                    </button>
                                )}
                            </div>
                            <div className='p-4'>
                                <div className='flex flex-wrap gap-2'>
                                    {currentProfileData.skills.map((skill, index) => (
                                        <span 
                                            key={index}
                                            className='px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full hover:bg-gray-200 transition-colors'
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                    </div>
                    )}
                </div>

                {/* Main Content */}
                <div className='w-full lg:w-2/3 space-y-6'>
                    {/* Activity Tabs */}
                    <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
                        <div className='border-b border-gray-200'>
                            <nav className='flex -mb-px'>
                                <button
                                    onClick={() => setActiveTab('posts')}
                                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'posts' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    Posts ({profilePost.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('about')}
                                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'about' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    About
                                </button>
                            </nav>
                        </div>

                        {/* Posts Tab */}
                        {activeTab === 'posts' && (
                            <div className='p-4'>
                                {profilePost.length > 0 ? (
                                    <div className='space-y-4'>
                                        {profilePost.map((post, index) => (
                                            <Post 
                                                key={index} 
                                                id={post._id} 
                                                desc={post.desc} 
                                                author={post.author} 
                                                image={post.image} 
                                                like={post.like} 
                                                comment={post.comment} 
                                                createdAt={post.createdAt}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className='text-center py-10'>
                                        <p className='text-gray-500'>No posts to show</p>
                                        {isOwnProfile && (
                                            <button 
                                                className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors'
                                                onClick={() => setActiveTab('create')}
                                            >
                                                Create your first post
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* About Tab */}
                        {activeTab === 'about' && (
                            <div className='p-6'>
                                <div className='mb-8'>
                                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>Summary</h3>
                                    <p className='text-gray-700'>{currentProfileData?.bio || 'No summary available'}</p>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    {/* Contact Info */}
                                    <div>
                                        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Contact Information</h3>
                                        <div className='space-y-3'>
                                            {currentProfileData?.email && (
                                                <div className='flex items-start'>
                                                    <AiOutlineMail className='w-5 h-5 text-gray-500 mr-3 mt-0.5' />
                                                    <div>
                                                        <p className='text-sm font-medium text-gray-500'>Email</p>
                                                        <p className='text-gray-900'>{currentProfileData.email}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {currentProfileData?.phone && (
                                                <div className='flex items-start'>
                                                    <FiPhone className='w-5 h-5 text-gray-500 mr-3 mt-0.5' />
                                                    <div>
                                                        <p className='text-sm font-medium text-gray-500'>Phone</p>
                                                        <p className='text-gray-900'>{currentProfileData.phone}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {currentProfileData?.website && (
                                                <div className='flex items-start'>
                                                    <FiLink className='w-5 h-5 text-gray-500 mr-3 mt-0.5' />
                                                    <div>
                                                        <p className='text-sm font-medium text-gray-500'>Website</p>
                                                        <a 
                                                            href={currentProfileData.website.startsWith('http') ? currentProfileData.website : `https://${currentProfileData.website}`} 
                                                            target='_blank' 
                                                            rel='noopener noreferrer'
                                                            className='text-blue-600 hover:underline'
                                                        >
                                                            {currentProfileData.website}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Personal Details */}
                                    <div>
                                        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Personal Details</h3>
                                        <div className='space-y-3'>
                                            {currentProfileData?.location && (
                                                <div className='flex items-start'>
                                                    <FiMapPin className='w-5 h-5 text-gray-500 mr-3 mt-0.5' />
                                                    <div>
                                                        <p className='text-sm font-medium text-gray-500'>Location</p>
                                                        <p className='text-gray-900'>{currentProfileData.location}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {currentProfileData?.dateOfBirth && (
                                                <div className='flex items-start'>
                                                    <FiCalendar className='w-5 h-5 text-gray-500 mr-3 mt-0.5' />
                                                    <div>
                                                        <p className='text-sm font-medium text-gray-500'>Birthday</p>
                                                        <p className='text-gray-900'>
                                                            {new Date(currentProfileData.dateOfBirth).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default Profile;
