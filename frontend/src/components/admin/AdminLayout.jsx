import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div>
      {/* Sidebar / Navbar here */}
      <Outlet />
    </div>
  );
}