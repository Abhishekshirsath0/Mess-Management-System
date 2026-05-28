import { useState, useMemo } from "react";

const initialMembers = [
  {
    id: 1,
    name: "Rahul Patil",
    phone: "9876543210",
    parentPhone: "9123456780",
    address: "Pune",
    gender: "Male",
    paid: 3600,
    plan: {
      name: "STANDARD",
      amount: 3600,
    },
  },
  {
    id: 2,
    name: "Sneha Sharma",
    phone: "9988776655",
    parentPhone: "9111122233",
    address: "Mumbai",
    gender: "Female",
    paid: 1800,
    plan: {
      name: "BASIC",
      amount: 3600,
    },
  },
  {
    id: 3,
    name: "Aman Verma",
    phone: "9000011111",
    parentPhone: "9222211111",
    address: "Pune",
    gender: "Male",
    paid: 3600,
    plan: {
      name: "STANDARD",
      amount: 3600,
    },
  },
];

export const Payments = () => {
  const [members] = useState(initialMembers);
  const [search, setSearch] = useState("");

  // derive pending dynamically
  const data = useMemo(() => {
    return members.map((m) => {
      const pending = m.plan.amount - m.paid;

      return {
        ...m,
        pending: pending > 0 ? pending : 0,
      };
    });
  }, [members]);

  const filtered = useMemo(() => {
    return data.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  // stats
  const stats = useMemo(() => {
    return data.reduce(
      (acc, m) => {
        acc.totalUsers += 1;
        acc.totalPaid += m.paid;
        acc.totalPending += m.pending;
        acc.totalPlanAmount += m.plan.amount;
        return acc;
      },
      {
        totalUsers: 0,
        totalPaid: 0,
        totalPending: 0,
        totalPlanAmount: 0,
      }
    );
  }, [data]);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">
          Payments Management
        </h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search member..."
          className="border px-4 py-2 rounded-xl md:w-72"
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

        <div className="bg-white border p-4 rounded-2xl">
          <p className="text-gray-500 text-xs">Total Users</p>
          <h2 className="text-2xl font-bold">{stats.totalUsers}</h2>
        </div>

        <div className="bg-blue-50 border p-4 rounded-2xl">
          <p className="text-gray-500 text-xs">Total Plan Amount</p>
          <h2 className="text-2xl font-bold text-blue-700">
            ₹{stats.totalPlanAmount}
          </h2>
        </div>

        <div className="bg-green-50 border p-4 rounded-2xl">
          <p className="text-gray-500 text-xs">Total Paid</p>
          <h2 className="text-2xl font-bold text-green-700">
            ₹{stats.totalPaid}
          </h2>
        </div>

        <div className="bg-red-50 border p-4 rounded-2xl">
          <p className="text-gray-500 text-xs">Total Pending</p>
          <h2 className="text-2xl font-bold text-red-700">
            ₹{stats.totalPending}
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
                m.pending > 0
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {m.pending > 0 ? "PENDING" : "PAID"}
              </span>

            </div>

            {/* PLAN */}
            <div className="mb-4 bg-blue-50 border rounded-2xl p-4">

              <div className="flex justify-between mb-2">
                <span className="font-semibold text-blue-700">
                  {m.plan.name} PLAN
                </span>

                <span className="font-bold">
                  ₹{m.plan.amount}
                </span>
              </div>

              <p className="text-xs text-gray-500">
                Total bill for this plan
              </p>

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
              <button className="bg-black text-white px-4 py-2 rounded-xl text-sm">
                Mark Paid
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
};