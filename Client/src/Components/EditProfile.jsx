import React, { useContext, useRef, useState } from 'react';
import { RxCross1, RxPlus } from "react-icons/rx";
import { FiCamera, FiX, FiEdit2, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import { userContextData } from '../Context/UserContext';
import profilepic from '../assets/profilepic.png';
import axios from 'axios';
import { authContextData } from '../Context/AuthContext';

const EditProfile = () => {

    const {edit, setEdit, userData, setUserData} = useContext(userContextData);
    const {serverUrl} = useContext(authContextData);
    const [firstName, setFirstName] = useState(userData?.user?.firstName || '');
    const [lastName, setLastName] = useState(userData?.user?.lastName || '');
    const [userName, setUserName] = useState(userData?.user?.userName || '');
    const [headline, setHeadline] = useState(userData?.user?.headline || '');
    const [location, setLocation] = useState(userData?.user?.location || '');
    const [gender, setGender] = useState(userData?.user?.gender || '');
    const [skills, setSkills] = useState(userData?.user?.skills || []);
    const [newSkills, setNewSkills] = useState('');
    const [education, setEducation] = useState(userData?.user?.education || []);
    const [newEducation, setNewEducation] = useState(
        {
            college: '',
            degree: '',
            fieldOfStudy: '',
        }
    );
    const [experience, setExperience] = useState(userData?.user?.experience || []);
    const [newExperience, setNewExperience] = useState(
        {
            title: '',
            company: '',
            desc: '',
        }
    );
    const [frontendProfileImage, setFrontendProfileImage] = useState(userData?.user?.profileImage || profilepic);
    const [backendProfileImage, setBackendProfileImage] = useState(null);
    const [frontendCoverImage, setFrontendCoverImage] = useState(userData?.user?.coverImage || null);
    const [backendCoverImage, setBackendCoverImage] = useState(null);
    const [saving, setSaving] = useState(false);

    const profileImage = useRef();
    const coverImage = useRef();

    function addSkills(e) {
        e.preventDefault();
        if(newSkills && !skills.includes(newSkills)) {
            setSkills([...skills, newSkills]);
        }
        setNewSkills('')
    }

    function removeSkills(skill) {
        if(skills.includes(skill)) {
            setSkills(skills.filter((s) => s !== skill));
        }
    }

    function addEducation(e) {
        e.preventDefault();
        if(newEducation.college && newEducation.degree && newEducation.fieldOfStudy) {
            setEducation([...education, newEducation]);
        }
        setNewEducation({
            college: '',
            degree: '',
            fieldOfStudy: '',
        })
    }

    function removeEducation(edu) {
        if(education.includes(edu)) {
            setEducation(education.filter((e) => e !== edu));
        }
    }

    function addExperience(e) {
        e.preventDefault();
        if(newExperience.title && newExperience.company && newExperience.desc) {
            setExperience([...experience, newExperience]);
        }
        setNewExperience({
            title: '',
            company: '',
            desc: '',
        })
    }

    function removeExperience(exp) {
        if(experience.includes(exp)) {
            setExperience(experience.filter((x) => x !== exp));
        }
    }

    function handleProfileImage(e) {
        let file = e.target.files[0];
        setBackendProfileImage(file);
        setFrontendProfileImage(URL.createObjectURL(file));
    }

    function handleCoverImage(e) {
        let file = e.target.files[0];
        setBackendCoverImage(file);
        setFrontendCoverImage(URL.createObjectURL(file));
    }

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            let formData = new FormData();
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('userName', userName);
            formData.append('headline', headline);
            formData.append('location', location);
            formData.append('skills', JSON.stringify(skills));
            formData.append('education', JSON.stringify(education));
            formData.append('experience', JSON.stringify(experience));

            if(backendProfileImage) {
                formData.append('profileImage', backendProfileImage);
            }

            if(backendCoverImage) {
                formData.append('coverImage', backendCoverImage);
            }

            let result = await axios.put(`${serverUrl}/api/user/updateProfile`, formData, {
                withCredentials: true
            });
            
            // Update userData while maintaining the expected structure
            setUserData(prev => ({
                ...prev,
                user: {
                    ...prev.user,
                    ...result.data,
                    profileImage: result.data.profileImage || prev.user?.profileImage,
                    coverImage: result.data.coverImage || prev.user?.coverImage
                }
            }));

            setSaving(false);
            setEdit(false);

        } catch (error) {
            console.log(error);
            setSaving(false);
        }
    }

// State for collapsible sections
const [expandedSections, setExpandedSections] = useState({
    personalInfo: true,
    skills: true,
    education: true,
    experience: true
});

function toggleSection(section) {
    setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
    }));
};

