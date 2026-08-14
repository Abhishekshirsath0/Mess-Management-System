import { Link } from "react-router-dom";
import { Utensils, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t-2 border-black dark:border-slate-800 transition-colors mt-12 text-black dark:text-gray-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Utensils className="text-indigo-600 dark:text-indigo-400" size={22} />
              <span>MessMaster Pro</span>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Complete digital mess & tiffin management platform. Simplifying daily meal tracking, attendance, menus, and billing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-gray-900 dark:text-white mb-3">
              Company
            </h3>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Attendance History
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-gray-900 dark:text-white mb-3">
              Legal & Policies
            </h3>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link to="/privacy-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-gray-900 dark:text-white mb-3">
              Mess Contact
            </h3>
            <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <p>📍 Nashik Road, Nashik</p>
              <p>📞 +91 98765 43210</p>
              <p>✉️ support@messmasterpro.com</p>
              <p className="pt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                🟢 Mess Service Active
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} MessMaster Pro. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Mess Management
          </p>
        </div>
      </div>
    </footer>
  );
}
