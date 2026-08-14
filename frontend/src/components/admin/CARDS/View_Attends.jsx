import { useEffect, useState } from "react";
import {
  getUserdatafromserver,
  getAttendanceByDate,
  postAttendance,
  updateAttendance,
} from "../../../service";
import { PropagateLoader } from "react-spinners";

const todayStr = () => new Date().toISOString().split("T")[0];

const mapUsersWithAttendance = (users, records) => {
  return users.map((u) => {
    const rec = records.find((r) => String(r.userId) === String(u.id));

    return {
      id: u.id,
      rollNo: u.id.slice(-4),
      name: u.name,
      mobile: String(u.mobile),
      payment: u.payment ?? "Unpaid",
      status: rec ? (rec.status === "present" ? "Active" : "Inactive") : "Inactive",
      lunch: rec?.lunch ?? false,
      dinner: rec?.dinner ?? false,
      extraTiffin: rec?.extraTiffin ?? 0,
    };
  });
};

export const View_Attends = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [attendanceSaved, setAttendanceSaved] = useState(false);
  const [currentDate, setCurrentDate] = useState(todayStr());
  const [loading, setLoading] = useState(true);
  const loadData = async () => {
    try {
      const date = todayStr();
      setLoading(true)
      const [users, records] = await Promise.all([
        getUserdatafromserver(),
        getAttendanceByDate(date),
      ]);
      setMembers(mapUsersWithAttendance(users, records));
      setAttendanceSaved(records.length > 0);
      setCurrentDate(date);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Failed to load attendance data:", err);
    }
  };

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  // Check every minute whether the date has rolled over; if so, reload fresh data
  useEffect(() => {
    const interval = setInterval(() => {
      if (todayStr() !== currentDate) {

        loadData();

      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [currentDate]);

  const filteredMembers = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.mobile.includes(q) ||
      String(m.rollNo).includes(q)
    );
  });

  const totalPresent = members.filter((m) => m.status === "Active").length;
  const totalAbsent = members.filter((m) => m.status === "Inactive").length;
  const totalLunch = members.filter((m) => m.lunch).length;
  const totalDinner = members.filter((m) => m.dinner).length;
  const totalExtraTiffin = members.reduce((acc, m) => acc + m.extraTiffin, 0);

  const toggleStatus = (id, newStatus) =>
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
            ...m,
            status: newStatus,
            // Absent students can't have meals marked — clear them
            lunch: newStatus === "Active" ? m.lunch : false,
            dinner: newStatus === "Active" ? m.dinner : false,
          }
          : m
      )
    );

  const toggleMeal = (id, field) =>
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        if (m.status !== "Active") return m; // guard: only Present students can toggle meals
        return { ...m, [field]: !m[field] };
      })
    );

  const updateExtraTiffin = (id, action) =>
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const count =
          action === "add"
            ? m.extraTiffin + 1
            : m.extraTiffin > 0
              ? m.extraTiffin - 1
              : 0;
        return { ...m, extraTiffin: count };
      })
    );

  const handleSaveOrUpdate = async () => {
    try {
      setSaving(true);
      const today = todayStr();

      // One payload object per member (not per meal) — single record per student per day
      const payload = members
        .filter((m) => m.lunch || m.dinner)
        .map((m) => ({
          userId: m.id,
          userName: m.name,
          date: today,
          status: m.status === "Active" ? "present" : "absent",
          lunch: m.lunch,
          dinner: m.dinner,
          extraTiffin: m.extraTiffin,
        }));

      if (payload.length === 0) {
        alert("No lunch/dinner marked for any member — nothing to save.");
        setSaving(false);
        return;
      }

      if (attendanceSaved) {
        await updateAttendance(payload);
      } else {
        await postAttendance(payload);
      }

      alert(
        attendanceSaved
          ? "Attendance Updated Successfully!"
          : "Attendance Saved Successfully!"
      );

      // Refetch so the UI reflects exactly what's in the database
      await loadData();
    } catch (error) {
      console.error(error);
      alert(attendanceSaved ? "Failed to update attendance" : "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col text-gray-900 dark:text-white">

      {/* HEADER */}
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Today's Attendance</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, roll no, mobile..."
          className="bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-72"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-auto max-h-[500px]">
        <table className="w-full min-w-[1100px]">

          <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 z-10 border-b border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200">
            <tr>
              <th className="p-4 text-left">Roll No</th>
              <th className="p-4 text-left">Member</th>
              <th className="p-4 text-left">Mobile</th>
              <th className="p-4 text-left">Payment</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Lunch</th>
              <th className="p-4 text-left">Dinner</th>
              <th className="p-4 text-left">Extra Tiffin</th>
            </tr>
          </thead>

          <tbody>

            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr key={member.id} className="border-t border-gray-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">

                  <td className="p-4 font-semibold">{member.rollNo}</td>
                  <td className="p-4 font-medium">{member.name}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{member.mobile}</td>

                  {/* PAYMENT */}
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${member.payment === "Paid"
                      ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border border-green-200 dark:border-green-800"
                      : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800"
                      }`}>
                      {member.payment}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStatus(member.id, "Active")}
                        className={`px-3 py-1 rounded-lg text-sm transition ${member.status === "Active"
                          ? "bg-green-600 text-white shadow-xs font-bold"
                          : "bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-700"
                          }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => toggleStatus(member.id, "Inactive")}
                        className={`px-3 py-1 rounded-lg text-sm transition ${member.status === "Inactive"
                          ? "bg-red-600 text-white shadow-xs font-bold"
                          : "bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-700"
                          }`}
                      >
                        Absent
                      </button>
                    </div>
                  </td>

                  {/* LUNCH */}
                  <td className="p-4">
                    <button
                      onClick={() => toggleMeal(member.id, "lunch")}
                      disabled={member.status !== "Active"}
                      className={`px-3 py-1 rounded-lg text-sm transition ${member.lunch
                        ? "bg-orange-500 text-white shadow-xs font-bold"
                        : "bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-700"
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      Lunch
                    </button>
                  </td>

                  {/* DINNER */}
                  <td className="p-4">
                    <button
                      onClick={() => toggleMeal(member.id, "dinner")}
                      disabled={member.status !== "Active"}
                      className={`px-3 py-1 rounded-lg text-sm transition ${member.dinner
                        ? "bg-purple-600 text-white shadow-xs font-bold"
                        : "bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-700"
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      Dinner
                    </button>
                  </td>

                  {/* EXTRA TIFFIN */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateExtraTiffin(member.id, "remove")}
                        className="px-3 py-1 bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-700 cursor-pointer"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-semibold">
                        {member.extraTiffin}
                      </span>
                      <button
                        onClick={() => updateExtraTiffin(member.id, "add")}
                        className="px-3 py-1 bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-6 text-gray-500">
                  <div>
                    {loading && (
                      <div className="flex justify-center items-center h-full">
                        <PropagateLoader color={"#6366f1"} />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* SUMMARY */}
      <div className="border-t-2 border-black dark:border-slate-800 bg-white dark:bg-slate-800/40 p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-green-950/60 text-black dark:text-green-300 border-2 border-black dark:border-green-800/60 rounded-xl p-4">
            <p className="text-sm font-bold text-green-700 dark:text-green-400">Present</p>
            <h3 className="text-2xl font-black text-black dark:text-green-200">{totalPresent}</h3>
          </div>
          <div className="bg-white dark:bg-red-950/60 text-black dark:text-red-300 border-2 border-black dark:border-red-800/60 rounded-xl p-4">
            <p className="text-sm font-bold text-red-700 dark:text-red-400">Absent</p>
            <h3 className="text-2xl font-black text-black dark:text-red-200">{totalAbsent}</h3>
          </div>
          <div className="bg-white dark:bg-orange-950/60 text-black dark:text-orange-300 border-2 border-black dark:border-orange-800/60 rounded-xl p-4">
            <p className="text-sm font-bold text-orange-700 dark:text-orange-400">Lunch</p>
            <h3 className="text-2xl font-black text-black dark:text-orange-200">{totalLunch}</h3>
          </div>
          <div className="bg-white dark:bg-purple-950/60 text-black dark:text-purple-300 border-2 border-black dark:border-purple-800/60 rounded-xl p-4">
            <p className="text-sm font-bold text-purple-700 dark:text-purple-400">Dinner</p>
            <h3 className="text-2xl font-black text-black dark:text-purple-200">{totalDinner}</h3>
          </div>
          <div className="bg-white dark:bg-blue-950/60 text-black dark:text-blue-300 border-2 border-black dark:border-blue-800/60 rounded-xl p-4">
            <p className="text-sm font-bold text-blue-700 dark:text-blue-400">Extra Tiffin</p>
            <h3 className="text-2xl font-black text-black dark:text-blue-200">{totalExtraTiffin}</h3>
          </div>
        </div>
      </div>

      {/* SAVE / UPDATE BUTTON */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total Members: <span className="font-semibold text-gray-900 dark:text-white">{members.length}</span>
        </div>
        <button
          onClick={handleSaveOrUpdate}
          disabled={saving}
          className="bg-black dark:bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-gray-800 dark:hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold cursor-pointer"
        >
          {saving
            ? attendanceSaved
              ? "Updating..."
              : "Saving..."
            : attendanceSaved
              ? "Update Attendance"
              : "Save Attendance"}
        </button>
      </div>

    </section>
  );
};