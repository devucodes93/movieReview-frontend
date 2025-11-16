import React, { useEffect, useState } from "react";
import { Clapperboard, Eye, EyeOff, MoveIcon, VideoIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import ServerLoader from "../components/ServerLoader";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login, authUser, isLoggingIn } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (authUser) navigate("/");
  }, [authUser, navigate]);

  const verifyData = () => {
    if (!email || !password) {
      toast.error("Please fill all fields");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (verifyData()) login(email, password);
  };

  return (
    <div className="flex justify-center items-center bg-gray-900 min-h-screen px-4">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-xl space-y-4">
        {/* Logo */}
        <div className="text-center mb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex justify-center items-center text-white font-bold">
              {/*add a movie icon here*/}
              <span className="text-2xl">{<Clapperboard />}</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Log in to continue</p>
        </div>

        {/* Form */}
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500">
            Log In
          </button>
        </form>

        <div className="text-center mt-2">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {isLoggingIn && <ServerLoader />}
    </div>
  );
};

export default Login;
