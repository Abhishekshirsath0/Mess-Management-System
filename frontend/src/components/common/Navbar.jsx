import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
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
              className="font-semibold h-10 py-2 mt-2 hover:bg-gray-900 bg-black text-white px-3 rounded-xl"
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