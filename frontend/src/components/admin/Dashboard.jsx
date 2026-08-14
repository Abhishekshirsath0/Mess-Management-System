// src/components/Dashboard.jsx

import CardsSection from "./Card";
import AttendanceTable from "./AttendanceTracking";
import PerformanceSection from "./PerformanceSection";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Welcome back, Admin 👋
          </p>
        </div>


      </div>

      {/* Cards */}
      <CardsSection />

      {/* Attendance */}
      <AttendanceTable />

      {/* Performance */}
      <PerformanceSection />

    </div>
  );
}