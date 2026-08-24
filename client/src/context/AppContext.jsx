import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration';
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from 'axios';
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();

  // Extract auth properties from Clerk
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  // Fetch All Courses
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/course/all');

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("fetchAllCourses Error:", error);
      toast.error(error.message);
    }
  };

  // Fetch User Data
  const fetchUserData = async () => {
    if (user?.publicMetadata?.role === 'educator') {
      setIsEducator(true);
    }

    try {
      const token = await getToken();

      if (!token) {
        console.warn("Token missing!");
        return;
      }

      const { data } = await axios.get(backendUrl + '/api/user/data', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("fetchUserData Error:", error);
      toast.error(error.message);
    }
  };

  // Fetch User Enrolled Courses
  const fetchUserEnrolledCourses = async () => {
    try {
      const token = await getToken();

      if (!token) {
        console.warn("Token missing while fetching enrolled courses!");
        return;
      }

      const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("fetchUserEnrolledCourses Error:", error);
      toast.error(error.message);
    }
  };

  // Calculate Average Rating of Course (Default: 4.8)
  const calculateRating = (course) => {
    if (!course?.courseRatings || course.courseRatings.length === 0) {
      return 4.8;
    }

    let totalRating = 0;
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating || 0;
    });

    const avg = totalRating / course.courseRatings.length;
    return Number(avg.toFixed(1));
  };

  // Calculate Course Chapter Time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    if (chapter && Array.isArray(chapter.chapterContent)) {
      chapter.chapterContent.forEach((lecture) => (time += lecture.lectureDuration || 0));
    }
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Calculate Course Duration
  const calculateCourseDuration = (course) => {
    let time = 0;

    if (course && Array.isArray(course.courseContent)) {
      course.courseContent.forEach((chapter) => {
        if (Array.isArray(chapter?.chapterContent)) {
          chapter.chapterContent.forEach((lecture) => (time += lecture.lectureDuration || 0));
        }
      });
    }

    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Calculate No of Lectures in the Course
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    if (course && Array.isArray(course.courseContent)) {
      course.courseContent.forEach((chapter) => {
        if (Array.isArray(chapter?.chapterContent)) {
          totalLectures += chapter.chapterContent.length;
        }
      });
    }
    return totalLectures;
  };

  // Initial Load: Fetch All Courses
  useEffect(() => {
    fetchAllCourses();
  }, []);

  // User Authentication Load: Fetch Profile & Enrolled Data
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }
  }, [isLoaded, isSignedIn, user]);

  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    enrolledCourses,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};