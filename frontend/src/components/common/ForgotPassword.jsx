import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../service";
import { useTheme } from "../../context/ThemeContext";

export default function ForgotPassword() {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await forgotPassword(email);
      setMessage(
        res.message ||
          "If an account with this email exists, a password reset link has been sent."
      );
    } catch (err) {
      setError(
        err.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col justify-center px-6 py-12 relative transition-colors">
      {/* Top right theme toggle */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-100 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
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
        <div className="mx-auto w-14 h-14 rounded-xl bg-black dark:bg-slate-800 flex items-center justify-center text-white text-2xl font-bold select-none shadow-md">
          M
        </div>

        <h2 className="mt-8 text-center text-3xl font-bold tracking-tight text-black dark:text-white">
          Forgot Password?
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your registered email address and we'll send you a password reset link.
        </p>
      </div>

      {/* Card */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-800 shadow-xl">
          {message ? (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 rounded-xl p-4 text-sm font-medium text-center leading-relaxed">
                {message}
              </div>
              <Link
                to="/Login"
                className="flex w-full justify-center rounded-xl bg-black dark:bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 dark:hover:bg-slate-700 active:scale-95 transition-all"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-200 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setError("");
                    setEmail(e.target.value);
                  }}
                  placeholder="Enter your registered email"
                  className="block w-full rounded-xl bg-white dark:bg-slate-800 px-4 py-3 text-black dark:text-white border border-gray-300 dark:border-slate-700 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:outline-none transition text-sm"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-300 rounded-xl px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-xl bg-black dark:bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 dark:hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Sending Reset Link..." : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>

        {/* Back to Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Remember your password?{" "}
          <Link
            to="/Login"
            className="font-semibold text-black dark:text-white hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
