import React from 'react';
import assets from '../../assets/assets';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  return (
    <Link
      to={'/course/' + course._id}
      onClick={() => scrollTo(0, 0)}
      className='border border-gray-500/30 pb-6 overflow-hidden rounded-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-lg'
    >
      <div className='relative'>
        <img
          className='w-full h-40 object-cover object-center '
          src={course.courseThumbnail}
          alt={course.courseTitle}
        />
        {/* Hover Overlay */}
        <div className='absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
          <p className='text-white font-semibold text-lg'>View Course</p>
        </div>
      </div>

      <div className='p-3 text-left'>
        <h3 className='text-base font-semibold hover:text-blue-600 transition-colors duration-300'>
          {course.courseTitle}
        </h3>
        <p className='text-gray-500'>{course.educator.name}</p>
        <div className='flex items-center space-x-2'>
          <p>{calculateRating(course)}</p>
          <div className='flex'>
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank}
                alt=''
                className='w-3.5 h-3.5'
              />
            ))}
          </div>
          <p className='text-gray-500'>{course.courseRatings.length}</p>
        </div>
        <p className='text-base font-semibold text-gray-800'>
          {currency}
          {(course.coursePrice - (course.discount * course.coursePrice) / 100).toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;