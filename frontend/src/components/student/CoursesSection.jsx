import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'

const CoursesSection = () => {

  const { allCourse} = useContext(AppContext)
  return (
    <div className='py-16 md:px-40 px-8'>
      <h2 className='text-3xl font-medium text-gray-800'>Learn from the best </h2>
      <p className='text-sm md:text-base text-gray-500 mt-3'>Discover our top-rated course across various categories. coding and Design to 
        business <br /> and personal development,our courses are crafted to deliver the best results. 
      </p>

      <div className='grid grid-cols-auto  gap-4 px-4 md:px-0 md:my-16
      my-10 '>
        {allCourse.slice(0, 4).map((course, index) => <CourseCard
          key={index} course={ course}/>)}
    </div>
      
      <Link to={'/course-list'} onClick={() => scrollTo(0, 0)}
      className='text-gray-950 border border-gray-500/30 rounded px-10 py-3'
      > Show all courses</Link>
    </div>
  )
}

export default CoursesSection