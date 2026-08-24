import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  // Computed Rating Value (4.8 or calculated average)
  const ratingValue = calculateRating ? calculateRating(course) : 4.8;
  const totalRatingsCount = course?.courseRatings?.length || 0;

  return (
    <Link
      to={"/course/" + course._id}
      onClick={() => scrollTo(0, 0)}
      className="border border-gray-500/30 overflow-hidden rounded-lg pb-6"
    >
      {/* Course Thumbnail */}
      <img
        src={course.courseThumbnail}
        alt={course.courseTitle}
        className="w-full"
      />

      {/* Course Details */}
      <div className="p-3 text-left">
        {/* Course Title */}
        <h3 className="text-base font-semibold">{course.courseTitle}</h3>

        {/* Educator */}
        <p className="text-gray-500">FastSol</p>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{ratingValue}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.floor(ratingValue)
                    ? assets.star
                    : assets.star_blank
                }
                alt="star"
                className="w-3.5 h-3.5"
              />
            ))}
          </div>
          <p className="text-gray-500 text-sm">({totalRatingsCount})</p>
        </div>

        {/* Price */}
        <p className="text-base font-semibold text-gray-800 mt-2">
          {currency}
          {(
            course.coursePrice -
            (course.discount * course.coursePrice) / 100
          ).toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;