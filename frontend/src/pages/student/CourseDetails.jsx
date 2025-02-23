import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const CourseDetail = () => {

  const { id } = useParams()
  const [courseData, setCourseData] = useState(null)
  const { allCourse } = useContext(AppContext)
  
  const featchCourseData = async () => {
    const findCourse= allCourse.find(course => course._id === id)
    setCourseData(findCourse);

  }
 
  useEffect(() => {
    featchCourseData()
  },[])

  return (
    <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start
    justify-between md:px-36 px-8 md:pt-30 pt-20 text-left  ' >

      <div className='absolute top-0 left-0 w-full h-section-height -z-1
      bg-gradient-to-b from-cyan-100/70'> 

      </div>
      
      {/* left side  */}
        <div></div>
      {/* right side  */}
      <div></div>

    </div>
  )
}

export default CourseDetail