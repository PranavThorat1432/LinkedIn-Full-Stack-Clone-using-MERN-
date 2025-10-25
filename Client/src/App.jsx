import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import { userContextData } from './Context/userContext'
import Network from './Pages/Network'
import Profile from './Pages/Profile'
import Notification from './Pages/Notification'


const App = () => { 

  const {userData} = useContext(userContextData);

  return (
    <>
      <Routes>
        <Route path='/' element={userData ? <Home/> : <Navigate to='/login'/>}/>
        <Route path='/signup' element={userData ? <Navigate to='/'/> : <Signup/>}/>
        <Route path='/login' element={userData ? <Navigate to='/'/> : <Login/>}/>
        <Route path='/network' element={userData ? <Network/> : <Navigate to='/login'/>}/>
        <Route path='/profile' element={userData ? <Profile/> : <Navigate to='/login'/>}/>
        <Route path='/getProfile/:userName' element={userData ? <Profile/> : <Navigate to='/login'/>}/>
        <Route path='/notification' element={userData ? <Notification/> : <Navigate to='/login'/>}/>
      </Routes>
    </>
  )
}

export default App;
