import React, { useState, useContext } from 'react'
import linkedin from '../assets/Linkedin_2021.svg'
import { useNavigate } from 'react-router-dom';
import { authContextData } from '../Context/AuthContext';
import axios from 'axios';
import { userContextData } from '../Context/userContext';

const Signup = () => {

    const {serverUrl} = useContext(authContextData);
    const {userData, setUserData} = useContext(userContextData);

    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let result = await axios.post(serverUrl + '/api/auth/signup', {
                firstName,
                lastName,
                userName,
                email,
                password
            }, {withCredentials: true})

            console.log(result);

            setUserData(result.data);
            navigate('/')
            setFirstName('');
            setLastName('');
            setUserName('');
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

        <form onSubmit={handleSignup} className='w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col justify-center gap-[10px] p-[15px]'>
            <h1 className='text-gray-800 text-[30px] font-semibold mb-[30px]'>Sign Up</h1>
            <input onChange={(e) => setFirstName(e.target.value)} value={firstName} type="text" placeholder='First Name' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md'/>
            <input onChange={(e) => setLastName(e.target.value)} value={lastName} type="text" placeholder='Last Name' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md'/>
            <input onChange={(e) => setUserName(e.target.value)} value={userName} type="text" placeholder='Username' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md'/>
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Email' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md'/>
            
            <div className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-md relative'>
                <input onChange={(e) => setPassword(e.target.value)} value={password} type={show ? 'text' : 'password'} placeholder='Password' required className='w-full h-full border-none text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md'/>
                <span onClick={() => setShow(!show)} className='absolute right-[20px] top-[10px] text-[#008afc] font-semibold cursor-pointer'>{show ? "Hide" : "Show"}</span>
            </div>
            {err && <p className='text-red-800'>{err}</p> }    

            <button className='w-[100%] h-[50px] rounded-full bg-[#008afc] text-white cursor-pointer mt-[40px]' disabled={loading}>{loading ? 'Loading...' : 'Sign Up'}</button>

            <p className='text-center cursor-pointer'>Already have an account? <span className='text-[#015aa3]' onClick={() => navigate('/login')}>Sign In</span></p>
        </form>
    </div>
  )
}

export default Signup
