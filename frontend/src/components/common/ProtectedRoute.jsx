import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../../service";

export default function ProtectedRoute({ children, requiredRole = null }) {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  let user = null;

  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }

  // Check if token exists and is valid (not expired)
  if (!token || !user || isTokenExpired(token)) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // Check if specific role is required (for admin routes)
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

