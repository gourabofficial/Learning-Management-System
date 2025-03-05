import React from 'react'
import assets, { dummyEducatorData } from '../../assets/assets.js';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Code } from 'lucide-react';

const Navbar = () => {

  const educatorData = dummyEducatorData;
  const { user } = useUser();

  return (
    <div className='flex items-center justify-between px-4 md:px-8
    border-b border-gray-500 py-3'> 
      <Link to='/' className='flex items-center gap-2 hover:text-[#1E40AF]  transition-colors duration-300'>
        <Code className="w-10 h-10 text-[#000000] font-extrabold" />
        <h1 className="text-2xl font-bold text-[#000000]">
          CourseHub
        </h1>
      </Link>
      <div className='flex items-center gap-5 text-gray-500 relative'> 
        <p>Hi! {user ? user.fullName : 'Developers'}</p>
        {user ? <UserButton /> : <img className='max-w-8' src={
          assets.profile_img
        } />}
      </div>
    </div>
  )
}

export default Navbar