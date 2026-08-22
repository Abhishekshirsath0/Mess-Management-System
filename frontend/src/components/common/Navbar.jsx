import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { logoutUser } from "../../service";
import { LogOut, AlertCircle, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showLogoutModal) {
        setShowLogoutModal(false);
      }
    };
    if (showLogoutModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showLogoutModal]);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logoutUser();
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "A";
  const isAdmin = user?.role === "admin";
  const historyPath = isAdmin ? "/admin/history" : "/history";

  return (
    <header className="bg-white dark:bg-white border-b-2 border-black dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          MessMaster Pro
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6">
          {isAdmin && (
            <>
              <Link
                to="/admin"
                className="font-semibold h-10 py-2 mt-2 hover:bg-gray-900 bg-black text-white px-3 rounded-xl"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/history"
                className="font-semibold h-10 py-2 mt-2 hover:bg-gray-900 bg-black text-white px-3 rounded-xl"
              >
                Admin History
              </Link>
            </>
          )}

          <Link
            to="/"
            className="font-semibold h-10 py-2 mt-2 hover:bg-gray-900 bg-black text-white px-3 rounded-xl"
          >
            Home
          </Link>

          {!isAdmin && (
            <Link
              to={historyPath}
              className="font-semibold h-10 py-2 mt-2 hover:bg-gray-900 bg-black text-white px-3 rounded-xl"
            >
              History
            </Link>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-100 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            {theme === "dark" ? (
              <>
                <span className="text-yellow-400 text-lg">☀️</span>
                <span className="text-xs font-semibold hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <span className="text-indigo-500 text-lg">🌙</span>
                <span className="text-xs font-semibold hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          <button className="text-xl hidden md:block">🔔</button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex w-10 h-10 rounded-full bg-black text-white items-center justify-center font-semibold">
                {initial}
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="font-semibold h-10 py-2 text-sm hover:bg-red-700 bg-red-600 text-white px-3 rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="font-semibold h-10 py-2 hover:bg-gray-900 bg-black text-white px-3 rounded-xl flex items-center"
            >
              Login
            </Link>
          )}

          {/* Mobile Button */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-2xl">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 px-4 py-4 space-y-4">
          {isAdmin && (
            <>
              <Link
                to="/admin"
                className="block font-medium bg-black text-white px-3 py-2 w-40 rounded-xl"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/history"
                className="block font-medium bg-black text-white px-3 py-2 w-40 rounded-xl"
                onClick={() => setOpen(false)}
              >
                Admin History
              </Link>
            </>
          )}

          <Link
            to="/"
            className="block font-medium bg-black text-white px-3 py-2 w-40 rounded-xl"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          {!isAdmin && (
            <Link
              to={historyPath}
              className="block font-medium bg-black text-white px-3 py-2 w-40 rounded-xl"
              onClick={() => setOpen(false)}
            >
              History
            </Link>
          )}

          <button
            onClick={() => {
              toggleTheme();
              setOpen(false);
            }}
            className="flex items-center gap-2 font-medium bg-gray-200 dark:bg-slate-800 text-black dark:text-white px-3 py-2 w-40 rounded-xl"
          >
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          {user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowLogoutModal(true);
              }}
              className="block font-medium bg-red-600 hover:bg-red-700 text-white px-3 py-2 w-40 rounded-xl text-left cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block font-medium bg-black text-white px-3 py-2 w-40 rounded-xl"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-black dark:border-slate-800 max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
          >
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
                <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center shrink-0 text-rose-600 dark:text-rose-400">
                  <LogOut className="w-5 h-5" />
                </div>
                <h3 id="logout-modal-title" className="text-lg font-extrabold text-gray-900 dark:text-white">
                  Confirm Logout
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
              Are you sure you want to log out of <strong className="text-gray-900 dark:text-white">MessMaster Pro</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
