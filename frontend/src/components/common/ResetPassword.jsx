import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../service";
import { useTheme } from "../../context/ThemeContext";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid password reset link.");
      return;
    }

    if (!password) {
      setError("New password is required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify your entries.");
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword(token, password, confirmPassword);
      setSuccess(
        res.message || "Password has been reset successfully. You can now log in."
      );
      setTimeout(() => {
        navigate("/Login");
      }, 3000);
    } catch (err) {
      setError(
        err.message ||
          "This password reset link has expired or is invalid. Please request a new password reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  const isExpiredOrInvalid =
    error &&
    (error.toLowerCase().includes("expired") || error.toLowerCase().includes("invalid"));

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
          Reset Password
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter and confirm your new account password below.
        </p>
      </div>

      {/* Card */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-800 shadow-xl">
          {success ? (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 rounded-xl p-4 text-sm font-medium text-center leading-relaxed">
                {success}
              </div>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Redirecting to Login page in a few seconds...
              </p>
              <Link
                to="/Login"
                className="flex w-full justify-center rounded-xl bg-black dark:bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 dark:hover:bg-slate-700 active:scale-95 transition-all"
              >
                Go to Login Now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-200 mb-2">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => {
                      setError("");
                      setPassword(e.target.value);
                    }}
                    placeholder="Enter new password"
                    className="block w-full rounded-xl bg-white dark:bg-slate-800 px-4 py-3 pr-12 text-black dark:text-white border border-gray-300 dark:border-slate-700 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:outline-none transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:hover:text-white transition"
                  >
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-200 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPw ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => {
                      setError("");
                      setConfirmPassword(e.target.value);
                    }}
                    placeholder="Confirm new password"
                    className="block w-full rounded-xl bg-white dark:bg-slate-800 px-4 py-3 pr-12 text-black dark:text-white border border-gray-300 dark:border-slate-700 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:outline-none transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:hover:text-white transition"
                  >
                    {showConfirmPw ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-300 rounded-xl px-4 py-3 text-sm leading-relaxed">
                  {error}
                </div>
              )}

              {/* Action Button */}
              {isExpiredOrInvalid ? (
                <Link
                  to="/forgot-password"
                  className="flex w-full justify-center rounded-xl bg-black dark:bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 dark:hover:bg-slate-700 active:scale-95 transition-all text-center"
                >
                  Request New Reset Link
                </Link>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-xl bg-black dark:bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 dark:hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </button>
              )}
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
