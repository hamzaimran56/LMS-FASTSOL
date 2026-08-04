import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ data }) => {
  const navigate = useNavigate();

  // Input State
  const [input, setInput] = useState(data ? data : "");

  // Search Handler
  const onSearchHandler = (e) => {
    e.preventDefault();

    // Navigate to Course List Page
    navigate("/course-list/" + input);
  };

  return (
    <form
      onSubmit={onSearchHandler}
      className="max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded"
    >
      {/* Search Icon */}
      <img
        src={assets.search_icon}
        alt="Search Icon"
        className="md:w-auto w-10 px-3"
      />

      {/* Search Input */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search For Courses"
        className="w-full h-full outline-none text-gray-500/80"
      />

      {/* Search Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white rounded md:px-10 px-7 md:py-3 py-2 mx-1"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;