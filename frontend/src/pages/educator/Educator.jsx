import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/educator/Navbar';
import Sidebar from '../../components/educator/Sidebar';
import Footer from '../../components/educator/Footer';

const Educator = () => {
  const location = useLocation();
  
  

  return (
    <div className='text-default min-h-screen bg-white'>
      <Navbar />
      <div className='flex'>
        <Sidebar />
        <div className='flex-1 p-4'>

          {location.pathname === "/educator" && <Navigate to="/educator/dashbord" replace />}
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Educator;
