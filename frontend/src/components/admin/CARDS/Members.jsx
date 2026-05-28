import { useState, useMemo } from "react";

const initialMembers = [
  {
    id: 1,
    name: "Rahul Patil",
    phone: "9876543210",
    parentPhone: "9123456780",
    address: "Pune",
    gender: "Male",
    role: "user",
    paid: 3600,
    pending: 0,
    dietType: "Mixed",
    plan: {
      name: "STANDARD",
      meals: ["Lunch", "Dinner"],
      price: 3600,
    },
  },
  {
    id: 2,
    name: "Sneha Sharma",
    phone: "9988776655",
    parentPhone: "9111122233",
    address: "Mumbai",
    gender: "Female",
    role: "admin",
    paid: 1800,
    pending: 1800,
    dietType: "Pure Veg",
    plan: {
      name: "BASIC",
      meals: ["Dinner"],
      price: 1800,
    },
  },
];

export const Members = () => {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");

  const toggleRole = (id) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, role: m.role === "admin" ? "user" : "admin" }
          : m
      )
    );
  };

  const filtered = members
  .filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => {
    // admin first
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    return 0;
  });
  // ✅ STATS (NON-VEG REMOVED)
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
      }
    );
  }, [members]);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">
          Members Management
        </h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search member..."
          className="border px-4 py-2 rounded-xl md:w-72"
        />
      </div>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <div className="bg-white p-4 rounded-2xl border">
          <p className="text-gray-500 text-xs">Total</p>
          <h2 className="text-2xl font-bold">{stats.total}</h2>
        </div>

        <div className="bg-green-50 p-4 rounded-2xl border">
          <p className="text-gray-500 text-xs">Pure Veg</p>
          <h2 className="text-2xl font-bold text-green-700">
            {stats.veg}
          </h2>
        </div>

        <div className="bg-orange-50 p-4 rounded-2xl border">
          <p className="text-gray-500 text-xs">Mixed</p>
          <h2 className="text-2xl font-bold text-orange-700">
            {stats.mixed}
          </h2>
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl border">
          <p className="text-gray-500 text-xs">Paid</p>
          <h2 className="text-2xl font-bold text-blue-700">
            ₹{stats.paid}
          </h2>
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

        {filtered.map((m) => (
          <div
            key={m.id}
            className="bg-white border rounded-3xl p-6 shadow-sm"
          >

            {/* HEADER */}
            <div className="flex justify-between items-start mb-4">

              <div>
                <h2 className="text-xl font-bold">{m.name}</h2>
                <p className="text-sm text-gray-500">{m.phone}</p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                m.role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {m.role.toUpperCase()}
              </span>

            </div>

            {/* DIET TYPE */}
            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                m.dietType === "Pure Veg"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}>
                {m.dietType}
              </span>
            </div>

            {/* DETAILS */}
            <div className="text-sm space-y-1 text-gray-700">
              <p><b>Parent:</b> {m.parentPhone}</p>
              <p><b>Address:</b> {m.address}</p>
              <p><b>Gender:</b> {m.gender}</p>
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
                className="bg-black text-white px-4 py-2 rounded-xl text-sm"
              >
                Toggle Role
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
};