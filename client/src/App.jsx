import React from 'react';
import { Route, Routes, useMatch, Navigate } from 'react-router-dom';
import Home from './pages/student/Home';
import CoursesList from './pages/student/CoursesList';
import CourseDetails from './pages/student/CourseDetails';
import MyEnrollments from './pages/student/MyEnrollments';
import Player from './pages/student/Player';
import Loading from './components/student/Loading';
import Educator from './pages/educator/Educator';
import Dashboard from './pages/educator/Dashboard';
import AddCourse from './pages/educator/AddCourse';
import MyCourses from './pages/educator/MyCourses';
import StudentsEnrolled from './pages/educator/StudentsEnrolled';
import AdminLogin from './pages/educator/AdminLogin';
import Navbar from './components/student/Navbar';
import "quill/dist/quill.snow.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AIChatWidget from './components/student/AIChatWidget'; 

// Admin Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true";
  return isAuthenticated ? children : <Navigate to="/admin-login" replace />;
};

const App = () => {

  const isEducatorRoute = useMatch('/educator/*');

  return (
    <div className='text-default min-h-screen bg-white flex flex-col justify-between'>
      
      <ToastContainer />

      {/* Navbar show only on Student routes */}
      {!isEducatorRoute && <Navbar />}

      <div className='flex-grow'>
        <Routes>

          {/* Student Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/course-list' element={<CoursesList />} />
          <Route path='/course-list/:input' element={<CoursesList />} />
          <Route path='/course/:id' element={<CourseDetails />} />
          <Route path='/my-enrollments' element={<MyEnrollments />} />
          <Route path='/player/:courseId' element={<Player />} />
          <Route path='/loading/:path' element={<Loading />} />

          {/* Admin Login Route */}
          <Route path='/admin-login' element={<AdminLogin />} />

          {/* Educator Dashboard Routes (Protected) */}
          <Route path='/educator' element={
            <ProtectedRoute>
              <Educator />
            </ProtectedRoute>
          }>
            <Route path='/educator' element={<Dashboard />} />
            <Route path='add-course' element={<AddCourse />} />
            <Route path='my-courses' element={<MyCourses />} />
            <Route path='student-enrolled' element={<StudentsEnrolled />} />
          </Route>

        </Routes>
      </div>

      {/* Floating AI Chat Widget */}
      <AIChatWidget />

    </div>
  );
};

export default App;