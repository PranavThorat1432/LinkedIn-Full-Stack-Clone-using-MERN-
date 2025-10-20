import React, { useState, useContext } from 'react'
import linkedin from '../assets/Linkedin_2021.svg'
import { useNavigate } from 'react-router-dom';
import { authContextData } from '../Context/AuthContext';
import axios from 'axios';
import { userContextData } from '../Context/userContext';

const Login = () => {

    const {serverUrl} = useContext(authContextData);
    const {userData, setUserData} = useContext(userContextData);

    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let result = await axios.post(serverUrl + '/api/auth/login', {
                email,
                password
            }, {withCredentials: true})

            setUserData(result.data);
            navigate('/')
            setEmail('');
            setPassword('');
            setLoading(false); 
            setErr('');

        } catch (error) {
            setErr(error.response.data.message);
            setLoading(false);
        }
    }

  return (
    <div className='w-full h-screen bg-white flex flex-col items-center justify-start'>
            <div className='p-[30px] lg:p-[35px] w-full h-[80px] flex items-center'>
                <img className='w-25' src={linkedin} alt="" />
            </div>
    
            <form onSubmit={handleLogin} className='w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col justify-center gap-[10px] p-[15px]'>
                <h1 className='text-gray-800 text-[30px] font-semibold mb-[30px]'>Sign In</h1>
                <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Email' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md'/>
                
                <div className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-md relative'>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type={show ? 'text' : 'password'} placeholder='Password' required className='w-full h-full border-none text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md'/>
                    <span onClick={() => setShow(!show)} className='absolute right-[20px] top-[10px] text-[#008afc] font-semibold cursor-pointer'>{show ? "Hide" : "Show"}</span>
                </div>
                {err && <p className='text-red-800'>{err}</p> }

                <button className='w-[100%] h-[50px] rounded-full bg-[#008afc] text-white cursor-pointer mt-[40px]' disabled={loading}>{loading ? 'Loading...' : 'Sign In'}</button>

                <p className='text-center cursor-pointer'>Don't have an account? <span className='text-[#015aa3]' onClick={() => navigate('/signup')}>Sign Up</span></p>
            </form>
        </div>
  )
}

export default Login
