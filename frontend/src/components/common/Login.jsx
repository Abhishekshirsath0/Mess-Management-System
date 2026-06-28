import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Demo Login Credentials
    if (
      formData.email === "admin@gmail.com" &&
      formData.password === "123456"
    ) {
      navigate("/admin");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center px-6 py-12">
      {/* Logo + Heading */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mx-auto w-14 h-14 rounded-xl bg-black flex items-center justify-center text-white text-2xl font-bold select-none">
          M
        </div>

        <h2 className="mt-8 text-center text-3xl font-bold tracking-tight text-black">
          Sign in to your account
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600">
          MessMaster Pro — Mess Management System
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Email Address
              </label>

              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="block w-full rounded-xl bg-white px-4 py-3 text-black border border-gray-300 placeholder:text-gray-500 focus:border-black focus:ring-2 focus:ring-black/20 focus:outline-none transition text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-black">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-black hover:text-gray-700"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="block w-full rounded-xl bg-white px-4 py-3 pr-12 text-black border border-gray-300 placeholder:text-gray-500 focus:border-black focus:ring-2 focus:ring-black/20 focus:outline-none transition text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition"
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-600 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="flex w-full justify-center rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 active:scale-95 transition-all"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Not a member?{" "}
          <Link
            to="/register"
            className="font-semibold text-black hover:text-gray-700"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}