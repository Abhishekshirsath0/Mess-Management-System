import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between">
        
        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-bold">
          MessMaster Pro
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6">
          
          <Link
            to="/admin"
            className="font-semibold border-b-2 border-black py-5"
          >
            Admin Dashboard
          </Link>

          <Link
            to="/user"
            className="font-semibold border-b-2 border-black py-5"
          >
            User Dashboard
          </Link>

          <Link
            to="/reports"
            className="text-gray-500 hover:text-black py-5"
          >
            Reports
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button className="text-xl hidden md:block">
            🔔
          </button>

          <div className="hidden md:flex w-10 h-10 rounded-full bg-black text-white items-center justify-center font-semibold">
            A
          </div>

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
            className="block font-medium"
            onClick={() => setOpen(false)}
          >
            Admin Dashboard
          </Link>

          <Link
            to="/user"
            className="block font-medium"
            onClick={() => setOpen(false)}
          >
            User Dashboard
          </Link>

          <Link
            to="/reports"
            className="block font-medium"
            onClick={() => setOpen(false)}
          >
            Reports
          </Link>

        </div>
      )}
    </header>
  );
}