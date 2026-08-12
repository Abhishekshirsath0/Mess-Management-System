import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "A";
  const isAdmin = user?.role === "admin";
  const historyPath = isAdmin ? "/admin/history" : "/history";

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-xl md:text-2xl font-bold text-black">
          MessMaster Pro
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6">
          <Link
            to="/admin"
            className="font-semibold h-10 py-2 mt-2 hover:bg-gray-900 bg-black text-white px-3 rounded-xl"
          >
            Admin Dashboard
          </Link>

          <Link
            to="/"
            className="font-semibold h-10 py-2 mt-2 hover:bg-gray-900 bg-black text-white px-3 rounded-xl"
          >
            User Dashboard
          </Link>

          <Link
            to={historyPath}
            className="font-semibold h-10 py-2 mt-2 hover:bg-gray-900 bg-black text-white px-3 rounded-xl"
          >
            History
          </Link>
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

          <button className="text-xl hidden md:block">
            🔔
          </button>
          
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex w-10 h-10 rounded-full bg-black text-white items-center justify-center font-semibold">
                {initial}
              </div>
              <button
                onClick={handleLogout}
                className="font-semibold h-10 py-2 text-sm hover:bg-red-700 bg-red-600 text-white px-3 rounded-xl transition"
              >
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
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-4">
          <Link
            to="/admin"
            className="block font-medium bg-black text-white px-3 py-2 w-40 rounded-xl"
            onClick={() => setOpen(false)}
          >
            Admin Dashboard
          </Link>

          <Link
            to="/"
            className="block font-medium bg-black text-white px-3 py-2 w-40 rounded-xl"
            onClick={() => setOpen(false)}
          >
            User Dashboard
          </Link>

          <Link
            to={historyPath}
            className="block font-medium bg-black text-white px-3 py-2 w-40 rounded-xl"
            onClick={() => setOpen(false)}
          >
            History
          </Link>

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
                handleLogout();
              }}
              className="block font-medium bg-red-600 text-white px-3 py-2 w-40 rounded-xl text-left"
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
    </header>
  );
}