import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { useMovieStore } from "../store/movieStore";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const NavBar = ({ movies }) => {
  const { logout } = useAuthStore();
  const { setSelectedMovie } = useMovieStore();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  //this the ref for user menu dropdown
  const userMenuRef = useRef(null);

  const handleSearch = (value) => {
    setSearch(value);
    const filtered = movies.filter(
      (m) =>
        m.title.toLowerCase().includes(value.toLowerCase()) ||
        m.genre.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(value ? filtered.slice(0, 5) : []);
  };

  const handleSelect = (title) => {
    const filtered = movies.filter((m) =>
      m.title.toLowerCase().includes(title.toLowerCase())
    );
    if (filtered.length === 0) return;
    setSelectedMovie(filtered[0]);
    setSearch(filtered[0].title);
    setSuggestions([]);
    navigate("/details/" + filtered[0]._id);
  };

  const handleLogout = () => {
    logout();
  };

  // closing dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between px-3 sm:px-5 py-2 md:py-0">
      <h2
        className="text-xl sm:text-4xl  cursor-pointer font-bebas"
        onClick={() => navigate("/")}
      >
        CineTrack
      </h2>

      {/* Search input */}
      <div className="md:flex-[0.9] flex-[0.8] sm:ml-220 mx-2 relative font-bebas">
        <input
          type="text"
          placeholder="Search movies..."
          className="w-full bg-gray-800 text-white placeholder-gray-400 px-3 py-2 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />

        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-gray-800 border border-gray-700 rounded-xl mt-1 shadow-lg z-50 text-sm">
            {suggestions.map((m, idx) => (
              <div
                key={idx}
                className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSelect(m.title)}
              >
                {m.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User icon */}
      <div className="relative" ref={userMenuRef}>
        <FaUserCircle
          size={28}
          className="cursor-pointer"
          onClick={() => setShowUserMenu((prev) => !prev)}
        />
        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-50 text-sm">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
