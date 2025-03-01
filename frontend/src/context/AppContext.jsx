import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration';
import { useAuth, useUser } from '@clerk/clerk-react';



export const AppContext = createContext();

export const AppContextProvider = (props) => {
  
  const currency = import.meta.env.VITE_CURRENCY


  const navigate = useNavigate()

  const { getToken } = useAuth()
  const { user } = useUser()

  const [allCourse, setAllCourse] = useState([])
  const [isEducator, setIsEducator] = useState(true)
  const [enrolledCourses, setEnrolledCourses] = useState([])

  //calculate the rating
  
  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }
    let totalRating = 0
    course.courseRatings.forEach(rating => {
      totalRating += rating.rating
    });
      return totalRating/course.courseRatings.length
  }
  

  // dumydata function
  const feachAllCourse = async () => {
    setAllCourse(dummyCourses)
   }

  // course chapter time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.forEach((lecture) => {
      time += lecture.lectureDuration;
    });
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
  }

  // function to calclate course Duration 

  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        chapter.chapterContent.forEach((lecture) => {
          time += lecture.lectureDuration;
        });
      }
    });
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
  };

  // number of leacture function 

  const calculateNumberOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach(chapter => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length
      }
    });
    return totalLectures;
  }

  //feacth user Enrolled Courses
  
  const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses)
  }


  const logToken = async () => {
    console.log(await getToken());
  }

  useEffect(() => {
    if (user) {
      logToken();
    }
   },[user])

  useEffect(() => {
    feachAllCourse();
    fetchUserEnrolledCourses();
  },[])

  const value = {
    currency, allCourse,
    navigate, calculateRating,
    isEducator, setIsEducator, calculateNumberOfLectures,
    calculateCourseDuration,calculateChapterTime,enrolledCourses,fetchUserEnrolledCourses
  }

  return (

    <AppContext.Provider value={value}>

     
      {props.children}

      </AppContext.Provider>
  )
}
