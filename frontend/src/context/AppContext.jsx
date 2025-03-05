
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from "react-toastify";



export const AppContext = createContext();

export const AppContextProvider = (props) => {
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY


  const navigate = useNavigate()

  const { getToken } = useAuth()
  const { user } = useUser()

  const [allCourse, setAllCourse] = useState([])
  const [isEducator, setIsEducator] = useState(false)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [userData,setUserData] = useState(null)

  //calculate the rating
  
  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }
    let totalRating = 0
    course.courseRatings.forEach(rating => {
      totalRating += rating.rating
    });
      return Math.floor(totalRating/course.courseRatings.length)
  }
  

  // fetch all coures 
  const feachAllCourse = async () => {
   
    try {
      const { data } = await axios.get(backendUrl + '/api/course/all');
      
      if (data.success) {
        setAllCourse(data.courses);
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(data.message)
      
    }
  }
  
  // fetch user data

  const fetchUserData = async () => {
    if (user.publicMetadata.role === 'educator') {
      setIsEducator(true)
    }

    try {

      const token = await getToken();
      
      const { data} = await axios.get(backendUrl + '/api/user/data',
        { headers: { Authorization: `Bearer ${token}` } })
      
      if (data.success) {
        setUserData(data.user);
      }
      else {
        toast.error(data.message)
      }
      
    } catch (error) {

      toast.error(error.message)
      
    }
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
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/user/enrolled-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      
  
      if (data.success && Array.isArray(data.enrolledCourses)) {  
        setEnrolledCourses(data.enrolledCourses);
      } else {
        toast.error("Enrolled courses not found");
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };
  


  useEffect(() => {
    if (user) {
      fetchUserData();
    fetchUserEnrolledCourses();

    }
   },[user])

  useEffect(() => {
    feachAllCourse();
  },[])

  const value = {
    currency, allCourse,
    navigate, calculateRating,
    isEducator, setIsEducator, calculateNumberOfLectures,
    calculateCourseDuration, calculateChapterTime, enrolledCourses, fetchUserEnrolledCourses,
    backendUrl,userData,setUserData, getToken, fetchUserData
  }

  return (

    <AppContext.Provider value={value}>

     
      {props.children}

      </AppContext.Provider>
  )
}
