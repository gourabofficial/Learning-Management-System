import React from 'react';
import { Route, Routes, useMatch } from 'react-router-dom';
import Home from './pages/student/Home.jsx';
import CoursesList from './pages/student/CoursesList.jsx';
import CourseDetails from './pages/student/CourseDetails.jsx';
import MyEnrollments from './pages/student/MyEnrollments.jsx';
import Player from './pages/student/Player.jsx';
import Loading from './components/student/Loading.jsx';
import Educator from './pages/educator/Educator.jsx';
import Dashbord from './pages/educator/Dashbord.jsx';
import AddCourse from './pages/educator/AddCourse.jsx';
import MyCourses from './pages/educator/MyCourses.jsx';
import StudentEnrolled from './pages/educator/StudentEnrolled.jsx';
import Navbar from './components/student/Navbar.jsx';
import "quill/dist/quill.snow.css";
import { ToastContainer } from 'react-toastify';
import EducatorRequest from './pages/educator/EducatorRequest.jsx';

const App = () => {
  const isEducatorRoute = useMatch('/educator/*');

  return (
    <div className='bg-white min-h-screen text-default'>
      <ToastContainer />
      {!isEducatorRoute && <Navbar />}
      <Routes>
        {/* Student Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/course-list' element={<CoursesList />} />
        <Route path='/course-list/:input' element={<CoursesList />} />
        <Route path='/course/:id' element={<CourseDetails />} />
        <Route path='/my-enrollments' element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path='/loading/:path' element={<Loading />} />

        {/* Educator Layout */}
        <Route path='/educator' element={<Educator />}>
          <Route index element={<Dashbord />} />
          <Route path='dashbord' element={<Dashbord />} />
          <Route path='add-course' element={<AddCourse />} />
          <Route path='my-courses' element={<MyCourses />} />
          <Route path='student-enrolled' element={<StudentEnrolled />} />
        </Route>

        {/* Educator Request Route */}
        <Route path='/educator-request' element={<EducatorRequest />} />
      </Routes>
    </div>
  );
};

export default App;
