import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllAttendanceHistory,
  getUserdatafromserver,
} from "../../service";
import { RingLoader } from "react-spinners";
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  History,
  Users,
} from "lucide-react";

const getStoredAdmin = () => {
  const saved = localStorage.getItem("user");

  if (!saved) return null;

  try {
    const user = JSON.parse(saved);
    return user?.role === "admin" ? user : null;
  } catch {
    return null;
  }
};

const getErrorMessage = (err, fallback) => {
  if (typeof err === "string") return err;
  if (err?.message) return err.message;
  return fallback;
};

export default function AdminHistory() {
  // ============================================================
  // ADMIN
  // ============================================================

  const [adminUser] = useState(getStoredAdmin);

  // ============================================================
  // DATA
  // ============================================================

  const [history, setHistory] = useState([]);
  const [users, setUsers] = useState([]);

  const [summary, setSummary] = useState({
    totalRecords: 0,
    totalPresent: 0,
    totalAbsent: 0,
    totalLunch: 0,
    totalDinner: 0,
    totalExtraTiffin: 0,
  });

  // ============================================================
  // LOADING / ERROR
  // ============================================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================================
  // FILTERS
  // ============================================================

  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("all");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [mealFilter, setMealFilter] = useState("all");

  const [sortOrder, setSortOrder] = useState("newest");

  // ============================================================
  // PAGINATION
  // ============================================================

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  // ============================================================
  // LOAD USERS
  // ============================================================

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const uList = await getUserdatafromserver();

        setUsers(uList || []);
      } catch (err) {
        console.error("Failed to load user list:", err);
      }
    };

    fetchUsers();
  }, []);

  // ============================================================
  // FETCH ATTENDANCE HISTORY
  // ============================================================

  const fetchAdminHistory = async () => {
    if (!adminUser) {
      setError(
        "Admin login required to view attendance history."
      );

      setLoading(false);

      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = {
        search: search.trim() || undefined,

        userId:
          selectedUserId !== "all"
            ? selectedUserId
            : undefined,

        startDate: startDate || undefined,

        endDate: endDate || undefined,

        status: statusFilter,

        mealType: mealFilter,

        sort: sortOrder,
      };

      const res = await getAllAttendanceHistory(params);

      setHistory(res.data || []);

      if (res.summary) {
        setSummary(res.summary);
      }
    } catch (err) {
      console.error(
        "Failed to fetch admin history:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Failed to load attendance history."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FETCH WHEN FILTERS CHANGE
  // ============================================================

  useEffect(() => {
    setCurrentPage(1);

    fetchAdminHistory();
  }, [
    search,
    selectedUserId,
    startDate,
    endDate,
    statusFilter,
    mealFilter,
    sortOrder,
  ]);

  // ============================================================
  // RESET FILTERS
  // ============================================================

  const handleResetFilters = () => {
    setSearch("");

    setSelectedUserId("all");

    setStartDate("");

    setEndDate("");

    setStatusFilter("all");

    setMealFilter("all");

    setSortOrder("newest");

    setCurrentPage(1);
  };

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages =
    Math.ceil(history.length / itemsPerPage) || 1;

  const paginatedHistory = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ============================================================
  // DATE FORMAT
  // ============================================================

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ============================================================
  // TIME FORMAT
  // ============================================================

  const formatTime = (record) => {
    if (record.status === "absent") {
      return "-";
    }

    const timestamp =
      record.updatedAt ||
      record.createdAt ||
      record.date;

    if (!timestamp) return "-";

    return new Date(timestamp).toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  // ============================================================
  // MEAL BADGE
  // ============================================================

  const renderMealBadge = (record) => {
    if (record.status === "absent") {
      return (
        <span className="text-gray-400 font-medium">
          -
        </span>
      );
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

    return (
      <span className="text-gray-500 text-xs font-medium">
        None
      </span>
    );
  };

  // ============================================================
  // CHECK ACTIVE FILTERS
  // ============================================================

  const hasFilters =
    search ||
    selectedUserId !== "all" ||
    startDate ||
    endDate ||
    statusFilter !== "all" ||
    mealFilter !== "all" ||
    sortOrder !== "newest";

  // ============================================================
  // ADMIN ACCESS
  // ============================================================

  if (!adminUser) {
    return (
      <div className="space-y-4 text-center py-16 text-black dark:text-white">

        <History className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />

        <h2 className="text-xl font-bold">
          Admin Access Required
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please log in with an admin account to view all
          attendance history.
        </p>

        <Link
          to="/login"
          className="inline-block mt-2 bg-black hover:bg-gray-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 px-5 py-2 rounded-xl text-sm font-medium transition"
        >
          Go to Login
        </Link>

      </div>
    );
  }

  // ============================================================
  // MAIN COMPONENT
  // ============================================================

  return (
    <div className="space-y-6 text-black dark:text-white my-2">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>

          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">

            <History className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />

            All Attendance History

          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Complete attendance and tiffin records for all
            mess members
          </p>

        </div>

        <button
          onClick={fetchAdminHistory}
          className="self-start sm:self-auto flex items-center gap-2 bg-black hover:bg-gray-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />

          Refresh
        </button>

      </div>


      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">

        {/* TOTAL */}

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">

          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Total Records
          </p>

          <h3 className="text-2xl font-black text-black dark:text-white mt-1">
            {summary.totalRecords}
          </h3>

        </div>


        {/* PRESENT */}

        <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800/60 rounded-2xl p-4">

          <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider">
            Total Present
          </p>

          <h3 className="text-2xl font-black text-green-800 dark:text-green-200 mt-1">
            {summary.totalPresent}
          </h3>

        </div>


        {/* ABSENT */}

        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-2xl p-4">

          <p className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider">
            Total Absent
          </p>

          <h3 className="text-2xl font-black text-red-800 dark:text-red-200 mt-1">
            {summary.totalAbsent}
          </h3>

        </div>


        {/* LUNCH */}

        <div className="bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 rounded-2xl p-4">

          <p className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wider">
            Total Lunch
          </p>

          <h3 className="text-2xl font-black text-orange-800 dark:text-orange-200 mt-1">
            {summary.totalLunch}
          </h3>

        </div>


        {/* DINNER */}

        <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-2xl p-4">

          <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
            Total Dinner
          </p>

          <h3 className="text-2xl font-black text-purple-800 dark:text-purple-200 mt-1">
            {summary.totalDinner}
          </h3>

        </div>


        {/* EXTRA TIFFIN */}

        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-2xl p-4">

          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
            Extra Tiffins
          </p>

          <h3 className="text-2xl font-black text-blue-800 dark:text-blue-200 mt-1">
            {summary.totalExtraTiffin}
          </h3>

        </div>

      </div>


      {/* ======================================================
          FILTER PANEL
      ====================================================== */}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">

        {/* ====================================================
            SEARCH
        ==================================================== */}

        <div className="relative">

          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by user name, mobile, email, or user ID..."
            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
          />

        </div>


        {/* ====================================================
            FIRST ROW

            User | From Date | To Date | Meal Type
        ==================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          {/* USER */}

          <div>

            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              User
            </label>

            <select
              value={selectedUserId}
              onChange={(e) => {
                setSelectedUserId(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >

              <option value="all">
                All Users
              </option>

              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.mobile || u.email})
                </option>
              ))}

            </select>

          </div>


          {/* FROM DATE */}

          <div>

            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              From Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />

          </div>


          {/* TO DATE */}

          <div>

            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              To Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />

          </div>


          {/* MEAL TYPE */}

          <div>

            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Meal Type
            </label>

            <select
              value={mealFilter}
              onChange={(e) => {
                setMealFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >

              <option value="all">
                All Meals
              </option>

              <option value="lunch">
                Lunch
              </option>

              <option value="dinner">
                Dinner
              </option>

              <option value="both">
                Both Lunch & Dinner
              </option>

            </select>

          </div>

        </div>


        {/* ====================================================
            SECOND ROW

            Status | Sort By
        ==================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-end gap-4 pt-1">

          {/* STATUS */}

          <div className="w-full sm:w-auto">

            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Status
            </label>

            <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold w-full sm:w-fit">

              {/* ALL */}

              <button
                type="button"
                onClick={() => {
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition cursor-pointer ${statusFilter === "all"
                  ? "bg-white dark:bg-slate-700 text-black dark:text-white shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
              >
                All
              </button>


              {/* PRESENT */}

              <button
                type="button"
                onClick={() => {
                  setStatusFilter("present");
                  setCurrentPage(1);
                }}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition cursor-pointer ${statusFilter === "present"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
              >
                Present
              </button>


              {/* ABSENT */}

              <button
                type="button"
                onClick={() => {
                  setStatusFilter("absent");
                  setCurrentPage(1);
                }}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition cursor-pointer ${statusFilter === "absent"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
              >
                Absent
              </button>

            </div>

          </div>


          {/* SORT BY */}

          <div className="w-full sm:w-64">

            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Sort By
            </label>

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >

              <option value="newest">
                Newest Date First
              </option>

              <option value="oldest">
                Oldest Date First
              </option>

            </select>

          </div>

        </div>


        {/* ====================================================
            RESET
        ==================================================== */}

        {hasFilters && (
          <div className="flex justify-start pt-1">

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Reset All Filters
            </button>

          </div>
        )}

      </div>


      {/* ======================================================
          TABLE
      ====================================================== */}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">

        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading ? (

          <div className="flex justify-center items-center py-20">

            <RingLoader
              color="#6366f1"
              size={50}
            />

          </div>

        ) : error ? (

          /* ==================================================
             ERROR
          ================================================== */

          <div className="p-8 text-center text-red-500 dark:text-red-400 font-medium">
            {error}
          </div>

        ) : paginatedHistory.length === 0 ? (

          /* ==================================================
             EMPTY
          ================================================== */

          <div className="p-12 text-center text-gray-500 dark:text-gray-400">

            <Users className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />

            <h3 className="text-base font-bold text-gray-700 dark:text-gray-300 mb-1">
              No Attendance Records Found
            </h3>

            <p className="text-xs text-gray-400">
              Try refining your search terms or filter selections.
            </p>

          </div>

        ) : (

          <>
            {/* =================================================
                TABLE
            ================================================= */}

            <div className="overflow-x-auto">

              <table className="w-full text-left text-sm">

                <thead className="bg-slate-100 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-800 text-xs uppercase tracking-wider font-bold text-gray-600 dark:text-gray-300">

                  <tr>

                    <th className="p-4">
                      User
                    </th>

                    <th className="p-4">
                      Mobile / Email
                    </th>

                    <th className="p-4">
                      Date
                    </th>

                    <th className="p-4">
                      Meal Type
                    </th>

                    <th className="p-4">
                      Status
                    </th>

                    <th className="p-4">
                      Time
                    </th>

                    <th className="p-4">
                      Extra Tiffin
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">

                  {paginatedHistory.map((item) => {

                    const userName =
                      item.userName ||
                      item.userId?.Name ||
                      "User";

                    const userContact =
                      item.userId?.Mobile
                        ? String(item.userId.Mobile)
                        : item.userId?.Email || "-";

                    return (

                      <tr
                        key={item._id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                      >

                        {/* USER */}

                        <td className="p-4 font-semibold text-gray-900 dark:text-gray-100">
                          {userName}
                        </td>


                        {/* MOBILE / EMAIL */}

                        <td className="p-4 text-xs text-gray-600 dark:text-gray-400 font-medium">
                          {userContact}
                        </td>


                        {/* DATE */}

                        <td className="p-4 text-xs font-semibold text-gray-800 dark:text-gray-200">
                          {formatDate(item.date)}
                        </td>


                        {/* MEAL */}

                        <td className="p-4">
                          {renderMealBadge(item)}
                        </td>


                        {/* STATUS */}

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


                        {/* TIME */}

                        <td className="p-4 text-xs font-medium text-gray-600 dark:text-gray-400">
                          {formatTime(item)}
                        </td>


                        {/* EXTRA TIFFIN */}

                        <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">
                          {item.extraTiffin || 0}
                        </td>

                      </tr>

                    );
                  })}

                </tbody>

              </table>

            </div>




            <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">

              {/* RECORD COUNT */}

              <span className="text-gray-500 dark:text-gray-400">

                Showing{" "}

                <span className="font-semibold text-black dark:text-white">
                  {history.length === 0
                    ? 0
                    : (currentPage - 1) *
                    itemsPerPage +
                    1}
                </span>

                {" "}to{" "}

                <span className="font-semibold text-black dark:text-white">
                  {Math.min(
                    currentPage * itemsPerPage,
                    history.length
                  )}
                </span>

                {" "}of{" "}

                <span className="font-semibold text-black dark:text-white">
                  {history.length}
                </span>

                {" "}records

              </span>


              {/* PAGINATION BUTTONS */}

              <div className="flex items-center gap-2">

                {/* PREVIOUS */}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.max(p - 1, 1)
                    )
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
                >

                  <ChevronLeft className="w-4 h-4" />

                  Prev

                </button>


                {/* CURRENT PAGE */}

                <span className="font-medium text-gray-700 dark:text-gray-300 px-2">
                  Page {currentPage} of {totalPages}
                </span>


                {/* NEXT */}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(
                        p + 1,
                        totalPages
                      )
                    )
                  }
                  disabled={
                    currentPage === totalPages
                  }
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
                >

                  Next

                  <ChevronRight className="w-4 h-4" />

                </button>

              </div>

            </div>
          </>

        )}

      </div>

    </div>
  );
}