return (
    <div className='fixed inset-0 z-[1000] flex items-start justify-center p-4 bg-black/50 overflow-y-auto'>
        {/* Backdrop */}
        <div className='fixed inset-0 bg-black/50 -z-10' onClick={() => !saving && setEdit(false)}></div>
        <input type="file" accept='image/*' hidden ref={profileImage} onChange={handleProfileImage} />
        <input type="file" accept='image/*' hidden ref={coverImage} onChange={handleCoverImage} />
        
        <div className='w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col my-8 relative'>
            {/* Header */}
            <div className='bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10'>
                <div className='flex items-center space-x-2'>
                    <FaLinkedin className='text-blue-500 text-2xl' />
                    <h2 className='text-xl font-semibold text-gray-800'>Edit Profile</h2>
                </div>
                <button 
                    onClick={() => setEdit(false)} 
                    className='text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors'
                >
                    <RxCross1 className='w-5 h-5 cursor-pointer' />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className='flex-1 overflow-y-auto p-6'>
                {/* Cover Photo */}
                <div className='relative mb-16'>
                    <div 
                        className='relative h-48 bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-lg overflow-hidden cursor-pointer group'
                        onClick={() => coverImage.current.click()}
                    >
                        {frontendCoverImage && (
                            <img 
                                src={frontendCoverImage} 
                                alt="Cover" 
                                className='w-full h-full object-cover'
                            />
                        )}
                        <div className='absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                            <div className='bg-white bg-opacity-80 p-2 rounded-full'>
                                <FiCamera className='text-gray-800 w-5 h-5' />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Photo */}
                <div className='relative -mt-40 ml-6 mb-6 z-10'>
                    <div className='w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg cursor-pointer group relative'>
                        <img 
                            src={frontendProfileImage} 
                            alt="Profile" 
                            className='w-full h-full object-cover'
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = profilepic;
                            }}
                        />
                        <div 
                            className='absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full'
                            onClick={(e) => {
                                e.stopPropagation();
                                profileImage.current.click();
                            }}
                        >
                            <FiCamera className='text-white w-6 h-6' />
                        </div>
                    </div>
                </div>

                {/* Personal Information Section */}
                <div className='bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden'>
                    <div 
                        className='flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50'
                        onClick={() => toggleSection('personalInfo')}
                    >
                        <h3 className='text-lg font-semibold text-gray-800'>Personal Information</h3>
                        {expandedSections.personalInfo ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                    
                    {expandedSections.personalInfo && (
                        <div className='p-4 pt-0 space-y-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>First Name</label>
                                    <input 
                                        type="text" 
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
                                        value={firstName} 
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Last Name</label>
                                    <input 
                                        type="text" 
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
                                        value={lastName} 
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Username</label>
                                <input 
                                    type="text" 
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
                                    value={userName} 
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>
                            
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Headline</label>
                                <input 
                                    type="text" 
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
                                    placeholder="E.g., Software Developer at Company" 
                                    value={headline} 
                                    onChange={(e) => setHeadline(e.target.value)}
                                />
                            </div>
                            
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Location</label>
                                    <input 
                                        type="text" 
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
                                        placeholder="City, Country" 
                                        value={location} 
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Gender</label>
                                    <select 
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white' 
                                        value={gender} 
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Skills Section */}
                <div className='bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden'>
                    <div 
                        className='flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50'
                        onClick={() => toggleSection('skills')}
                    >
                        <h3 className='text-lg font-semibold text-gray-800'>Skills</h3>
                        {expandedSections.skills ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                    
                    {expandedSections.skills && (
                        <div className='p-4 pt-0 space-y-4'>
                            {skills.length > 0 && (
                                <div className='flex flex-wrap gap-2 mb-4'>
                                    {skills.map((skill, index) => (
                                        <div 
                                            key={index} 
                                            className='flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium'
                                        >
                                            {skill}
                                            <button 
                                                onClick={() => removeSkills(skill)}
                                                className='ml-2 text-blue-500 hover:text-blue-700 focus:outline-none'
                                            >
                                                <FiX className='w-4 h-4 cursor-pointer' />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <form onSubmit={addSkills} className='flex gap-2'>
                                <input 
                                    type="text" 
                                    className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm' 
                                    placeholder='Add skills (e.g., JavaScript, React)' 
                                    value={newSkills} 
                                    onChange={(e) => setNewSkills(e.target.value)}
                                />
                                <button 
                                    type='submit'
                                    className='bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors cursor-pointer'
                                >
                                    <RxPlus className='w-4 h-4' />
                                    <span>Add</span>
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Education Section */}
                <div className='bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden'>
                    <div 
                        className='flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50'
                        onClick={() => toggleSection('education')}
                    >
                        <h3 className='text-lg font-semibold text-gray-800'>Education</h3>
                        {expandedSections.education ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                    
                    {expandedSections.education && (
                        <div className='p-4 pt-0 space-y-4'>
                            {education.length > 0 && education.map((edu, index) => (
                                <div 
                                    key={index} 
                                    className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors relative group'
                                >
                                    <div className='flex justify-between items-start'>
                                        <div>
                                            <h4 className='font-medium text-gray-900'>{edu.degree}</h4>
                                            <p className='text-sm text-gray-600'>{edu.college}</p>
                                            <p className='text-sm text-gray-500'>{edu.fieldOfStudy}</p>
                                        </div>
                                        <button 
                                            onClick={() => removeEducation(edu)}
                                            className='text-gray-400 hover:text-red-500 p-1 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity'
                                        >
                                            <FiX className='w-4 h-4 cursor-pointer' />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            <form onSubmit={addEducation} className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>School/University</label>
                                    <input 
                                        type="text" 
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm' 
                                        placeholder='E.g., Stanford University' 
                                        value={newEducation.college} 
                                        onChange={(e) => setNewEducation({...newEducation, college: e.target.value})}
                                        required
                                    />
                                </div>
                                
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Degree</label>
                                        <input 
                                            type="text" 
                                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm' 
                                            placeholder="E.g., Bachelor's" 
                                            value={newEducation.degree} 
                                            onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Field of Study</label>
                                        <input 
                                            type="text" 
                                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm' 
                                            placeholder='E.g., Computer Science' 
                                            value={newEducation.fieldOfStudy} 
                                            onChange={(e) => setNewEducation({...newEducation, fieldOfStudy: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <button 
                                    type='submit'
                                    className='w-full bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center space-x-2 transition-colors mt-2 cursor-pointer'
                                >
                                    <RxPlus className='w-4 h-4' />
                                    <span>Add Education</span>
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Experience Section */}
                <div className='bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden'>
                    <div 
                        className='flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50'
                        onClick={() => toggleSection('experience')}
                    >
                        <h3 className='text-lg font-semibold text-gray-800'>Experience</h3>
                        {expandedSections.experience ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                    
                    {expandedSections.experience && (
                        <div className='p-4 pt-0 space-y-4'>
                            {experience.length > 0 && experience.map((exp, index) => (
                                <div 
                                    key={index} 
                                    className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors relative group'
                                >
                                    <div className='flex justify-between items-start'>
                                        <div>
                                            <h4 className='font-medium text-gray-900'>{exp.title}</h4>
                                            <p className='text-sm text-gray-600'>{exp.company}</p>
                                            {exp.desc && <p className='text-sm text-gray-500 mt-1'>{exp.desc}</p>}
                                        </div>
                                        <button 
                                            onClick={() => removeExperience(exp)}
                                            className='text-gray-400 hover:text-red-500 p-1 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity'
                                        >
                                            <FiX className='w-4 h-4 cursor-pointer' />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            <form onSubmit={addExperience} className='space-y-4'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Job Title</label>
                                        <input 
                                            type="text" 
                                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm' 
                                            placeholder='E.g., Software Engineer' 
                                            value={newExperience.title} 
                                            onChange={(e) => setNewExperience({...newExperience, title: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Company</label>
                                        <input 
                                            type="text" 
                                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm' 
                                            placeholder='Company Name' 
                                            value={newExperience.company} 
                                            onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                                    <textarea 
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm min-h-[100px]' 
                                        placeholder='Describe your role and achievements...' 
                                        value={newExperience.desc} 
                                        onChange={(e) => setNewExperience({...newExperience, desc: e.target.value})}
                                    />
                                </div>
                                
                                <button 
                                    type='submit'
                                    className='w-full bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center space-x-2 transition-colors mt-2 cursor-pointer'
                                >
                                    <RxPlus className='w-4 h-4' />
                                    <span>Add Experience</span>
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <div className='sticky bottom-0 h-[80px] bg-white border-t border-gray-200 p-4 -mx-6 -mb-6 mt-6'>
                    <div className='flex justify-end space-x-3'>
                        <button 
                            type='button'
                            onClick={() => setEdit(false)}
                            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer'
                        >
                            Cancel
                        </button>
                        <button 
                            type='button'
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className='px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[120px] cursor-pointer'
                        >
                            {saving ? (
                                <>
                                    <svg className='animate-spin -ml-1 mr-2 h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                    </svg>
                                    <span>Saving...</span>
                                </>
                            ) : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
)
}

export default EditProfile 