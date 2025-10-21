import React, { useState, useContext } from 'react';
import linkedin from '../assets/Linkedin_2021.svg';
import { useNavigate } from 'react-router-dom';
import { authContextData } from '../Context/AuthContext';
import axios from 'axios';
import { userContextData } from '../Context/userContext';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

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
    <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <img className='mx-auto h-12 w-auto' src={linkedin} alt="LinkedIn" />
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
          Make the most of your professional life
        </h2>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200'>
          <form onSubmit={handleSignup} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6'>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div>
                  <label htmlFor='firstName' className='block text-sm font-medium text-gray-700'>
                    First name
                  </label>
                  <div className='mt-1 relative rounded-md shadow-sm'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <FaUser className='h-4 w-4 text-gray-400' />
                    </div>
                    <input
                      id='firstName'
                      name='firstName'
                      type='text'
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className='focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10 border p-2'
                      placeholder='First name'
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor='lastName' className='block text-sm font-medium text-gray-700'>
                    Last name
                  </label>
                  <div className='mt-1 relative rounded-md shadow-sm'>
                    <input
                      id='lastName'
                      name='lastName'
                      type='text'
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className='focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md h-10 border p-2'
                      placeholder='Last name'
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor='userName' className='block text-sm font-medium text-gray-700'>
                  Username
                </label>
                <div className='mt-1 relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <FaUser className='h-4 w-4 text-gray-400' />
                  </div>
                  <input
                    id='userName'
                    name='userName'
                    type='text'
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className='focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10 border p-2'
                    placeholder='Username'
                  />
                </div>
              </div>

              <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                  Email address
                </label>
                <div className='mt-1 relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <FaEnvelope className='h-4 w-4 text-gray-400' />
                  </div>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10 border p-2'
                    placeholder='Email'
                  />
                </div>
              </div>

              <div>
                <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                  Password
                </label>
                <div className='mt-1 relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <FaLock className='h-4 w-4 text-gray-400' />
                  </div>
                  <input
                    id='password'
                    name='password'
                    type={show ? 'text' : 'password'}
                    autoComplete='new-password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md h-10 border p-2'
                    placeholder='Password (6+ characters)'
                  />
                  <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                    <button
                      type='button'
                      onClick={() => setShow(!show)}
                      className='text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer'
                    >
                      {show ? (
                        <FaEyeSlash className='h-4 w-4' />
                      ) : (
                        <FaEye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </div>
                <p className='mt-1 text-xs text-gray-500'>
                  By clicking Agree & Join, you agree to the LinkedIn User Agreement, Privacy Policy, and Cookie Policy.
                </p>
              </div>
            </div>

            {err && (
              <div className='rounded-md bg-red-50 p-4'>
                <div className='flex'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-5 w-5 text-red-400'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div className='ml-3'>
                    <p className='text-sm font-medium text-red-800'>{err}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type='submit'
                disabled={loading}
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0a66c2] hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 h-12 transition-colors duration-200 cursor-pointer items-center'
              >
                {loading ? (
                  <span className='flex items-center'>
                    <svg className='animate-spin -ml-1 mr-2 h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Agree & Join'
                )}
              </button>
            </div>
          </form>

          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>or</span>
              </div>
            </div>

            <div className='mt-6'>
              <p className='text-center text-sm text-gray-600'>
                Already on LinkedIn?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className='font-medium text-[#0a66c2] hover:text-[#004182] cursor-pointer'
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
