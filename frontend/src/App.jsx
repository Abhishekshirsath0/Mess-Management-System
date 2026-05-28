import Navbar from "./components/common/Navbar";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto px-2 md:px-4 py-4">
        <Outlet />
      </div>
    </div>
  );
}