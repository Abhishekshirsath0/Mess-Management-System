import { useState, useEffect, useMemo } from "react";
import { getUserdatafromserver, updateUser , deleteUser } from "../../../service";

export const Members = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await getUserdatafromserver();

        const mapped = data.map((u) => ({
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
        }));

        setMembers(mapped);
      } catch (err) {
        console.error("Failed to load members:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  const toggleRole = async (id) => {
    const target = members.find((m) => m.id === id);
    if (!target) return;
    const newRole = target.role === "admin" ? "user" : "admin";

    try {
      await updateUser(id, { Usertype: newRole });
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, role: newRole } : m)),
      );
    } catch (err) {
      alert("Failed to update user role");
    }
  };

  const filtered = members
    .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      // admin first
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

        return acc;
      },
      {
        total: 0,
        veg: 0,
        mixed: 0,
        paid: 0,
        pending: 0,
      },
    );
  }, [members]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-6 flex items-center justify-center text-gray-500">
        Loading members...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Members Management</h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search member..."
          className="border px-4 py-2 rounded-xl md:w-72"
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border">
          <p className="text-gray-500 text-xs">Total</p>
          <h2 className="text-2xl font-bold">{stats.total}</h2>
        </div>

        <div className="bg-green-50 p-4 rounded-2xl border">
          <p className="text-gray-500 text-xs">Pure Veg</p>
          <h2 className="text-2xl font-bold text-green-700">{stats.veg}</h2>
        </div>

        <div className="bg-orange-50 p-4 rounded-2xl border">
          <p className="text-gray-500 text-xs">Mixed</p>
          <h2 className="text-2xl font-bold text-orange-700">{stats.mixed}</h2>
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl border">
          <p className="text-gray-500 text-xs">Paid</p>
          <h2 className="text-2xl font-bold text-blue-700">₹{stats.paid}</h2>
        </div>

        <div className="bg-yellow-50 p-4 rounded-2xl border">
          <p className="text-gray-500 text-xs">Pending</p>
          <h2 className="text-2xl font-bold text-yellow-700">
            ₹{stats.pending}
          </h2>
        </div>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.length > 0 ? (
          filtered.map((m) => (
            <div
              key={m.id}
              className="bg-white border rounded-3xl p-6 shadow-sm">
              {/* HEADER */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{m.name}</h2>
                  <p className="text-sm text-gray-500">{m.phone}</p>
                </div>

                <span
                  className={`relative overflow-hidden inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white
  ${
    m.role === "admin"
      ? "bg-linear-to-r from-purple-500 via-fuchsia-500 to-indigo-500"
      : "bg-linear-to-r from-gray-500 via-slate-400 to-gray-600"
  }`}>
                  {/* Moving light */}
                  <span className="absolute inset-0 -translate-x-full animate-[shine_2s_linear_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                  <span className="relative z-10">{m.role.toUpperCase()}</span>
                </span>
              </div>

              {/* DIET TYPE */}
              <div className="mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    m.dietType === "Pure Veg"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}>
                  {m.dietType}
                </span>
              </div>

              {/* DETAILS */}
              <div className="text-sm space-y-1 text-gray-700">
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

              {/* PAYMENT */}
              <div className="flex gap-3 mt-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs">
                  Paid: ₹{m.paid}
                </span>

                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs">
                  Pending: ₹{m.pending}
                </span>
              </div>

              {/* ACTION */}
              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => toggleRole(m.id)}
                  className="bg-black text-white px-4 py-2 rounded-xl text-sm">
                  Toggle Role
                </button>
                <button
                  onClick={() => { alert("Are you sure you want to remove this member?"); deleteUser(m.id);
                    deleteUser == false ? "loading" : setMembers((prev) => prev.filter((member) => member.id !== m.id))
                   }}
                  className="bg-red-500 cursor-pointer transition-all duration-300 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm ml-2">
                  Remove Member
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center py-10">
            No members found
          </p>
        )}
      </div>
    </div>
  );
};
