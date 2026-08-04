import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <div className="py-16 px-8 md:px-12 lg:px-24 xl:px-32">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-3xl font-medium text-gray-800">
          Learn from the best
        </h2>

        <p className="text-sm md:text-base text-gray-500 mt-3 max-w-2xl mx-auto">
          Discover our top-rated courses across various categories. From coding
          and design to business and wellness, our courses are crafted to
          deliver results.
        </p>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
        {allCourses.slice(0, 4).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>

      {/* Button */}
      <div className="flex justify-center mt-10">
        <Link
          to="/course-list"
          onClick={() => scrollTo(0, 0)}
          className="border border-gray-500/30 text-gray-500 px-10 py-3 rounded"
        >
          Show All Courses
        </Link>
      </div>
    </div>
  );
};

export default CoursesSection;