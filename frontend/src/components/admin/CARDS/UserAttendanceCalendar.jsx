import { useState, useEffect } from "react";
import { getUserdatafromserver, getUserAttendanceHistory } from "../../../service";
import { RingLoader } from "react-spinners";
import { Calendar as CalendarIcon, User, RefreshCw, ChevronLeft, ChevronRight, Utensils, Package } from "lucide-react";
import AttendanceColorLegend from "../../common/AttendanceColorLegend";

export default function UserAttendanceCalendar() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  });

  const [records, setRecords] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        setError(null);
        const userList = await getUserdatafromserver();
        setUsers(userList || []);
        if (userList?.length > 0) {
          setSelectedUserId(userList[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load mess members.");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUserId || !selectedMonth) return;

    const fetchUserMonthAttendance = async () => {
      try {
        setLoadingAttendance(true);
        setError(null);

        const [yearStr, monthStr] = selectedMonth.split("-");
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);

        const startDate = `${selectedMonth}-01`;
        const lastDayNum = new Date(year, month, 0).getDate();
        const endDate = `${selectedMonth}-${String(lastDayNum).padStart(2, "0")}`;

        const res = await getUserAttendanceHistory(selectedUserId, {
          startDate,
          endDate,
          sort: "oldest",
        });

        setRecords(res.data || []);
      } catch (err) {
        console.error("Failed to load user calendar attendance:", err);
        setError(err.message || "Failed to fetch attendance history.");
      } finally {
        setLoadingAttendance(false);
      }
    };

    fetchUserMonthAttendance();
  }, [selectedUserId, selectedMonth]);

  const handleMonthChange = (offset) => {
    const [y, m] = selectedMonth.split("-").map(Number);
    const date = new Date(y, m - 1 + offset, 1);
    const newY = date.getFullYear();
    const newM = String(date.getMonth() + 1).padStart(2, "0");
    setSelectedMonth(`${newY}-${newM}`);
  };

  const handleRefresh = async () => {
    if (!selectedUserId || !selectedMonth) return;
    try {
      setLoadingAttendance(true);
      setError(null);
      const [y, m] = selectedMonth.split("-").map(Number);
      const lastDayNum = new Date(y, m, 0).getDate();
      const res = await getUserAttendanceHistory(selectedUserId, {
        startDate: `${selectedMonth}-01`,
        endDate: `${selectedMonth}-${String(lastDayNum).padStart(2, "0")}`,
        sort: "oldest",
      });
      setRecords(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch attendance history.");
    } finally {
      setLoadingAttendance(false);
    }
  };

  const [yearStr, monthStr] = selectedMonth.split("-");
  const year = parseInt(yearStr || 2026, 10);
  const month = parseInt(monthStr || 8, 10);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayIndex = new Date(year, month - 1, 1).getDay();

  const recordsByDateMap = {};
  records.forEach((r) => {
    if (r.date) {
      const dStr = new Date(r.date).toISOString().split("T")[0];
      recordsByDateMap[dStr] = r;
    }
  });

  const selectedUserObj = users.find((u) => u.id === selectedUserId);

  let presentDays = 0;
  let absentDays = 0;
  let notMarkedDays = 0;
  let totalLunch = 0;
  let totalDinner = 0;
  let totalExtra = 0;

  const todayStr = new Date().toISOString().split("T")[0];

  for (let day = 1; day <= daysInMonth; day++) {
    const dayFormatted = String(day).padStart(2, "0");
    const dateKey = `${selectedMonth}-${dayFormatted}`;
    const rec = recordsByDateMap[dateKey];

    if (rec) {
      if (rec.status === "present") {
        presentDays++;
        if (rec.lunch) totalLunch++;
        if (rec.dinner) totalDinner++;
        totalExtra += rec.extraTiffin || 0;
      } else if (rec.status === "absent") {
        absentDays++;
      }
    } else {
      notMarkedDays++;
    }
  }

  const monthName = new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100 my-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3 text-gray-900 dark:text-white">
            <CalendarIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            User Attendance Calendar
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track day-by-day attendance and meal activity for an individual member.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={!selectedUserId || loadingAttendance}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-xl text-sm font-semibold transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <AttendanceColorLegend />

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-black dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
            Select Member
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={loadingUsers || users.length === 0}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-black dark:focus:ring-indigo-500 text-gray-900 dark:text-white cursor-pointer"
            >
              {loadingUsers ? (
                <option>Loading members...</option>
              ) : users.length === 0 ? (
                <option value="">No members found</option>
              ) : (
                users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.mobile || u.email || "ID: " + u.id.slice(-4)})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-end">
          <button
            onClick={() => handleMonthChange(-1)}
            className="p-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-700 transition cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-indigo-500"
          />

          <button
            onClick={() => handleMonthChange(1)}
            className="p-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-700 transition cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {selectedUserObj && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</span>
            <h3 className="text-base font-bold text-gray-900 dark:text-white truncate mt-1">{selectedUserObj.name}</h3>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{monthName}</span>
          </div>

          <div className="bg-white dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 p-4 rounded-2xl">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Present Days</span>
            <h3 className="text-2xl font-black text-black dark:text-emerald-200 mt-1">{presentDays}</h3>
          </div>

          <div className="bg-white dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/60 p-4 rounded-2xl">
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Absent Days</span>
            <h3 className="text-2xl font-black text-black dark:text-rose-200 mt-1">{absentDays}</h3>
          </div>

          <div className="bg-white dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 p-4 rounded-2xl">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Not Marked</span>
            <h3 className="text-2xl font-black text-black dark:text-amber-200 mt-1">{notMarkedDays}</h3>
          </div>

          <div className="bg-white dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800/60 p-4 rounded-2xl col-span-2 sm:col-span-1">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Meals & Extra</span>
            <div className="flex items-center gap-2 mt-1 text-sm font-extrabold text-black dark:text-blue-200">
              <span>L:{totalLunch}</span>
              <span>D:{totalDinner}</span>
              {totalExtra > 0 && (
                <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100 px-1.5 py-0.5 rounded-md">
                  +{totalExtra} Ex
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-black dark:border-slate-800 shadow-sm p-4 sm:p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📅 {monthName}</span>
          </h2>
          <span className="text-xs text-gray-500 font-medium">{daysInMonth} Days in Month</span>
        </div>

        {loadingUsers || loadingAttendance ? (
          <div className="flex justify-center items-center py-24">
            <RingLoader color="#6366f1" size={50} />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-500 font-semibold">{error}</div>
        ) : !selectedUserId ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            {users.length === 0 ? "No mess members available." : "Please select a mess member above."}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-slate-800 pb-2">
              <div className="text-rose-500">Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="min-h-[75px] sm:min-h-[95px] rounded-xl bg-gray-50/50 dark:bg-slate-800/30 border border-transparent"
                />
              ))}

              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dayFormatted = String(dayNum).padStart(2, "0");
                const dateKey = `${selectedMonth}-${dayFormatted}`;
                const rec = recordsByDateMap[dateKey];
                const isToday = dateKey === todayStr;

                let bgClass =
                  "bg-white dark:bg-amber-950/70 border-2 border-amber-400 dark:border-amber-800 text-black dark:text-amber-100";
                let statusLabel = "Not Marked";
                let badgeClass =
                  "bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700";

                if (rec) {
                  if (rec.status === "present") {
                    bgClass =
                      "bg-white dark:bg-emerald-950/70 border-2 border-emerald-500 dark:border-emerald-800 text-black dark:text-emerald-100";
                    statusLabel = "Present";
                    badgeClass =
                      "bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700";
                  } else if (rec.status === "absent") {
                    bgClass =
                      "bg-white dark:bg-rose-950/70 border-2 border-rose-500 dark:border-rose-800 text-black dark:text-rose-100";
                    statusLabel = "Absent";
                    badgeClass =
                      "bg-rose-100 dark:bg-rose-900 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-700";
                  }
                }

                return (
                  <div
                    key={`day-${dayNum}`}
                    className={`min-h-[75px] sm:min-h-[95px] p-1.5 sm:p-2.5 rounded-xl border flex flex-col justify-between transition hover:shadow-md relative ${bgClass} ${isToday ? "ring-2 ring-indigo-600 dark:ring-indigo-400 font-extrabold" : ""
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-black tracking-tight">{dayNum}</span>
                      {isToday && (
                        <span className="text-[9px] uppercase px-1 rounded bg-indigo-600 text-white font-bold">
                          Today
                        </span>
                      )}
                    </div>

                    <div className="my-1">
                      <span
                        className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md font-bold truncate block w-fit ${badgeClass}`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    {rec && rec.status === "present" ? (
                      <div className="flex flex-wrap gap-1 text-[9px] sm:text-[10px] font-semibold mt-auto">
                        {rec.lunch && (
                          <span className="bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 px-1 rounded flex items-center gap-0.5">
                            <Utensils className="w-2.5 h-2.5" /> L
                          </span>
                        )}
                        {rec.dinner && (
                          <span className="bg-purple-200/80 dark:bg-purple-900/80 text-purple-900 dark:text-purple-200 px-1 rounded flex items-center gap-0.5">
                            <Utensils className="w-2.5 h-2.5" /> D
                          </span>
                        )}
                        {rec.extraTiffin > 0 && (
                          <span className="bg-blue-200/80 dark:bg-blue-900/80 text-blue-900 dark:text-blue-200 px-1 rounded flex items-center gap-0.5 font-extrabold">
                            <Package className="w-2.5 h-2.5" /> +{rec.extraTiffin}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="h-3" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
