import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useMovieStore = create((set, get) => ({
  movies: [],

  setMovies: (movies) => set({ movies }),
  selectedMovie: null,
  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
  rating: 0,
  setRating: (rating) => set({ rating }),

  // Fetch movies from API
  getMovies: async () => {
    try {
      const response = await axiosInstance.get("/movies");

      set({ movies: response?.data?.movies });
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  },

  // create a new review for a specific movie
  reviewHandler: async (movieId, reviewData) => {
    try {
      const response = await axiosInstance.post(
        `/movies/create/` + movieId,
        reviewData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  },

  // fetch reviews for a specific movie
  getMovieReviews: async (movieId) => {
    try {
      const response = await axiosInstance.post(
        `/movies/get-reviews/` + movieId
      );
      const avgRating =
        response.data.length > 0
          ? response.data.reduce((sum, r) => sum + r.rating, 0) /
            response.data.length
          : 0;

      setRating(avgRating);
      return response.data.slice(0, 5);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },
}));
