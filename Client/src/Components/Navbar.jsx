import React, { useContext, useState, useEffect, useRef } from 'react';
import LinkedIn_logo from '../assets/LinkedIn_logo.png';
import { IoSearch, IoNotificationsSharp, IoClose } from "react-icons/io5";
import { FaUserGroup } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import profilepic from '../assets/profilepic.png';
import { userContextData } from '../Context/UserContext';
import { authContextData } from '../Context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

    const [activeSearch, setActiveSearch] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [search, setSearch] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const popupRef = useRef(null);
    const [searchData, setSearchData] = useState([]);
    const {userData, setUserData, handleGetProfile} = useContext(userContextData);
    const {serverUrl} = useContext(authContextData);
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/logout`, {
                withCredentials: true
            })
            setUserData(null);
            navigate('/login')
            console.log(result);
            
        } catch (error) {
            console.log(error);
            
        }
    }

    const handleSearch = async () => {
        // Don't make API call if search is empty
        if (!search.trim()) {
            setSearchData([]);
            return;
        }
        
        try {
            let result = await axios.get(`${serverUrl}/api/user/search?query=${encodeURIComponent(search)}`, {
                withCredentials: true
            });
            setSearchData(result.data);
        } catch (error) {
            setSearchData([]);
            console.error('Search error:', error);
        }
    }

    // Add debounce to prevent too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch();
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [search]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Handle click outside to close popup
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target) && 
                !event.target.closest('.profile-image-container')) {
                setShowPopup(false);
            }
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

  return (
    <div className='w-full h-[80px] bg-white fixed top-0 shadow-lg flex justify-between md:justify-around items-center px-[10px] left-0 z-[80]'>
        {/* Left Side */}
        <div className='flex items-center justify-center gap-2.5'>
            <div onClick={() => { setActiveSearch(false); navigate('/'); }} className='cursor-pointer'>
                <img className='w-[50px]' src={LinkedIn_logo} alt="" />
            </div>

            {!activeSearch && <div>
                    <IoSearch onClick={() => setActiveSearch(true)} className='w-[23px] h-[23px] text-gray-600 lg:hidden cursor-pointer'/>
                </div>
            }

            {searchData.length > 0 && 
                <div className='absolute top-[90px] left-[0px] lg:left-[140px] w-[100%] lg:w-[700px] h-[400px] overflow-auto bg-white shadow-lg flex flex-col gap-[20px] p-[20px]'>
                    {searchData.map((srch, index) => (
                        <div key={index} className='flex items-center gap-[20px] p-[10px] border-b-gray-300 border-b-[1px] hover:bg-gray-100 cursor-pointer transition ease-in-out duration-200 rounded-lg' onClick={() => handleGetProfile(srch.userName)}>
                            <div className='w-[70px] h-[70px] rounded-full overflow-hidden relative'>
                                <img src={srch?.profileImage || profilepic} alt="" className='w-full h-full'/>
                            </div>
                            <div>
                                <div className='text-[20px] font-semibold text-gray-700'>
                                    {srch ? `${srch.firstName} ${srch.lastName}` : ''}
                                </div>
                                <div className='text-[15px] font-semibold text-gray-700'>
                                    {srch.headline || ''}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            }

            <form className={`w-[190px] lg:w-[350px] h-[40px] bg-[#f3f2ef] lg:flex items-center gap-[10px] px-[10px] py-[5px] rounded-full ${!activeSearch ? 'hidden' : 'flex'}`}>
                <div>
                    <IoSearch className='w-[23px] h-[23px] text-gray-600'/>
                </div>

                <input type="search" className='w-[80%] h-full bg-transparent outline-0 border-0' placeholder='Search' onChange={(e) => setSearch(e.target.value)} value={search}/>
            </form>
        </div>

        {/* Right Side */}
        <div className='flex items-center justify-center gap-4 '>
            <div onClick={() => navigate('/')} className='lg:flex flex-col items-center justify-center text-gray-600 hidden hover:text-gray-800 transition-colors cursor-pointer'>
                <IoMdHome className='w-[23px] h-[23px]'/>
                <div>Home</div>
            </div>
            <div onClick={() => navigate('/network')} className='lg:flex flex-col items-center justify-center text-gray-600 hidden hover:text-gray-800 transition-colors cursor-pointer'>
                <FaUserGroup className='w-[23px] h-[23px]'/>
                <div>My Network</div>
            </div>
            <div className='flex flex-col items-center justify-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer' onClick={() => navigate('/notification')}>
                <IoNotificationsSharp className='w-[23px] h-[23px]'/>
                <div className='hidden md:block'>Notifications</div>
            </div>
            <div 
                onClick={() => setShowPopup(!showPopup)} 
                className='w-10 h-10 md:w-[50px] md:h-[50px] rounded-full overflow-hidden relative cursor-pointer border-2 border-transparent hover:border-blue-400 transition-colors profile-image-container'
            >
                <img 
                    src={userData?.user?.profileImage || profilepic} 
                    alt="Profile" 
                    className='w-full h-full object-cover'
                />
            </div>

            {/* Overlay for mobile */}
            {showPopup && isMobile && (
                <div 
                    className='fixed inset-0 z-40 transition-opacity duration-300'
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'blur(4px)'
                    }}
                    onClick={() => setShowPopup(false)}
                ></div>
            )}

            {/* Profile Card - Responsive */}
            <div 
                ref={popupRef}
                className={`fixed md:absolute bg-white shadow-lg rounded-lg flex flex-col items-center p-6 gap-5 z-50 transition-all duration-300 ease-in-out
                    ${showPopup ? 'opacity-100 visible' : 'opacity-0 invisible'}
                    ${isMobile 
                        ? 'fixed top-0 right-0 h-full w-4/5 max-w-sm transform transition-transform duration-300 ease-in-out ' + 
                          (showPopup ? 'translate-x-0' : 'translate-x-full')
                        : 'absolute top-[90px] right-4 w-[300px] min-h-[300px]'
                    }`}
            >
                {isMobile && (
                    <div className='w-full flex justify-between items-center mb-4'>
                        <h2 className='text-xl font-semibold text-gray-800'>Profile</h2>
                        <button 
                            onClick={() => setShowPopup(false)}
                            className='p-1 rounded-full hover:bg-gray-100'
                        >
                            <IoClose className='w-6 h-6 text-gray-600' />
                        </button>
                    </div>
                )}
                
                <div className='w-20 h-20 md:w-[70px] md:h-[70px] rounded-full overflow-hidden relative border-2 border-gray-200'>
                    <img 
                        src={userData?.user?.profileImage || profilepic} 
                        alt="Profile" 
                        className='w-full h-full object-cover'
                    />
                </div>
                
                <div className='text-center'>
                    <h3 className='text-lg md:text-xl font-semibold text-gray-800'>
                        {userData?.user ? `${userData.user.firstName} ${userData.user.lastName}` : 'User'}
                    </h3>
                    {userData?.user?.headline && (
                        <p className='text-sm text-gray-600 mt-1'>{userData.user.headline}</p>
                    )}
                </div>
                
                <div className='w-full space-y-3 mt-2'>
                    <button 
                        onClick={() => {
                            navigate('/profile');
                            setShowPopup(false);
                        }} 
                        className='w-full py-2 px-4 rounded-full border-2 border-[#0a66c2] text-[#0a66c2] font-medium hover:bg-[#eef3f8] transition-colors'
                    >
                        View Profile
                    </button>

                    <div className='border-t border-gray-200 my-3'></div>

                    <button 
                        onClick={() => {
                            navigate('/network');
                            setShowPopup(false);
                        }}
                        className='w-full flex items-center justify-center gap-3 py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'
                    >
                        <FaUserGroup className='w-5 h-5' />
                        <span>My Network</span>
                    </button>

                    <button 
                        onClick={() => {
                            handleSignOut();
                            setShowPopup(false);
                        }}
                        className='w-full py-2 px-4 rounded-full border-2 border-[#d11124] text-[#d11124] font-medium hover:bg-[#f8e8e9] transition-colors mt-4'
                    >
                        Sign Out
                    </button>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Navbar
