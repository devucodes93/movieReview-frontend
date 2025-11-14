import {
  FaThumbsUp,
  FaThumbsDown,
  FaStar,
  FaPlay,
  FaHeart,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import React, { useState, useEffect, useRef } from "react";
import { useMovieStore } from "../store/movieStore";
import { useNavigate } from "react-router-dom";

const DetailsPage = () => {
  const { selectedMovie, reviewHandler, getMovieReviews } = useMovieStore();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);

  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(
    localStorage.getItem("isMuted") === "true"
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (!selectedMovie) return navigate("/");
    if (selectedMovie) setMovie(selectedMovie);

    const fetchReviews = async () => {
      try {
        const res = await getMovieReviews(selectedMovie._id); // should return reviews array
        setReviews(res); // now reviews will populate
      } catch (err) {
        console.error(err);
      }
    };

    fetchReviews();
  }, [selectedMovie]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const [allReviews, setAllReviews] = useState(reviews);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userComment, setUserComment] = useState("");

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i + 1}
        className={`mr-1 ${i < rating ? "text-yellow-400" : "text-gray-600"}`}
      />
    ));
  };

  const handleAddReview = () => {
    if (!userComment || userRating === 0) return;

    const newReview = {
      user: "You",
      rating: userRating,
      comment: userComment,
    };
    reviewHandler(movie._id, newReview);

    setReviews([newReview, ...reviews]);
    setUserRating(0);
    setHoverRating(0);
    setUserComment("");
  };

  return (
    movie && (
      <div className="min-h-screen bg-gray-900 text-white mt-5">
        {/* Hero Section */}
        <div className="relative w-full h-[500px] md:h-[500px] lg:h-[550px]">
          {movie.video !== "https://example.com/video.mp4" && movie.video ? (
            <video
              ref={videoRef}
              src={movie.video}
              autoPlay
              loop
              muted={isMuted}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={movie.thumbnail}
              alt={movie.title}
              className="w-full h-full object-cover"
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

          {/* Overlay Text */}
          <div className=" absolute bottom-4 sm:w-50 sm:ml-7 left-4 right-4 p-2 sm:p-4 rounded bg-black/30 backdrop-blur-sm text-sm sm:text-base">
            <h1 className="font-bold mb-1 sm:mb-2 text-lg sm:text-2xl">
              {movie.title}{" "}
              <span className="text-gray-300 font-medium">
                ({movie.releaseYear})
              </span>
            </h1>
            <div className="flex items-center mb-4">
              <FaStar className="text-yellow-400 mr-2" />
              <span className="text-yellow-400 font-semibold">
                {movie?.avgRating?.toFixed(1) || "N/A"}
              </span>
            </div>
            <p className="text-gray-200 line-clamp-3">{movie.description}</p>
            <div className="mt-4 flex space-x-4">
              {/* <button
                className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-yellow-400 transition flex items-center"
                onClick={() => {
                  navigate(
                    "https://www.primevideo.com/region/eu/detail/0GVRWVPYEWP2ISMP4M9H28TEKE/ref=atv_sr_fle_c_sr01216b_1_1_1?sr=1-1&pageTypeIdSource=ASIN&pageTypeId=B0FVGHTNN2&qid=1763140951149"
                  );
                }}
              >
                <FaPlay className="mr-2" /> Watch
              </button>
              <button className="border border-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-black transition flex items-center">
                <FaHeart className="mr-2" /> Favorite
              </button> */}
            </div>
          </div>
        </div>

        {/* Movie Details */}
        <div className="px-6 md:px-12 py-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            Movie Details
          </h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="w-full rounded-xl shadow-lg"
              />
            </div>
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
              <p>
                <span className="font-bold">Description:</span>{" "}
                {movie.description}
              </p>

              {/* Add Review Section */}
              <div className="mt-12 bg-gray-800 p-4 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
                  Add Your Review
                </h3>

                {/* Star Selection */}
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

                {/* Review Input */}
                <textarea
                  placeholder="Write your review..."
                  className="w-full bg-gray-900 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  rows="3"
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                ></textarea>

                {/* Submit Button */}
                <button
                  onClick={handleAddReview}
                  className="mt-4 bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition"
                >
                  Submit Review
                </button>
              </div>

              {/* Reviews List */}
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
                          {review.user?.name}
                        </span>
                      </div>
                      <p className="text-gray-200">{review.comment}</p>

                      <div className="mt-2 flex space-x-4 text-gray-300">
                        <FaThumbsUp className="cursor-pointer hover:text-green-400 transition " />
                        <FaThumbsDown className="cursor-pointer hover:text-red-500 transition " />
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
