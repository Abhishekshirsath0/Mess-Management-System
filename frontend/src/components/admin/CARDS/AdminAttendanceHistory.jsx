import { useState, useEffect } from "react";
import {
  getAllAttendanceHistory,
  getUserdatafromserver,
  updateAttendance,
  updateUser,
} from "../../../service";
import { PropagateLoader } from "react-spinners";
import {
  Search,
  Calendar,
  Filter,
  ArrowUpDown,
  UserCheck,
  UserX,
  Utensils,
  Package,
  History,
  RotateCcw,
  Clock,
  User,
  Phone,
  Mail,
  Edit3,
  CheckCircle,
  XCircle,
  Save,
  X,
  CreditCard,
} from "lucide-react";

const getTodayStr = () => new Date().toISOString().split("T")[0];

export default function AdminAttendanceHistory() {
  const [records, setRecords] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [inputSearch, setInputSearch] = useState(""); // Input value
  const [activeSearch, setActiveSearch] = useState(""); // Applied query when clicking Search
  const [selectedUserId, setSelectedUserId] = useState("ALL");
  const [filterDate, setFilterDate] = useState("");
  const [filterMeal, setFilterMeal] = useState("ALL"); // ALL, lunch, dinner, extra
  const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, present, absent
  const [sortOrder, setSortOrder] = useState("newest"); // newest, oldest

  // Edit History Modal State
  const [editRecord, setEditRecord] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const loadHistoryData = async () => {
    setLoading(true);
    try {
      const [historyResponse, users] = await Promise.all([
        getAllAttendanceHistory(),
        getUserdatafromserver().catch(() => []),
      ]);
      const list = Array.isArray(historyResponse)
        ? historyResponse
        : historyResponse?.data || [];
      setRecords(list);
      setUsersList(users || []);
    } catch (err) {
      console.error("Failed to load attendance history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistoryData();
  }, []);

  const handleSearchClick = (e) => {
    e?.preventDefault();
    setActiveSearch(inputSearch.trim().toLowerCase());
  };

  const handleKeyDownSearch = (e) => {
    if (e.key === "Enter") {
      handleSearchClick(e);
    }
  };

  // Filter & Search Logic strictly on database records
  const filteredRecords = records.filter((r) => {
    const userObj = r.userId && typeof r.userId === "object" ? r.userId : null;
    const name = (userObj?.Name || r.userName || "").toLowerCase();
    const email = (userObj?.Email || "").toLowerCase();
    const mobile = String(userObj?.Mobile || r.mobile || "");
    const rawUserId = String(userObj?._id || r.userId || "").toLowerCase();

    // 1. Search Query (Name, Email, Mobile, User ID)
    const q = activeSearch;
    const matchesSearch =
      !q ||
      name.includes(q) ||
      email.includes(q) ||
      mobile.includes(q) ||
      rawUserId.includes(q);

    // 2. User Specific Filter
    const matchesUser =
      selectedUserId === "ALL" ||
      String(userObj?._id || r.userId) === String(selectedUserId);

    // 3. Date Filter
    const recordDateStr = r.date
      ? new Date(r.date).toISOString().split("T")[0]
      : "";
    const matchesDate = !filterDate || recordDateStr === filterDate;

    // 4. Status Filter
    const matchesStatus = filterStatus === "ALL" || r.status === filterStatus;

    // 5. Meal Filter
    let matchesMeal = true;
    if (filterMeal === "lunch") matchesMeal = !!r.lunch;
    if (filterMeal === "dinner") matchesMeal = !!r.dinner;
    if (filterMeal === "extra") matchesMeal = (r.extraTiffin || 0) > 0;

    return (
      matchesSearch &&
      matchesUser &&
      matchesDate &&
      matchesStatus &&
      matchesMeal
    );
  });

  // Sort Logic
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt).getTime();
    const dateB = new Date(b.date || b.createdAt).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Metrics Calculation directly from database records
  const totalPresent = filteredRecords.filter(
    (r) => r.status === "present",
  ).length;
  const totalAbsent = filteredRecords.filter(
    (r) => r.status === "absent",
  ).length;
  const totalLunch = filteredRecords.filter((r) => r.lunch).length;
  const totalDinner = filteredRecords.filter((r) => r.dinner).length;
  const totalExtraTiffins = filteredRecords.reduce(
    (sum, r) => sum + (r.extraTiffin || 0),
    0,
  );

  const extraTiffinRecords = filteredRecords.filter(
    (r) => (r.extraTiffin || 0) > 0,
  );

  const clearFilters = () => {
    setInputSearch("");
    setActiveSearch("");
    setSelectedUserId("ALL");
    setFilterDate("");
    setFilterMeal("ALL");
    setFilterStatus("ALL");
    setSortOrder("newest");
  };

  // Open Edit Modal
  const handleEditClick = (record) => {
    const userObj =
      record.userId && typeof record.userId === "object" ? record.userId : null;
    const uId = userObj?._id || record.userId;
    const uName = userObj?.Name || record.userName || "User";
    const recordDateStr = record.date
      ? new Date(record.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    setEditRecord({
      _id: record._id,
      userId: uId,
      userName: uName,
      date: recordDateStr,
      status: record.status || "present",
      lunch: !!record.lunch,
      dinner: !!record.dinner,
      extraTiffin: record.extraTiffin || 0,
      userObj,
    });
  };

  // Save Edit History to backend DB
  const handleSaveHistoryEdit = async () => {
    if (!editRecord) return;
    setIsSavingEdit(true);
    try {
      const payload = [
        {
          userId: editRecord.userId,
          userName: editRecord.userName,
          date: editRecord.date,
          status: editRecord.status,
          lunch: editRecord.lunch,
          dinner: editRecord.dinner,
          extraTiffin: editRecord.extraTiffin,
        },
      ];

      await updateAttendance(payload);
      alert(
        `Attendance history for ${editRecord.userName} updated successfully!`,
      );
      setEditRecord(null);
      await loadHistoryData();
    } catch (err) {
      console.error(err);
      alert("Failed to update history record.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Mark User as Full Paid directly from history
  const handleMarkUserPaidFromHistory = async (userId, userName) => {
    try {
      await updateUser(userId, {
        PaymentStatus: "Paid",
        PaymentDate: new Date(),
      });
      alert(`Updated payment status to Full Paid for ${userName}`);
      await loadHistoryData();
    } catch (err) {
      alert(`Failed to update payment status for ${userName}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white flex items-center gap-3">
            <History className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Attendance History Sheet
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Complete database attendance records for Present and Absent members.
          </p>
        </div>

        <button
          onClick={loadHistoryData}
          className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-indigo-700 transition">
          <RotateCcw className="w-4 h-4" /> Refresh Logs
        </button>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Present */}
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Present Members
            </span>
            <UserCheck className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100">
            {totalPresent}
          </p>
        </div>

        {/* Absent */}
        <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Absent Members
            </span>
            <UserX className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-rose-900 dark:text-rose-100">
            {totalAbsent}
          </p>
        </div>

        {/* Lunch */}
        <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Lunch Records
            </span>
            <Utensils className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-amber-900 dark:text-amber-100">
            {totalLunch}
          </p>
        </div>

        {/* Dinner */}
        <div className="bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-purple-700 dark:text-purple-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Dinner Records
            </span>
            <Utensils className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-purple-900 dark:text-purple-100">
            {totalDinner}
          </p>
        </div>

        {/* Extra Tiffin */}
        <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 p-4 rounded-2xl col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-blue-700 dark:text-blue-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Extra Tiffins
            </span>
            <Package className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-blue-900 dark:text-blue-100">
            {totalExtraTiffins}
          </p>
        </div>
      </div>

      {/* FILTERS & SEARCH TOOLBAR WITH EXPLICIT SEARCH BUTTON */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input with SEARCH BUTTON */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                onKeyDown={handleKeyDownSearch}
                placeholder="Search name, phone, email, ID..."
                className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-indigo-500 text-black dark:text-white"
              />
            </div>
            <button
              onClick={handleSearchClick}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-xs"
              title="Click to Search">
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
          </div>

          {/* User Select Filter */}
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-indigo-500 text-black dark:text-white appearance-none cursor-pointer">
              <option value="ALL">All Users Complete History</option>
              {usersList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.mobile})
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-indigo-500 text-black dark:text-white"
            />
          </div>

          {/* Meal Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <select
              value={filterMeal}
              onChange={(e) => setFilterMeal(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-indigo-500 text-black dark:text-white appearance-none cursor-pointer">
              <option value="ALL">All Meal Types</option>
              <option value="lunch">Lunch Only</option>
              <option value="dinner">Dinner Only</option>
              <option value="extra">With Extra Tiffin</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setFilterStatus("ALL")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterStatus === "ALL"
                    ? "bg-white dark:bg-slate-700 text-black dark:text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400"
                }`}>
                All Status
              </button>
              <button
                onClick={() => setFilterStatus("present")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterStatus === "present"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400"
                }`}>
                Present ({totalPresent})
              </button>
              <button
                onClick={() => setFilterStatus("absent")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterStatus === "absent"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400"
                }`}>
                Absent ({totalAbsent})
              </button>
            </div>

            {/* Sort Order */}
            <button
              onClick={() =>
                setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
              }
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 transition">
              <ArrowUpDown className="w-3.5 h-3.5" />
              {sortOrder === "newest" ? "Newest First" : "Oldest First"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">
              Database Records: {sortedRecords.length}
            </span>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* EXTRA TIFFIN DATES SUMMARY */}
      {extraTiffinRecords.length > 0 && (
        <div className="bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 p-4 rounded-2xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
            <Package className="w-4 h-4" /> Extra Tiffin Log Summary (
            {extraTiffinRecords.length} entries)
          </h3>
          <div className="flex flex-wrap gap-2">
            {extraTiffinRecords.map((r, idx) => {
              const uObj =
                r.userId && typeof r.userId === "object" ? r.userId : null;
              const uName = uObj?.Name || r.userName || "User";
              const dateStr = r.date
                ? new Date(r.date).toLocaleDateString("en-IN")
                : "";
              return (
                <span
                  key={idx}
                  className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-900 dark:text-blue-200 shadow-2xs">
                  {uName}: {r.extraTiffin} extra on {dateStr}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* HISTORY TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            <thead className="bg-gray-100 dark:bg-slate-800/80 sticky top-0 z-10 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="p-4">User Details</th>
                <th className="p-4">Date</th>
                <th className="p-4">Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Meals Served</th>
                <th className="p-4">Extra Tiffins</th>
                <th className="p-4">Payment & Date</th>
                <th className="p-4 text-center">Admin Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm text-black dark:text-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <PropagateLoader color="#6366f1" />
                      <span className="text-xs text-gray-500 mt-4">
                        Fetching database attendance history...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : sortedRecords.length > 0 ? (
                sortedRecords.map((r, index) => {
                  const userObj =
                    r.userId && typeof r.userId === "object" ? r.userId : null;
                  const uId = userObj?._id || r.userId;
                  const name = userObj?.Name || r.userName || "Unknown User";
                  const email = userObj?.Email || "N/A";
                  const mobile = userObj?.Mobile || r.mobile || "N/A";
                  const plan = userObj?.Plan || "STANDARD";
                  const paymentStatus = userObj?.PaymentStatus || "Paid";
                  const paymentDate = userObj?.PaymentDate;

                  const dateFormatted = r.date
                    ? new Date(r.date).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A";

                  const timeFormatted = r.createdAt
                    ? new Date(r.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : r.updatedAt
                      ? new Date(r.updatedAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Recorded";

                  const paymentDateFormatted = paymentDate
                    ? new Date(paymentDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : null;

                  return (
                    <tr
                      key={r._id || index}
                      className="hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      {/* USER DETAILS */}
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-black dark:text-white flex items-center gap-1.5">
                            <User className="w-4 h-4 text-indigo-500" />
                            {name}
                          </p>
                          <div className="flex flex-col text-xs text-gray-500 dark:text-gray-400 mt-0.5 space-y-0.5">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {mobile}
                            </span>
                            {email !== "N/A" && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {email}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* DATE */}
                      <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">
                        {dateFormatted}
                      </td>

                      {/* TIME */}
                      <td className="p-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {timeFormatted}
                        </span>
                      </td>

                      {/* STATUS FROM DB */}
                      <td className="p-4">
                        {r.status === "present" ? (
                          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold rounded-full text-xs border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1">
                            <UserCheck className="w-3 h-3" /> Present
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold rounded-full text-xs border border-rose-200 dark:border-rose-800 inline-flex items-center gap-1">
                            <UserX className="w-3 h-3" /> Absent
                          </span>
                        )}
                      </td>

                      {/* MEALS */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5">
                          {r.lunch && (
                            <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-lg border border-amber-200 dark:border-amber-800">
                              🍛 Lunch
                            </span>
                          )}
                          {r.dinner && (
                            <span className="px-2.5 py-0.5 bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold text-xs rounded-lg border border-purple-200 dark:border-purple-800">
                              🌙 Dinner
                            </span>
                          )}
                          {!r.lunch && !r.dinner && (
                            <span className="text-xs text-gray-400 italic">
                              No meal marked
                            </span>
                          )}
                        </div>
                      </td>

                      {/* EXTRA TIFFIN */}
                      <td className="p-4">
                        {r.extraTiffin > 0 ? (
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold text-xs rounded-full border border-blue-200 dark:border-blue-800 inline-flex items-center gap-1">
                            <Package className="w-3 h-3" /> +{r.extraTiffin}{" "}
                            Extra
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">0</span>
                        )}
                      </td>

                      {/* PAYMENT & PAID DATE */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {plan} Plan
                          </span>

                          <div className="flex flex-col gap-0.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold w-fit ${
                                paymentStatus === "Paid"
                                  ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border border-green-200 dark:border-green-800"
                                  : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800"
                              }`}>
                              {paymentStatus === "Paid"
                                ? "Full Paid"
                                : "Pending"}
                            </span>

                            {paymentStatus === "Paid" && (
                              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                                Paid Date:{" "}
                                {paymentDateFormatted || dateFormatted}
                              </span>
                            )}
                          </div>

                          {paymentStatus !== "Paid" && uId && (
                            <button
                              onClick={() =>
                                handleMarkUserPaidFromHistory(uId, name)
                              }
                              className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-1 w-fit flex items-center gap-1">
                              <CreditCard className="w-3 h-3" /> Mark Full Paid
                            </button>
                          )}
                        </div>
                      </td>

                      {/* ADMIN MODIFY ACTION */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleEditClick(r)}
                          className="px-3 py-1.5 bg-black dark:bg-indigo-600 hover:bg-gray-800 dark:hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 mx-auto transition shadow-xs">
                          <Edit3 className="w-3.5 h-3.5" /> Modify
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="p-10 text-center text-gray-500 dark:text-gray-400">
                    No attendance records found in database for your active
                    filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT HISTORY MODAL */}
      {editRecord && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-gray-200 dark:border-slate-800 space-y-5 text-black dark:text-white">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Modify Attendance History
              </h2>
              <button
                onClick={() => setEditRecord(null)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Member & Date */}
              <div className="bg-gray-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-gray-100 dark:border-slate-700/60 text-sm">
                <p className="font-bold text-indigo-600 dark:text-indigo-400 text-base">
                  {editRecord.userName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  User ID: {editRecord.userId}
                </p>
              </div>

              {/* Date Field */}
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                  Attendance Date
                </label>
                <input
                  type="date"
                  value={editRecord.date}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, date: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Status Toggle */}
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                  Attendance Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setEditRecord({
                        ...editRecord,
                        status: "present",
                      })
                    }
                    className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      editRecord.status === "present"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                    }`}>
                    <CheckCircle className="w-4 h-4" /> Present
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditRecord({
                        ...editRecord,
                        status: "absent",
                        lunch: false,
                        dinner: false,
                      })
                    }
                    className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      editRecord.status === "absent"
                        ? "bg-rose-600 text-white shadow-xs"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                    }`}>
                    <XCircle className="w-4 h-4" /> Absent
                  </button>
                </div>
              </div>

              {/* Meals Toggles */}
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                  Meals Served
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={editRecord.status !== "present"}
                    onClick={() =>
                      setEditRecord({ ...editRecord, lunch: !editRecord.lunch })
                    }
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      editRecord.lunch
                        ? "bg-amber-500 text-white"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300"
                    } disabled:opacity-40 disabled:cursor-not-allowed`}>
                    🍛 Lunch {editRecord.lunch ? "✓" : ""}
                  </button>

                  <button
                    type="button"
                    disabled={editRecord.status !== "present"}
                    onClick={() =>
                      setEditRecord({
                        ...editRecord,
                        dinner: !editRecord.dinner,
                      })
                    }
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      editRecord.dinner
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300"
                    } disabled:opacity-40 disabled:cursor-not-allowed`}>
                    🌙 Dinner {editRecord.dinner ? "✓" : ""}
                  </button>
                </div>
              </div>

              {/* Extra Tiffin Count */}
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                  Extra Tiffin Count
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setEditRecord({
                        ...editRecord,
                        extraTiffin: Math.max(0, editRecord.extraTiffin - 1),
                      })
                    }
                    className="w-10 h-10 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl font-black text-lg flex items-center justify-center">
                    −
                  </button>

                  <span className="text-xl font-black w-8 text-center">
                    {editRecord.extraTiffin}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setEditRecord({
                        ...editRecord,
                        extraTiffin: editRecord.extraTiffin + 1,
                      })
                    }
                    className="w-10 h-10 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl font-black text-lg flex items-center justify-center">
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditRecord(null)}
                className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold hover:bg-gray-100 dark:hover:bg-slate-800">
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveHistoryEdit}
                disabled={isSavingEdit}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-50">
                <Save className="w-4 h-4" />
                {isSavingEdit ? "Saving..." : "Save Modifications"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
