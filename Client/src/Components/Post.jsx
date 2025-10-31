import React, { useContext, useEffect, useState, useCallback } from 'react';
import { userContextData } from '../Context/UserContext';
import profilepic from '../assets/profilepic.png';
import moment from 'moment';
import { BiLike, BiRepost } from 'react-icons/bi';
import { FaRegComment, FaRegThumbsUp, FaEllipsisH } from 'react-icons/fa';
import { RiShareForwardLine } from 'react-icons/ri';
import { BsEmojiSmile, BsThreeDots } from 'react-icons/bs';
import { AiFillLike } from 'react-icons/ai';
import { IoSend } from 'react-icons/io5';
import axios from 'axios';
import { authContextData } from '../Context/AuthContext';
import { useSocket } from '../Context/SocketContext';
import ConnectionButton from './ConnectionButton';


function Post({id, author, like, comment, desc, image, createdAt}) {

    const {serverUrl} = useContext(authContextData);
    const {getPost, userData, setUserData, handleGetProfile} = useContext(userContextData);
    const { socket } = useSocket();
    const [more, setMore] = useState(false);
    const [likes, setLikes] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [comments, setComments] = useState([]);
    const [showComment, setShowComment] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const isLiked = Boolean(userData?.user?._id) && likes?.some((uid) => String(uid) === String(userData?.user?._id));

    const handleLike = async () => {
        try {
            // Optimistically update the UI
            const newLikes = isLiked 
                ? likes.filter((uid) => String(uid) !== String(userData?.user?._id))
                : [...likes, userData?.user?._id];
            
            setLikes(newLikes);
            
            // Send the request to the server
            const result = await axios.get(`${serverUrl}/api/post/like/${id}`, {
                withCredentials: true
            });
            
            // Update with server response (in case there were any issues)
            setLikes(result.data?.post?.like || newLikes);
   
        } catch (error) {
            console.error('Error liking post:', error);
            // Revert on error
            setLikes(like || []);
        }
    }


    const handleComment = async (e) => {
        e.preventDefault();
        try {
            let result = await axios.post(`${serverUrl}/api/post/comment/${id}`, {
                content: commentContent
            }, {
                withCredentials: true
            })
            // Server returns { post: { like: [...] } }
            setComments(result.data?.comment || []);
            setCommentContent('')
            console.log(comments)
   
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!socket) return;

        socket.on('likeUpdated', ({postId, likes}) => {
            if(postId == id) {
                setLikes(likes);
            }
        })

        socket.on('commentAdded', ({postId, comments}) => {
            if(postId == id) {
                setComments(comments);
            }
        })

        return () => {
            socket.off('likeUpdated')
            socket.off('commentAdded')
        }
    }, [socket, id])

    // Update current time every minute for relative timestamps
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    // Format timestamp to show relative time with proper units
    const formatTimestamp = useCallback((dateString) => {
        if (!dateString) return '';
        
        // Ensure the date is a proper moment object
        const date = moment.isMoment(dateString) ? dateString : moment(new Date(dateString));
        const now = moment(currentTime);
        
        // If the date is invalid, return empty string
        if (!date.isValid()) return '';
        
        const diffInSeconds = now.diff(date, 'seconds');
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInSeconds < 5) return 'Just now';
        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays}d ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
        if (date.year() === now.year()) return date.format('MMM D');
        return date.format('MMM D, YYYY');
    }, [currentTime]);

    // Update likes and comments, ensuring timestamps are properly handled
    useEffect(() => {
        if (like) {
            setLikes(Array.isArray(like) ? like : []);
        }
        
        if (comment) {
            // Ensure comments have proper date objects
            const processedComments = Array.isArray(comment) 
                ? comment.map(com => ({
                    ...com,
                    // Ensure createdAt is a proper date string
                    createdAt: com.createdAt ? new Date(com.createdAt).toISOString() : new Date().toISOString()
                  }))
                : [];
            setComments(processedComments);
        }
    }, [like, comment]);
    
    // Update current time every 30 seconds for relative timestamps
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 30000); // Update every 30 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <div className='w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4'>
            {/* Post Header */}
            <div className='p-3'>
                <div className='flex items-start justify-between'>
                    <div 
                        className='flex items-start space-x-2 cursor-pointer group'
                        onClick={() => handleGetProfile(author?.userName)}
                    >
                        <div className='w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-gray-200'>
                            <img 
                                src={author?.profileImage || profilepic} 
                                alt="Profile" 
                                className='w-full h-full object-cover'
                            />
                        </div>

                        <div className='flex-1 min-w-0'>
                            <h3 className='text-[15px] font-semibold text-gray-900 group-hover:underline'>
                                {`${author?.firstName} ${author?.lastName}` || ''}
                            </h3>
                            <p className='text-xs text-gray-600 truncate'>{author?.headline || ''}</p>
                            <div className='flex items-center text-xs text-gray-500'>
                                <span>{formatTimestamp(createdAt)}</span>
                                <span className='mx-1'>•</span>
                                <span className='text-blue-500'>🌐</span>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center'>
                        {userData?.user?._id !== author?._id && (
                            <div className='mr-2'>
                                <ConnectionButton userId={author?._id} />
                            </div>
                        )}
                        <button className='p-1.5 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer'>
                            <BsThreeDots className='w-5 h-5' />
                        </button>
                    </div>
                </div>

                {/* Post Content */}
                <div className='mt-3'>
                    <div 
                        className={`text-sm text-gray-800 ${!more ? 'line-clamp-3' : ''} whitespace-pre-wrap break-words`}
                        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                    >
                        {desc && desc.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </div>
                    {desc?.length > 150 && (
                        <button 
                            onClick={() => setMore(!more)}
                            className='text-sm font-medium text-gray-500 hover:text-gray-700 mt-1 hover:underline'
                        >
                            {more ? 'Show less' : '...see more'}
                        </button>
                    )}
                </div>
            </div>

            {/* Post Image */}
            {image && (
                <div className='w-full bg-gray-100 flex justify-center'>
                    <img 
                        src={image} 
                        alt="Post content" 
                        className='max-h-[500px] w-auto object-contain cursor-pointer'
                    />
                </div>
            )}

            {/* Post Stats */}
            <div className='px-4 py-2 border-t border-gray-100 flex items-center text-xs text-gray-500'>
                <div className='flex items-center mr-4'>
                    <div className='flex -space-x-1'>
                        <div className='w-4 h-4 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-[8px]'>
                            <AiFillLike />
                        </div>
                    </div>
                    <span className='ml-1'>{likes.length}</span>
                </div>
                <div className='flex-1 text-right'>
                    <span className='hover:underline cursor-pointer' onClick={() => setShowComment(true)}>
                        {comments.length} comments
                    </span>
                </div>
            </div>

            {/* Post Actions */}
            <div className='px-2 py-1 border-t border-gray-100'>
                <div className='grid grid-cols-3 divide-x divide-gray-200 text-center'>
                    <button 
                        onClick={handleLike}
                        className={`flex items-center justify-center py-2 px-1 rounded-md hover:bg-gray-100 cursor-pointer ${isLiked ? 'text-blue-500' : 'text-gray-600'}`}
                    >
                        {isLiked ? (
                            <AiFillLike className='w-5 h-5 mr-1.5' />
                        ) : (
                            <FaRegThumbsUp className='w-5 h-5 mr-1.5' />
                        )}
                        <span className='text-sm font-medium'>Like</span>
                    </button>
                    
                    <button 
                        className='flex items-center justify-center py-2 px-1 rounded-md hover:bg-gray-100 text-gray-600 cursor-pointer'
                        onClick={() => setShowComment(!showComment)}
                    >
                        <FaRegComment className='w-5 h-5 mr-1.5' />
                        <span className='text-sm font-medium'>Comment</span>
                    </button>
                    
                    <button className='flex items-center justify-center py-2 px-1 rounded-md hover:bg-gray-100 text-gray-600 cursor-pointer'>
                        <RiShareForwardLine className='w-5 h-5 mr-1.5' />
                        <span className='text-sm font-medium'>Share</span>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            {showComment && (
                <div className='border-t border-gray-100 bg-gray-50 p-3'>
                    <div className='flex items-start space-x-2 mb-3'>
                        <div className='w-8 h-8 rounded-full overflow-hidden flex-shrink-0'>
                            <img 
                                src={userData?.user?.profileImage || profilepic} 
                                alt="Profile" 
                                className='w-full h-full object-cover cursor-pointer'
                                onClick={() => handleGetProfile(userData?.user?.userName)}
                            />
                        </div>
                        <form 
                            onSubmit={handleComment}
                            className='flex-1 flex items-center bg-white rounded-full border border-gray-300 overflow-hidden'
                        >
                            <input
                                type="text"
                                placeholder='Add a comment...'
                                className='flex-1 px-4 py-2 text-sm outline-none border-none bg-transparent'
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                            />
                            <button 
                                type='submit' 
                                className='p-2 text-blue-500 hover:bg-blue-50 rounded-full mr-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                                disabled={!commentContent.trim()}
                            >
                                <IoSend className='w-5 h-5' />
                            </button>
                        </form>
                    </div>

                    {/* Comments List */}
                    <div className='mt-3 space-y-3 max-h-60 overflow-y-auto'>
                        {comments?.map((com, idx) => (
                            <div key={idx} className='flex items-start space-x-2 group'>
                                <div className='w-8 h-8 rounded-full overflow-hidden flex-shrink-0'>
                                    <img 
                                        src={com.user?.profileImage || profilepic} 
                                        alt="Profile" 
                                        className='w-full h-full object-cover cursor-pointer'
                                        onClick={() => handleGetProfile(com.user?.userName)}
                                    />
                                </div>
                                <div className='flex-1 min-w-0 bg-white p-2 rounded-lg border border-gray-200'>
                                    <div className='flex justify-between items-start'>
                                        <div>
                                            <span className='text-sm font-semibold text-gray-900 cursor-pointer hover:underline'>
                                                {com.user?.firstName} {com.user?.lastName}
                                            </span>
                                            <p className='text-sm text-gray-700'>{com.content}</p>
                                        </div>
                                        <button className='text-xs text-gray-500 hover:text-blue-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity'>
                                            Reply
                                        </button>
                                    </div>
                                    <div className='flex items-center text-xs text-gray-500 mt-1 space-x-2'>
                                        <span>{formatTimestamp(com.createdAt)}</span>
                                        <button className='hover:underline'>Like</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Post
