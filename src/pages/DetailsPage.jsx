import {
  FaThumbsUp,
  FaThumbsDown,
  FaStar,
  FaVolumeMute,
  FaVolumeUp,
  FaPauseCircle,
  FaRegStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { Loader } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useMovieStore } from "../store/movieStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../font.css";

const DetailsPage = () => {
  const { selectedMovie, reviewHandler, getMovieReviews } = useMovieStore();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [fetchingRating, setFetchingRating] = useState(false);

  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(
    localStorage.getItem("isMuted") === "true"
  );

  const navigate = useNavigate();

  // load movie + reviews
  useEffect(() => {
    if (!selectedMovie) return navigate("/");

    setMovie(selectedMovie);

    const fetchReviews = async () => {
      try {
        const res = await getMovieReviews(selectedMovie._id);
        setReviews(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReviews();
  }, [selectedMovie]);

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
    }, 1500);
  };

  // mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // stars for reviews
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i + 1}
        className={`mr-1 ${i < rating ? "text-yellow-400" : "text-gray-600"}`}
      />
    ));
  };

  // add review
  const handleAddReview = async () => {
    if (!userComment || userRating === 0) {
      toast.error("Please add rating/comment");
      return;
    }

    setFetchingRating(true);

    const newReview = {
      user: "You",
      rating: userRating,
      comment: userComment,
    };

    try {
      // Add review to backend
      await reviewHandler(movie._id, newReview);

      // Wait 300ms to ensure backend updated (sometimes needed)
      await new Promise((r) => setTimeout(r, 300));

      // Fetch latest reviews
      const updatedReviews = await getMovieReviews(movie._id);
      setReviews(updatedReviews);

      // reset inputs
      setUserRating(0);
      setHoverRating(0);
      setUserComment("");
    } catch (err) {
      toast.error("Failed to add review");
      console.error(err);
    } finally {
      setFetchingRating(false);
    }
  };

  return (
    movie && (
      <div className="min-h-screen bg-gray-900 text-white mt-5">
        <div className="relative w-full h-[500px] md:h-[500px] overflow-hidden lg:h-[550px]">
          {showPauseIcon && (
            <div className="absolute inset-0  flex items-center justify-center bg-black/20 z-20">
              <FaPauseCircle size={40} className="text-white opacity-90" />
            </div>
          )}

          {movie.video !== "https://example.com/video.mp4" && movie.video ? (
            <video
              ref={videoRef}
              onClick={handleVideoClick}
              src={movie.video}
              autoPlay
              loop
              muted={isMuted}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={movie.thumbnail}
              loading="lazy"
              alt={movie.title}
              className="w-full h-full object-cover lg:object-top"
            />
          )}
          {movie.video !== "https://example.com/video.mp4" && (
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 bg-black/40 p-3 rounded-full hover:bg-black/60 transition"
            >
              {isMuted ? (
                <FaVolumeMute className="text-white" />
              ) : (
                <FaVolumeUp className="text-white" />
              )}
            </button>
          )}
          {/* title  */}
          <div className="absolute bottom-4 sm:w-50 sm:ml-7 left-4 right-4 p-2 sm:p-4 rounded bg-black/30 backdrop-blur-sm text-sm sm:text-base">
            <h1 className="font-bold mb-1 sm:mb-2 text-lg sm:text-2xl">
              {movie.title}{" "}
              <span className="text-gray-300 font-medium">
                ({movie.releaseYear})
              </span>
            </h1>

            <div className="flex items-center mb-4">
              <FaStar className="text-yellow-400 mr-2" />
              {fetchingRating ? (
                <Loader className="animate-spin h-5 w-5 text-yellow-400" />
              ) : (
                <span className="text-yellow-400 font-semibold">
                  {movie?.avgRating?.toFixed(1) || "N/A"}
                </span>
              )}
            </div>

            <p className="text-gray-200 line-clamp-3">{movie.description}</p>
          </div>
        </div>

        {/* movie content */}
        <div className="px-6 md:px-12 py-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            Movie Details
          </h2>

          <div className="flex flex-col md:flex-row gap-8">
            {/* poster */}
            <div className="md:w-1/3">
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="w-full rounded-xl shadow-lg"
              />
            </div>

            {/* info */}
            <div className="md:w-2/3 text-gray-200 space-y-4">
              <p>
                <span className="font-bold">Genre:</span> {movie.genre}
              </p>

              <p>
                <span className="font-bold">Duration:</span>{" "}
                {movie.duration || "2h 15m"}
              </p>

              <p>
                <span className="font-bold">Director:</span>{" "}
                {movie.director || "Unknown"}
              </p>

              <p>
                <span className="font-bold">Cast:</span>{" "}
                {movie.cast ? movie.cast.map((c) => c.name).join(", ") : "N/A"}
              </p>
              <h1 className="font-bold mb-1 sm:mb-2 text-lg sm:text-2xl">
                <div className="flex items-center mt-1 text-xs sm:text-base">
                  {[1, 2, 3, 4, 5].map((i) => {
                    if (i <= Math.floor(movie?.avgRating || 0)) {
                      return (
                        <FaStar key={i} className="text-yellow-400 mr-1" />
                      );
                    } else if (
                      i === Math.ceil(movie?.avgRating || 0) &&
                      movie?.avgRating % 1 !== 0
                    ) {
                      return (
                        <FaStarHalfAlt
                          key={i}
                          className="text-yellow-400 mr-1"
                        />
                      );
                    } else {
                      return (
                        <FaRegStar key={i} className="text-gray-600 mr-1" />
                      );
                    }
                  })}
                  <span className="ml-1 text-gray-300 font-medium text-xs sm:text-base">
                    ({movie?.avgRating?.toFixed(1)})
                  </span>
                </div>
              </h1>
              <p>
                <span className="font-bold">Description:</span>{" "}
                {movie.description}
              </p>

              {/* add review */}
              <div className="mt-12 bg-gray-800 p-4 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
                  Add Your Review
                </h3>

                {/* star */}
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`cursor-pointer text-3xl mr-2 transition ${
                        star <= (hoverRating || userRating)
                          ? "text-yellow-400"
                          : "text-gray-600"
                      }`}
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                </div>

                {/* comment box */}
                <textarea
                  placeholder="write your review..."
                  className="w-full bg-gray-900 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  rows="3"
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                />

                {/* submit */}
                <button
                  onClick={handleAddReview}
                  className="mt-4 bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition"
                >
                  Submit Review
                </button>
              </div>

              {/* reviews */}
              <div className="mt-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
                  Reviews
                </h2>

                <div className="space-y-6">
                  {reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800 p-4 rounded-xl shadow-md flex flex-col"
                    >
                      <div className="flex items-center mb-2">
                        {renderStars(review.rating)}

                        <span className="ml-2 text-gray-300 font-semibold">
                          {review.user?.name || review.user}
                        </span>
                      </div>

                      <p className="text-gray-200">{review.comment}</p>

                      <div className="mt-2 flex space-x-4 text-gray-300">
                        <FaThumbsUp className="cursor-pointer hover:text-green-400 transition" />
                        <FaThumbsDown className="cursor-pointer hover:text-red-500 transition" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default DetailsPage;
