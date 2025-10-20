import React, { createContext, useContext, useEffect, useState } from 'react'
import { authContextData } from './AuthContext';
export const userContextData = createContext();
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const userContext = ({children}) => {

  const [userData, setUserData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [postData, setPostData] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const {serverUrl} = useContext(authContextData);
  const navigate = useNavigate();
  
  const getCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current-user`, {
        withCredentials: true
      });

      console.log(result);
      setUserData(result.data)
      
    } catch (error) {
      console.log(error);
      setUserData(null)
    }
  }

  const getPost = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/post/getPost`, {
        withCredentials: true
      })
      console.log(result); 
      setPostData(result.data);
      return result.data;

    } catch (error) {
      console.log(error);
    }
  }

  const handleGetProfile = async (userName) => {
    try {
      let result = await axios.get(`${serverUrl}/api/user/getProfile/${userName}`, {
        withCredentials: true
      });
      console.log(result); 
      setProfileData(result.data);
      navigate(`/getProfile/${userName}`);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCurrentUser();
    getPost();
  }, [])

  const value = {
    userData, setUserData,
    edit, setEdit,
    postData, setPostData,
    getPost,
    profileData, setProfileData, handleGetProfile
  }
  
  return (
    <div>
      <userContextData.Provider value={value}>
        {children}  
      </userContextData.Provider>
    </div>
  )
}

export default userContext
