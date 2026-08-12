import Navbar from "./components/common/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import UserDashboard from "./components/User/UserDashboard";

export default function App() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isHistoryRoute = location.pathname === "/history";
  const showUserDashboard = !isAdminRoute && !isHistoryRoute;

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto px-2 md:px-4 py-4">
        {showUserDashboard && <UserDashboard />}
        <Outlet />
      </div>
    </div>
  );
}