import { useState, useEffect } from "react";
import { getUserAttendanceHistory } from "../../service";
import { RingLoader } from "react-spinners";
import { CalendarDays, Filter, RefreshCw, ChevronLeft, ChevronRight, History } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function UserHistory() {
  const [currentUser] = useState(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({
    totalRecords: 0,
    totalPresent: 0,
    totalAbsent: 0,
    totalLunch: 0,
    totalDinner: 0,
    totalExtraTiffin: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const surfaceClass = isDark
    ? "bg-slate-900 border-slate-800 text-slate-100"
    : "bg-white border-gray-200 text-gray-900";
  const mutedTextClass = isDark ? "text-slate-400" : "text-gray-500";
  const inputClass = isDark
    ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-slate-400"
    : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500";
  const tableHeaderClass = isDark
    ? "bg-slate-800/80 border-slate-800 text-slate-300"
    : "bg-slate-100 border-gray-200 text-gray-600";
  const tableRowClass = isDark ? "hover:bg-slate-800/50" : "hover:bg-gray-50";

  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mealFilter, setMealFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUserHistory = async () => {
    if (!currentUser || !currentUser.id) {
      setError("Please log in to view your attendance history.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const params = {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        status: statusFilter,
        mealType: mealFilter,
        sort: sortOrder,
      };

      const res = await getUserAttendanceHistory(currentUser.id, params);
      setHistory(res.data || []);
      if (res.summary) {
        setSummary(res.summary);
      }
    } catch (err) {
      console.error("Failed to fetch user history:", err);
      setError(err.message || "Failed to load attendance history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserHistory();
  }, [currentUser, startDate, endDate, statusFilter, mealFilter, sortOrder]);

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setStatusFilter("all");
    setMealFilter("all");
    setSortOrder("newest");
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(history.length / itemsPerPage) || 1;
  const paginatedHistory = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (record) => {
    if (record.status === "absent") return "-";
    const timestamp = record.updatedAt || record.createdAt || record.date;
    if (!timestamp) return "-";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderMealBadge = (record) => {
    if (record.status === "absent") {
      return <span className="text-gray-400 font-medium">-</span>;
    }
    if (record.lunch && record.dinner) {
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          Lunch & Dinner
        </span>
      );
    }
    if (record.lunch) {
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
          Lunch
        </span>
      );
    }
    if (record.dinner) {
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
          Dinner
        </span>
      );
    }
    return <span className="text-gray-500 text-xs font-medium">None</span>;
  };

  if (!currentUser) {
    return (
      <div className={`${surfaceClass} rounded-2xl border p-8 text-center my-6 shadow-sm`}>
        <h2 className={`text-xl font-bold mb-2 ${isDark ? "text-slate-100" : "text-gray-800"}`}>Login Required</h2>
        <p className={mutedTextClass}>Please log in to view your attendance history.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 my-2 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <History className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Attendance History
          </h1>
          <p className={`text-sm mt-1 ${mutedTextClass}`}>
            attendance and meal records for <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>{currentUser.name}</span>
          </p>
        </div>

        <button
          onClick={fetchUserHistory}
          className="self-start sm:self-auto flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-green-950/40 border-2 border-black dark:border-green-800/60 rounded-2xl p-4">
          <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">Present</p>
          <h3 className="text-2xl font-black text-black dark:text-green-200 mt-1">{summary.totalPresent}</h3>
        </div>

        <div className="bg-white dark:bg-red-950/40 border-2 border-black dark:border-red-800/60 rounded-2xl p-4">
          <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">Absent</p>
          <h3 className="text-2xl font-black text-black dark:text-red-200 mt-1">{summary.totalAbsent}</h3>
        </div>

        <div className="bg-white dark:bg-orange-950/40 border-2 border-black dark:border-orange-800/60 rounded-2xl p-4">
          <p className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider">Lunch</p>
          <h3 className="text-2xl font-black text-black dark:text-orange-200 mt-1">{summary.totalLunch}</h3>
        </div>

        <div className="bg-white dark:bg-purple-950/40 border-2 border-black dark:border-purple-800/60 rounded-2xl p-4">
          <p className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">Dinner</p>
          <h3 className="text-2xl font-black text-black dark:text-purple-200 mt-1">{summary.totalDinner}</h3>
        </div>

        <div className="bg-white dark:bg-blue-950/40 border-2 border-black dark:border-blue-800/60 rounded-2xl p-4 col-span-2 sm:col-span-1">
          <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Extra Tiffin</p>
          <h3 className="text-2xl font-black text-black dark:text-blue-200 mt-1">{summary.totalExtraTiffin}</h3>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className={`${surfaceClass} rounded-2xl border p-4 sm:p-5 shadow-sm`}>
        <div className={`flex items-center gap-2 mb-3 text-sm font-semibold ${isDark ? "text-slate-300" : "text-gray-700"}`}>
          <Filter className="w-4 h-4 text-indigo-500" />
          Filter & Sort History
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Start Date */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          {/* Meal Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Meal Type</label>
            <select
              value={mealFilter}
              onChange={(e) => {
                setMealFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >
              <option value="all">All Meals</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="both">Both Lunch & Dinner</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Sort By</label>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {(startDate || endDate || statusFilter !== "all" || mealFilter !== "all" || sortOrder !== "newest") && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* TABLE SECTION */}
      <div className={`${surfaceClass} rounded-2xl border shadow-sm overflow-hidden flex flex-col`}>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <RingLoader color={"#6366f1"} size={50} />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 dark:text-red-400 font-medium">
            {error}
          </div>
        ) : paginatedHistory.length === 0 ? (
          <div className={`p-12 text-center ${mutedTextClass}`}>
            <CalendarDays className={`w-12 h-12 mx-auto mb-3 ${isDark ? "text-slate-600" : "text-gray-300"}`} />
            <h3 className={`text-base font-bold mb-1 ${isDark ? "text-slate-300" : "text-gray-700"}`}>No Attendance Records Found</h3>
            <p className={`text-xs ${isDark ? "text-slate-500" : "text-gray-400"}`}>Try adjusting your dates or filter settings.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className={`${tableHeaderClass} border-b text-xs uppercase tracking-wider font-bold`}>
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">User Name</th>
                    <th className="p-4">Meal Type</th>
                    <th className="p-4">Attendance Status</th>
                    <th className="p-4">Time</th>
                    <th className="p-4">Extra Tiffin</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-100"}`}>
                  {paginatedHistory.map((item) => (
                    <tr key={item._id} className={`${tableRowClass} transition`}>
                      <td className="p-4 font-semibold text-gray-900 dark:text-gray-100">
                        {formatDate(item.date)}
                      </td>
                      <td className="p-4 font-medium text-gray-800 dark:text-gray-200">
                        {item.userName || currentUser.name}
                      </td>
                      <td className="p-4">
                        {renderMealBadge(item)}
                      </td>
                      <td className="p-4">
                        {item.status === "present" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                            Present
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                            Absent
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-xs font-medium text-gray-600 dark:text-gray-400">
                        {formatTime(item)}
                      </td>
                      <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">
                        {item.extraTiffin || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION FOOTER */}
            <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${isDark ? "border-slate-800 bg-slate-800/40" : "border-gray-200 bg-slate-50"}`}>
              <span className={mutedTextClass}>
                Showing <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>
                  {Math.min(currentPage * itemsPerPage, history.length)}
                </span>{" "}
                of <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>{history.length}</span> records
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>

                <span className="font-medium text-gray-700 dark:text-gray-300 px-2">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
