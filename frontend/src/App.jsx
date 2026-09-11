import Navbar from "./components/common/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import UserDashboard from "./components/User/UserDashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";

export default function App() {
  const location = useLocation();

  const isUserHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-slate-950 text-black dark:text-gray-100 transition-colors">
      <div>
        <Navbar />

        <div className="max-w-7xl mx-auto px-2 md:px-4 py-4">
          {isUserHome && (
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}