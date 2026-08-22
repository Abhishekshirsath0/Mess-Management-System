import { useState, useEffect, useMemo } from "react";
import {
  getUserdatafromserver,
  updateUser,
  deleteUser,
  getAllMealAssignments,
  assignUserMeal,
  resetUserMeal,
} from "../../../service";
import { RingLoader } from "react-spinners";

export const Members = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingMealId, setUpdatingMealId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, assignmentsData] = await Promise.all([
        getUserdatafromserver(),
        getAllMealAssignments().catch(() => []),
      ]);

      const assignmentMap = {};
      if (Array.isArray(assignmentsData)) {
        assignmentsData.forEach((a) => {
          const uid = a.userId?._id || a.userId;
          if (uid && a.status === "active") {
            assignmentMap[uid] = a.mealType;
          }
        });
      }

      const mapped = usersData.map((u) => ({
        id: u.id,
        name: u.name,
        phone: u.mobile,
        parentPhone: u.parent_mob,
        address: u.address,
        gender: u.gender,
        role: u.role ?? "user",
        dietType: u.dietType ?? "Mixed",
        paid: u.paid ?? 0,
        pending: u.pending ?? 0,
        assignedMeal: assignmentMap[u.id] || null,
      }));

      setMembers(mapped);
    } catch (err) {
      console.error("Failed to load members or meal assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleRole = async (id) => {
    const target = members.find((m) => m.id === id);
    if (!target) return;
    const newRole = target.role === "admin" ? "user" : "admin";

    try {
      await updateUser(id, { Usertype: newRole });
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
      );
    } catch (err) {
      alert("Failed to update user role");
    }
  };

  const handleMealAssign = async (userId, mealType) => {
    setUpdatingMealId(userId);
    try {
      if (!mealType) {
        await resetUserMeal(userId);
        setMembers((prev) =>
          prev.map((m) => (m.id === userId ? { ...m, assignedMeal: null } : m))
        );
      } else {
        await assignUserMeal(userId, mealType);
        setMembers((prev) =>
          prev.map((m) => (m.id === userId ? { ...m, assignedMeal: mealType } : m))
        );
      }
    } catch (err) {
      alert(err.message || "Failed to update meal assignment");
    } finally {
      setUpdatingMealId(null);
    }
  };

  const filtered = members
    .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.role === "admin" && b.role !== "admin") return -1;
      if (a.role !== "admin" && b.role === "admin") return 1;
      return 0;
    });

  const stats = useMemo(() => {
    return members.reduce(
      (acc, m) => {
        acc.total += 1;
        if (m.dietType === "Pure Veg") acc.veg += 1;
        else if (m.dietType === "Mixed") acc.mixed += 1;
        acc.paid += m.paid;
        acc.pending += m.pending;
        if (m.assignedMeal) acc.assignedMeals += 1;
        return acc;
      },
      {
        total: 0,
        veg: 0,
        mixed: 0,
        paid: 0,
        pending: 0,
        assignedMeals: 0,
      }
    );
  }, [members]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-slate-950">
        <RingLoader color={"#6366f1"} size={60} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-slate-950 p-6 text-gray-900 dark:text-white transition-colors">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Members Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage user roles, payments, and daily recurring meal assignments.
          </p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search member..."
          className="border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl md:w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-xs">Total Members</p>
          <h2 className="text-2xl font-bold">{stats.total}</h2>
        </div>

        <div className="bg-green-50 dark:bg-green-950/40 p-4 rounded-2xl border border-green-200 dark:border-green-900/60 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-xs">Pure Veg</p>
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.veg}</h2>
        </div>

        <div className="bg-orange-50 dark:bg-orange-950/40 p-4 rounded-2xl border border-orange-200 dark:border-orange-900/60 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-xs">Mixed</p>
          <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-400">{stats.mixed}</h2>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-xs">Active Daily Meals</p>
          <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{stats.assignedMeals}</h2>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 shadow-sm col-span-2 md:col-span-1">
          <p className="text-gray-500 dark:text-gray-400 text-xs">Paid Total</p>
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400">₹{stats.paid}</h2>
        </div>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.length > 0 ? (
          filtered.map((m) => (
            <div
              key={m.id}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* HEADER */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-xl font-bold">{m.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{m.phone}</p>
                  </div>

                  <span
                    className={`relative overflow-hidden inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      m.role === "admin"
                        ? "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500"
                        : "bg-gradient-to-r from-gray-500 via-slate-400 to-gray-600"
                    }`}
                  >
                    <span className="relative z-10">{m.role.toUpperCase()}</span>
                  </span>
                </div>

                {/* BADGES: DIET TYPE & ACTIVE RECURRING MEAL */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      m.dietType === "Pure Veg"
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                        : "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                    }`}
                  >
                    {m.dietType}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      m.assignedMeal
                        ? "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-800"
                        : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-gray-400 dark:border-slate-700"
                    }`}
                  >
                    {m.assignedMeal ? `Active Daily Meal: ${m.assignedMeal}` : "No Active Daily Meal"}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300 mb-4">
                  <p>
                    <b>Parent:</b> {m.parentPhone}
                  </p>
                  <p>
                    <b>Address:</b> {m.address}
                  </p>
                  <p>
                    <b>Gender:</b> {m.gender}
                  </p>
                </div>

                {/* DAILY RECURRING MEAL ASSIGNMENT CONTROL */}
                <div className="bg-gray-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-gray-200 dark:border-slate-700/80 mb-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Daily Recurring Meal Assignment
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {["Lunch", "Dinner", "Both"].map((type) => (
                      <button
                        key={type}
                        disabled={updatingMealId === m.id}
                        onClick={() => handleMealAssign(m.id, type)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          m.assignedMeal === type
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-slate-600"
                        }`}
                      >
                        {type}
                      </button>
                    ))}

                    {m.assignedMeal && (
                      <button
                        disabled={updatingMealId === m.id}
                        onClick={() => handleMealAssign(m.id, null)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900 border border-red-200 dark:border-red-800 transition-all cursor-pointer ml-auto"
                      >
                        Reset / Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* PAYMENT SUMMARY */}
                <div className="flex gap-3 mb-4">
                  <span className="bg-green-100 text-green-700 dark:bg-green-950/80 dark:text-green-300 px-3 py-1 rounded-lg text-xs font-semibold">
                    Paid: ₹{m.paid}
                  </span>

                  <span className="bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 px-3 py-1 rounded-lg text-xs font-semibold">
                    Pending: ₹{m.pending}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  onClick={() => toggleRole(m.id)}
                  className="bg-gray-900 dark:bg-slate-800 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer"
                >
                  Toggle Role
                </button>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to remove this member?")) {
                      deleteUser(m.id).then(() => {
                        setMembers((prev) => prev.filter((user) => user.id !== m.id));
                      });
                    }
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer"
                >
                  Remove Member
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-10">
            No members found
          </p>
        )}
      </div>
    </div>
  );
};
