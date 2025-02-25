import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import assets, { dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/student/Loading';

const Dashbord = () => {

  const { currency } = useContext(AppContext); 
  const [dashbordData, setDashbordData] = useState(null)
 
  const fetchDashbordData = async () => {
     setDashbordData(dummyDashboardData)
   }

  useEffect(() => {
    fetchDashbordData()
  },[])
  
  return  dashbordData ? (
    <div className='min-h-screen flex flex-col items-start justify-between
    gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      
      <div className='space-y-5'>
        <div className='flex flex-wrap gap-5 items-center'>

          <div className='flex items-center gap-3 shadow-card border border-blue-500
           p-4 w-56 rounded-md'>
            <img src={assets.patients_icon} alt="patients_icon" />
            <div>
              <p className='text-2xl font-medium text-gray-600'>{ dashbordData.enrolledStudentsData.length}</p>
              <p className='text-base text-gray-500'>Total Enrolement</p>
            </div>

          </div>
          
          <div className='flex items-center gap-3 shadow-card border border-blue-500
          p-4 w-56 rounded-md'>
            <img src={assets.appointments_icon} alt="appointments_icon" />
            <div>
              <p className='text-2xl font-medium text-gray-600'>{ dashbordData.totalCourses}</p>
              <p className='text-base text-gray-500'>Total Courses</p>
            </div>

          </div>

          <div className='flex items-center gap-3 shadow-card border border-blue-500
          p-4 w-56 rounded-md'>
            <img src={assets.earning_icon} alt="earning_icon" />
            <div>
              <p className='text-2xl font-medium text-gray-600'> { currency} { dashbordData.totalEarning}</p>
              <p className='text-base text-gray-500'>Total Earnings</p>
            </div>

          </div>

        </div>
      </div>
    </div>
  ) : <Loading />
}

export default Dashbord