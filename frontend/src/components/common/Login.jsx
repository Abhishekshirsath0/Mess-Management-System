import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../../service";
import { useTheme } from "../../context/ThemeContext";

export default function Login() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { user } = await loginUser(formData);
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white flex flex-col justify-center px-6 py-12 relative transition-colors">
      {/* Top right theme toggle */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          {theme === "dark" ? (
            <>
              <span className="text-yellow-400 text-lg">☀️</span>
              <span className="text-xs font-semibold">Light Mode</span>
            </>
          ) : (
            <>
              <span className="text-indigo-500 text-lg">🌙</span>
              <span className="text-xs font-semibold">Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Logo + Heading */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mx-auto w-14 h-14 rounded-xl bg-black dark:bg-slate-800 flex items-center justify-center text-white text-2xl font-bold select-none border border-gray-800 dark:border-slate-700 shadow-sm">
          M
        </div>

        <h2 className="mt-8 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Sign in to your account
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          MessMaster Pro — Mess Management System
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-800 shadow-xl transition-colors">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                Email Address
              </label>

              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="block w-full rounded-xl bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 placeholder:text-gray-400 focus:border-black dark:focus:border-indigo-500 focus:ring-2 focus:ring-black/20 dark:focus:ring-indigo-500/20 focus:outline-none transition text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-gray-900 dark:text-gray-300 hover:underline"
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
                  className="block w-full rounded-xl bg-white dark:bg-slate-800 px-4 py-3 pr-12 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 placeholder:text-gray-400 focus:border-black dark:focus:border-indigo-500 focus:ring-2 focus:ring-black/20 dark:focus:ring-indigo-500/20 focus:outline-none transition text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition cursor-pointer"
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-900 text-red-600 dark:text-red-300 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-xl bg-black dark:bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 dark:hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-50 cursor-pointer shadow-md"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Not a member?{" "}
          <Link
            to="/register"
            className="font-semibold text-gray-900 dark:text-white hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}