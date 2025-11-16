import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import DetailsPage from "./pages/DetailsPage";
import NavBar from "./components/NavBar";
import { useMovieStore } from "./store/movieStore";

const App = () => {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();
  const { movies } = useMovieStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Check token when app loads
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isCheckingAuth) return;

    if (authUser) {
      if (location.pathname === "/login" || location.pathname === "/signup") {
        navigate("/");
      }
    } else {
      if (location.pathname !== "/login" && location.pathname !== "/signup") {
        navigate("/login");
      }
    }
  }, [authUser, isCheckingAuth, navigate, location.pathname]);

  // showing loader while checking auth
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900  py-4 text-white  font-cabin ">
      {location.pathname !== "/signup" && location.pathname !== "/login" && (
        <NavBar movies={movies} />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/details/:id" element={<DetailsPage />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
