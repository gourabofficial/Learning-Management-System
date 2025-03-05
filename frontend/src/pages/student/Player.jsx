import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import assets from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../../components/student/Loading";

const Player = () => {
  const {
    enrolledCourses,
    calculateChapterTime,
    backendUrl,
    getToken,
    fetchUserEnrolledCourses,
    userData,
  } = useContext(AppContext);

  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  // Fetch course data from enrolledCourses
  const getCourseData = () => {
    const course = enrolledCourses.find((course) => course._id === courseId);
    
    if (course) {
      setCourseData(course);
      // Set initial rating if the user has already rated the course
      if (course.courseRatings && userData) {
        const userRating = course.courseRatings.find((rating) => rating.userId === userData._id);
        if (userRating) {
          setInitialRating(userRating.rating);
        }
      }
    }
  };

  // Toggle section visibility
  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Mark a lecture as completed
  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-course-progress`,
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getCourseProgress(); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch course progress
  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-course-progress`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        console.log("Updated progress data:", data.progressData); // Debugging line
        setProgressData(data.progressData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle course rating
  const handleRate = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/add-rating`,
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchUserEnrolledCourses(); 
        setInitialRating(rating); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch course data when enrolledCourses changes
  useEffect(() => {
    if (enrolledCourses.length > 0 && courseId) {
      getCourseData();
    }
  }, [enrolledCourses, courseId]);

  // Fetch course progress on component mount
  useEffect(() => {
    if (courseId) {
      getCourseProgress();
    }
  }, [courseId]);

  // Render loading state if courseData is not available
  if (!courseData) {
    return <Loading />;
  }

  return (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        {/* Left side: Course structure */}
        <div className="text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>
          <div className="pt-5">
            {courseData.courseContent && courseData.courseContent.length > 0 ? (
              courseData.courseContent.map((chapter, index) => (
                <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""}`}
                        src={assets.down_arrow_icon}
                        alt="down_arrow_icon"
                      />
                      <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
                    </div>
                    <p className="text-sm md:text-default">
                      {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
                    </p>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-96" : "max-h-0"}`}>
                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-1">
                          <img
                            src={progressData && progressData.lectureCompleted.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon}
                            alt="play-icon"
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.lectureUrl && (
                                <p
                                  onClick={() => setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 })}
                                  className="text-blue-500 cursor-pointer"
                                >
                                  Watch
                                </p>
                              )}
                              <p>
                                {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <p>No course content available.</p>
            )}
          </div>
          <div className="flex items-center gap-2 py-3 mt-10">
            <h1 className="text-xl font-bold">Rate this Course</h1>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>
        </div>

        {/* Right side: Video player or course thumbnail */}
        <div className="md:mt-10">
          {playerData ? (
            <div>
              <YouTube videoId={playerData.lectureUrl.split('/').pop()} iframeClassName="w-full aspect-video" />
              <div className="flex justify-between items-center mt-1">
                <p>{playerData.chapter}.{playerData.lecture}. {playerData.lectureTitle}</p>
                <button
                  onClick={() => markLectureAsCompleted(playerData.lectureId)}
                  className="text-blue-600"
                >
                  {progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? "Completed" : "Mark Completed"}
                </button>
              </div>
            </div>
          ) : (
            courseData.courseThumbnail ? (
              <img src={courseData.courseThumbnail} alt="Course thumbnail" className="w-full" />
            ) : (
              <p>No thumbnail available.</p>
            )
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Player;