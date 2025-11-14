import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ServerLoader from "../components/ServerLoader";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signUp, authUser, isSigningUp } = useAuthStore();

  const [details, setDetails] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  const validation = () => {
    if (
      !details.name ||
      !details.email ||
      !details.phoneNumber ||
      !details.password
    ) {
      toast.error("All fields are required");
      return false;
    }
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const result = validation();
    result &&
      (await signUp(
        details.name,
        details.email,
        details.phoneNumber,
        details.password
      ));
  };

  return (
    <div className="flex justify-center items-center bg-gray-900 py-10 px-4 min-h-screen">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-xl space-y-6 mx-4">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex justify-center items-center text-white font-bold">
              <span className="text-2xl">III</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 text-sm">
            Get started with your free Account
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={submitHandler}>
          {/* Name */}
          <div>
            <label className="label text-sm font-medium text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              className="input w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Full Name"
              value={details.name}
              onChange={(e) => setDetails({ ...details, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <label className="label text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              className="input w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              value={details.email}
              onChange={(e) =>
                setDetails({ ...details, email: e.target.value })
              }
            />
          </div>

          {/* Phone */}
          <div>
            <label className="label text-sm font-medium text-gray-300">
              Phone Number
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength="10"
              className="input w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Phone Number"
              value={details.phoneNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setDetails({ ...details, phoneNumber: value });
                }
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label className="label text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                value={details.password}
                onChange={(e) =>
                  setDetails({ ...details, password: e.target.value })
                }
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

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {isSigningUp && <ServerLoader />}
    </div>
  );
};

export default SignUp;
