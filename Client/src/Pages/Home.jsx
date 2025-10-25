import React, { useContext, useEffect, useRef, useState } from 'react';
import Navbar from '../Components/Navbar';
import profilepic from '../assets/profilepic.png';
import { FiCamera, FiSend } from "react-icons/fi";
import { userContextData } from '../Context/userContext';
import { HiPencil } from "react-icons/hi";
import EditProfile from '../Components/EditProfile';
import { RxCross1 } from "react-icons/rx";

import { 
  AiFillStar,
} from "react-icons/ai";
import { RiArticleLine } from "react-icons/ri";
import { MdOutlineOndemandVideo, MdWorkOutline } from "react-icons/md";
import { TbPhoto } from "react-icons/tb";
import axios from 'axios';
import { authContextData } from '../Context/AuthContext';
import Post from '../Components/Post';
import ConnectionButton from '../Components/ConnectionButton';


const Home = () => {

  const {userData, setUserData, edit, setEdit, postData, setPostData, handleGetProfile} = useContext(userContextData);
  const {serverUrl} = useContext(authContextData);

  const [frontendPost, setFrontendPost] = useState('');
  const [backendPost, setBackendPost] = useState('');
  const [description, setDescription] = useState('');
  const [uploadPost, setUploadPost] = useState(false);
  const [posting, setPosting] = useState(false);
  const [suggestedUser, setSuggestedUser] = useState([]);

  const image = useRef();

  function handleImage(e) {
    let file = e.target.files[0];
    setBackendPost(file);
    setFrontendPost(URL.createObjectURL(file));
  }

  async function handleUploadPost() {
    setPosting(true);
    try {
      let formdata = new FormData();
      formdata.append('description', description);

      if(backendPost) {
        formdata.append('image', backendPost);
      }

      let result = await axios.post(`${serverUrl}/api/post/createPost`, formdata, {
        withCredentials: true
      });
      console.log(result)
      setPosting(false);
      setUploadPost(false);

    } catch (error) {
      setPosting(false);
      console.log(error)
    }
  }

  const handleSuggestedUsers = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/user/suggestedUsers`, {
        withCredentials: true
      });
      console.log(result.data);
      setSuggestedUser(result.data);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleSuggestedUsers();
  }, [])

  return (
    <div className='w-full min-h-screen bg-[#f3f2ef] pt-[80px] md:pt-[100px] flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 lg:gap-6 px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 relative pb-6'>
      
      {edit && <EditProfile/>}
      
      <Navbar/>

      {/* Left Sidebar - Profile Card */}
      <div className='w-full lg:w-[280px] xl:w-[312px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden top-[400px] mb-4 lg:mb-0'>
        <div 
          onClick={() => setEdit(true)} 
          className='w-full h-24 bg-gradient-to-r from-blue-500 to-blue-700 relative group cursor-pointer hover:opacity-90 transition-opacity'
        >
          {userData?.user?.coverImage ? (
            <img 
              src={userData.user.coverImage} 
              alt="Cover" 
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='w-full h-full bg-gradient-to-r from-blue-500 to-blue-700' />
          )}
          <div className='absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
            <FiCamera className='text-white w-6 h-6' />
          </div>
        </div>

        <div className='px-4 pt-16 pb-4 relative'>
          <div 
            onClick={() => setEdit(true)} 
            className='absolute -top-8 left-4 w-20 h-20 rounded-full overflow-hidden border-4 border-white bg-white cursor-pointer group'
          >
            <img 
              src={userData?.user?.profileImage || profilepic} 
              alt="Profile" 
              className='w-full h-full object-cover group-hover:opacity-90 transition-opacity'
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = profilepic;
              }}
            />
            <div className='absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
              <FiCamera className='text-white w-5 h-5' />
            </div>
          </div>

          <div className='-mt-[20px]'>
            <h2 className='text-lg font-semibold text-gray-900 hover:text-blue-600 hover:underline cursor-pointer'>
              {userData.user ? `${userData.user.firstName} ${userData.user.lastName}` : ''}
            </h2>
            <p className='text-sm text-gray-600 mt-1 line-clamp-2'>{userData.user?.headline || 'Add a headline'}</p>
            {userData.user?.location && (
              <p className='text-xs text-gray-500 mt-1'>{userData.user.location}</p>
            )}
          </div>

          <div className='hidden md:block mt-4 pt-4 border-t border-gray-100'>
            <div className='flex justify-between text-xs text-gray-600 mb-2'>
              <span>Who viewed your profile</span>
              <span className='text-blue-600 font-semibold'>0</span>
            </div>
            <div className='flex justify-between text-xs text-gray-600'>
              <span>Impressions of your post</span>
              <span className='text-blue-600 font-semibold'>0</span>
            </div>
          </div>

          <div className='hidden md:block mt-4 pt-4 border-t border-gray-100'>
            <p className='text-xs text-gray-600'>Access exclusive tools & insights</p>
            <div className='flex items-center mt-1'>
              <AiFillStar className='text-yellow-500 mr-1' />
              <span className='text-xs font-medium'>Try Premium for free</span>
            </div>
          </div>

          <button 
            onClick={() => setEdit(true)}
            className='w-full mt-4 py-1.5 px-4 rounded-full border border-gray-400 text-gray-700 font-medium text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2'
          >
            <HiPencil className='w-4 h-4' />
            Edit profile
          </button>
        </div>
      </div>



      {/* Main Feed */}
      <div className='w-full lg:max-w-[680px] flex flex-col gap-4'>
        {/* Create Post */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
          <div className='flex items-center space-x-2 border-b border-gray-100 pb-3 mb-3'>
            <div className='w-10 h-10 rounded-full overflow-hidden'>
              <img 
                src={userData?.user?.profileImage || profilepic} 
                alt="Profile" 
                className='w-full h-full object-cover'
              />
            </div>
            <button 
              onClick={() => setUploadPost(true)}
              className='flex-1 text-left bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full px-4 py-2.5 text-sm font-medium transition-colors cursor-text'
            >
              Start a post
            </button>
          </div>
          <div className='flex items-center justify-between text-sm text-gray-600'>
            <button className='flex items-center justify-center flex-1 py-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer'>
              <TbPhoto className='w-5 h-5 text-blue-500 mr-1' />
              <span>Photo</span>
            </button>
            <button className='flex items-center justify-center flex-1 py-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer'>
              <MdOutlineOndemandVideo className='w-5 h-5 text-green-500 mr-1' />
              <span>Video</span>
            </button>
            <button className='flex items-center justify-center flex-1 py-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer'>
              <MdWorkOutline className='w-5 h-5 text-orange-500 mr-1' />
              <span>Job</span>
            </button>
            <button className='flex items-center justify-center flex-1 py-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer'>
              <RiArticleLine className='w-5 h-5 text-yellow-500 mr-1' />
              <span>Write article</span>
            </button>
          </div>
        </div>

        {/* Posts */}
        {postData.length > 0 ? (
          postData.map((post, index) => (
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
          ))
        ) : (
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center z-[200]'>
            <div className='text-gray-400 mb-2'>
              <svg xmlns="http://www.w3.org/2000/svg" className='h-12 w-12 mx-auto' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-1'>No posts yet</h3>
            <p className='text-gray-500 text-sm mb-4'>Be the first to share what's on your mind!</p>
            <button 
              onClick={() => setUploadPost(true)}
              className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-full text-sm transition-colors'
            >
              Create a post
            </button>
          </div>
        )}
      </div>


      {/* Create Post Modal */}
      {uploadPost && (
        <div className='fixed inset-0 z-[1000] overflow-y-auto'>
          <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center'>
            <div className='fixed inset-0 transition-opacity z-[1001]' aria-hidden='true'>
              <div className='absolute inset-0 bg-gray-500 opacity-75' onClick={() => setUploadPost(false)}></div>
            </div>

            <div className='inline-block w-full max-w-2xl bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all z-[1002] relative'>
              <div className='px-6 py-4 border-b border-gray-200'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-medium text-gray-900'>Create a post</h3>
                  <button 
                    onClick={() => setUploadPost(false)}
                    className='text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer'
                  >
                    <RxCross1 className='h-6 w-6' />
                  </button>
                </div>
              </div>

              <div className='px-6 py-4'>
                <div className='flex items-start space-x-3 mb-4'>
                  <div className='flex-shrink-0'>
                    <img 
                      src={userData?.user?.profileImage || profilepic} 
                      alt="Profile" 
                      className='h-12 w-12 rounded-full object-cover'
                    />
                  </div>
                  <div>
                    <p className='font-medium text-gray-900'>{userData.user ? `${userData.user.firstName} ${userData.user.lastName}` : ''}</p>
                    <div className='mt-1'>
                      <select className='text-sm border border-gray-300 rounded-md px-2 py-1 bg-gray-100 text-gray-700'>
                        <option>Anyone</option>
                        <option>Connections only</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className='mt-4'>
                  <textarea
                    className='w-full border-none outline-0 focus:ring-0 resize-none text-gray-900 placeholder-gray-500 text-lg'
                    rows={4}
                    placeholder="What do you want to talk about?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {frontendPost && (
                  <div className='mt-4 relative group'>
                    <img 
                      src={frontendPost} 
                      alt="Post preview" 
                      className='w-full rounded-lg object-contain max-h-96 bg-gray-100'
                    />
                    <button 
                      onClick={() => {
                        setFrontendPost('');
                        setBackendPost(null);
                      }}
                      className='absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1.5 hover:bg-opacity-80 transition-opacity'
                    >
                      <RxCross1 className='h-4 w-4' />
                    </button>
                  </div>
                )}
              </div>

              <div className='px-6 py-3 bg-gray-50 border-t border-gray-200'>
                <div className='flex items-center justify-between'>
                  <div className='flex space-x-2'>
                    <button 
                      onClick={() => image.current.click()}
                      className='p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors'
                      title='Add photo'
                    >
                      <TbPhoto className='h-5 w-5' />
                    </button>
                    <button className='p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors' title='Add video'>
                      <MdOutlineOndemandVideo className='h-5 w-5' />
                    </button>
                    <button className='p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors' title='Add document'>
                      <RiArticleLine className='h-5 w-5' />
                    </button>
                  </div>
                  <input 
                    type="file" 
                    ref={image} 
                    hidden 
                    accept="image/*"
                    onChange={handleImage}
                  />
                  <button
                    onClick={handleUploadPost}
                    disabled={posting || (!description.trim() && !frontendPost)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium text-white ${(!description.trim() && !frontendPost) ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'} transition-colors`}
                  >
                    {posting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      

      {/* Right Sidebar */}
      <div className='w-full lg:w-[312px] space-y-4 hidden lg:block'>
        {/* News */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
          <div className='p-4 border-b border-gray-200'>
            <h3 className='font-medium text-gray-900'>LinkedIn News</h3>
          </div>
          <div className='divide-y divide-gray-200'>
            {[1, 2, 3].map((item) => (
              <div key={item} className='p-4 hover:bg-gray-50 cursor-pointer'>
                <p className='text-sm font-medium text-gray-900'>The latest in tech hiring</p>
                <p className='text-xs text-gray-500 mt-1'>1d ago • 2,124 readers</p>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Users */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
          <div className='p-4 border-b border-gray-200 flex justify-between items-center'>
            <h3 className='font-medium text-gray-900'>People you may know</h3>
            <button className='text-blue-600 hover:underline text-sm font-medium'>See all</button>
          </div>
          
          {suggestedUser.length > 0 ? (
            <div className='divide-y divide-gray-200'>
              {suggestedUser.slice(0, 5).map((user, index) => (
                <div key={index} className='p-4 hover:bg-gray-50'>
                  <div className='flex items-center space-x-3'>
                    <div 
                      className='w-14 h-14 rounded-full overflow-hidden cursor-pointer flex-shrink-0'
                      onClick={() => handleGetProfile(user.userName)}
                    >
                      <img 
                        src={user?.profileImage || profilepic} 
                        alt={user?.firstName || 'User'}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 
                        className='text-sm font-medium text-gray-900 truncate hover:underline cursor-pointer'
                        onClick={() => handleGetProfile(user.userName)}
                      >
                        {user ? `${user.firstName} ${user.lastName}` : ''}
                      </h4>
                      <p className='text-xs text-gray-500 truncate'>{user.headline || ''}</p>
                      <div className='mt-2'>
                        <ConnectionButton userId={user._id} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='p-4 text-center text-sm text-gray-500'>
              No suggestions available
            </div>
          )}
        </div>

        {/* Footer Links */}
        <div className='text-xs text-gray-500 space-y-1 p-4'>
          <div className='flex flex-wrap gap-1'>
            <a href='#' className='hover:underline'>About</a> • 
            <a href='#' className='hover:underline'>Accessibility</a> • 
            <a href='#' className='hover:underline'>Help Center</a>
          </div>
          <div className='flex flex-wrap gap-1'>
            <a href='#' className='hover:underline'>Privacy & Terms</a> • 
            <a href='#' className='hover:underline'>Ad Choices</a>
          </div>
          <div className='flex flex-wrap gap-1'>
            <a href='#' className='hover:underline'>Advertising</a> • 
            <a href='#' className='hover:underline'>Business Services</a>
          </div>
          <div className='pt-2 text-xs text-gray-400'>
            © {new Date().getFullYear()} LinkedIn Clone
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
