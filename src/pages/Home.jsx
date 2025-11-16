import React, { useEffect, useRef, useState } from "react";
import { useMovieStore } from "../store/movieStore";
import "../font.css";
import {
  FaStar,
  FaVolumeMute,
  FaVolumeUp,
  FaStarHalfAlt,
  FaChevronLeft,
  FaRegStar,
  FaChevronRight,
  FaPauseCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { getMovies, movies, setSelectedMovie, selectedMovie } =
    useMovieStore();
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoMovies, setVideoMovies] = useState([]); // only movies with trailers
  const [heroIndex, setHeroIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    getMovies();
  }, []);

  // Filter movies that have trailer
  useEffect(() => {
    const vids = movies.filter(
      (m) => m.video !== "https://example.com/video.mp4"
    );
    setVideoMovies(vids);
    setHeroIndex((Math.random() * vids.length) | 0);
  }, [movies]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
      localStorage.setItem("isMuted", videoRef.current.muted);
    }
  };
  const handleVideoClick = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setShowPauseIcon(false);
    } else {
      videoRef.current.pause();
      setShowPauseIcon(true);
    }

    setTimeout(() => {
      setShowPauseIcon(false);
    }, 1000);
  };

  const prevVideo = () => {
    setIsVideoLoading(true);
    setHeroIndex((prev) => (prev === 0 ? videoMovies.length - 1 : prev - 1));
  };

  const nextVideo = () => {
    setIsVideoLoading(true);
    setHeroIndex((prev) => (prev + 1) % videoMovies.length);
  };

  const heroMovie = videoMovies[heroIndex];

  return (
    <div className="min-h-screen bg-gray-900 px-[5px] py-4 text-white  font-cabin ">
      {/* <h3 className="text-xl sm:text-3xl font-extrabold px-[5px] tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-pink-400 to-white uppercase drop-shadow-2xl mb-3 underline">
        Newest
      </h3> */}

      {/* Hero Section */}
      {heroMovie && (
        <div className="relative h-96 md:h-[500px] lg:h-[350px] rounded-xl overflow-hidden mb-6">
          {isVideoLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
              <div className="loader border-t-4 border-b-4 border-yellow-500 w-12 h-12 rounded-full animate-spin"></div>
            </div>
          )}
          {showPauseIcon && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-20">
              <FaPauseCircle size={40} className="text-white opacity-90" />
            </div>
          )}
          <video
            key={heroMovie._id}
            ref={videoRef}
            onClick={handleVideoClick}
            src={heroMovie.video}
            autoPlay
            onCanPlay={() => setIsVideoLoading(false)}
            loop
            muted={isMuted}
            className="w-full h-full object-cover md:object-cover sm:object-contain transition-all duration-500"
          />

          {/* Mute button */}
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 bg-black/40 p-2 rounded-full text-white hover:bg-black/60 transition cursor-pointer"
          >
            {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
          </button>

          <button
            onClick={prevVideo}
            className="absolute cursor-pointer top-1/2 left-2 transform -translate-y-1/2 bg-black/30 p-2 rounded-full text-white hover:bg-black/50 transition"
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={nextVideo}
            className="absolute cursor-pointer top-1/2 right-2 transform -translate-y-1/2 bg-black/30 p-2 rounded-full text-white hover:bg-black/50 transition"
          >
            <FaChevronRight />
          </button>

          {/* Text overlay */}
          <div className=" absolute bottom-4 sm:w-50 sm:ml-7 left-4 right-4 p-2 sm:p-4 rounded bg-black/30 backdrop-blur-sm text-sm sm:text-base">
            <h1 className="font-bold mb-1 sm:mb-2 text-lg sm:text-2xl">
              {heroMovie.title}{" "}
              <div className="flex items-center mt-1 text-xs sm:text-base">
                {[1, 2, 3, 4, 5].map((i) => {
                  if (i <= Math.floor(heroMovie?.avgRating || 0)) {
                    return <FaStar key={i} className="text-yellow-400 mr-1" />;
                  } else if (
                    i === Math.ceil(heroMovie?.avgRating || 0) &&
                    heroMovie?.avgRating % 1 !== 0
                  ) {
                    return (
                      <FaStarHalfAlt key={i} className="text-yellow-400 mr-1" />
                    );
                  } else {
                    return <FaRegStar key={i} className="text-gray-600 mr-1" />;
                  }
                })}
                <span className="ml-1 text-gray-300 font-medium text-xs sm:text-base">
                  ({heroMovie?.avgRating?.toFixed(1)})
                </span>
              </div>
            </h1>
            <p className="text-gray-300 mb-2 sm:mb-4 line-clamp-2 text-xs sm:text-sm">
              {heroMovie.description}
            </p>
            <button
              className="bg-yellow-500 text-black px-3 py-1 sm:px-6 sm:py-2 rounded-lg font-bold shadow-lg w-max text-xs sm:text-base hover:bg-yellow-400 transition cursor-pointer"
              onClick={() => {
                setSelectedMovie(heroMovie);
                navigate("/details/" + heroMovie._id);
              }}
            >
              Explore
            </button>
          </div>
        </div>
      )}

      <h3 className="text-xl sm:text-3xl font-extrabold px-[5px] tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-400 to-red-500 uppercase drop-shadow-2xl">
        Trending Now
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[5px] mt-5">
        {movies.map((movie) => (
          <div
            onClick={() => {
              setSelectedMovie(movie);

              navigate("/details/" + movie._id);
            }}
            key={movie._id}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-md transition-transform duration-300 cursor-pointer hover:shadow-xl group relative"
          >
            <div className="relative">
              <img
                src={movie.thumbnail}
                alt={movie.title}
                loading="lazy"
                className="w-full h-64 object-cover transition duration-300 group-hover:blur-sm"
              />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold shadow-lg cursor-pointer">
                  See Details
                </button>
              </div>

              <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full font-bold flex items-center shadow-md">
                <FaStar className="mr-1" />{" "}
                {movie.avgRating?.toFixed(1) || "N/A"}
              </div>
            </div>

            <div className="p-3">
              <div className="inline-block bg-black/30 backdrop-blur-sm px-1 py-0.5 rounded">
                <h2 className="text-sm sm:text-lg font-semibold hover:text-yellow-400 transition">
                  {movie.title}
                </h2>
              </div>

              <div className="inline-block bg-black/20 backdrop-blur-sm px-1 py-0.5 rounded mt-1">
                <p className="text-gray-400 text-xs sm:text-sm mb-2">
                  {movie.genre}
                </p>
              </div>

              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((i) => {
                  if (i <= Math.floor(movie?.avgRating || 0)) {
                    return (
                      <FaStar
                        key={i}
                        className="text-yellow-400 mr-1"
                        size={10}
                      />
                    );
                  } else if (
                    i === Math.ceil(movie?.avgRating || 0) &&
                    movie?.avgRating % 1 !== 0
                  ) {
                    return (
                      <FaStarHalfAlt
                        key={i}
                        size={10}
                        className="text-yellow-400 mr-1"
                      />
                    );
                  } else {
                    return (
                      <FaRegStar
                        size={10}
                        key={i}
                        className="text-gray-600 mr-1"
                      />
                    );
                  }
                })}
                <span className="text-gray-400 text-xs sm:text-sm ml-0">
                  {movie.avgRating.toFixed(1)}/5.0
                </span>
              </div>

              <div className="inline-block bg-black/20 backdrop-blur-sm px-1 py-0.5 rounded">
                <p className="text-gray-300 text-xs sm:text-sm line-clamp-3">
                  {movie.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
