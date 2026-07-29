import { useState, useEffect, useMemo } from "react";
import { getUserdatafromserver, updateUser } from "../../../service";

const PLAN_AMOUNTS = {
  BASIC: 1800,
  STANDARD: 3600,
  PREMIUM: 4200,
};

export const Payments = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const users = await getUserdatafromserver();
      const mapped = users.map((u) => {
        const planName = u.plan || "STANDARD";
        const planAmount = PLAN_AMOUNTS[planName] || 3600;
        const isPaid = u.paymentStatus === "Paid";
        const paidAmount = isPaid ? planAmount : (u.paid || 0);
        const pendingAmount = isPaid ? 0 : Math.max(0, planAmount - paidAmount);

        return {
          id: u.id,
          name: u.name,
          phone: String(u.mobile),
          parentPhone: String(u.parent_mob),
          address: u.address,
          gender: u.gender,
          paid: paidAmount,
          pending: pendingAmount,
          paymentStatus: u.paymentStatus || (pendingAmount === 0 ? "Paid" : "Pending"),
          plan: {
            name: planName,
            amount: planAmount,
          },
        };
      });

      setMembers(mapped);
    } catch (err) {
      console.error("Failed to load payment members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleMarkPaid = async (member) => {
    try {
      await updateUser(member.id, {
        PaymentStatus: "Paid",
        PaidAmount: member.plan.amount,
        PendingAmount: 0,
      });
      alert(`Marked payment as Paid for ${member.name}`);
      fetchMembers();
    } catch (err) {
      alert(`Failed to update payment for ${member.name}`);
    }
  };

  const filtered = useMemo(() => {
    return members.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [members, search]);

  const stats = useMemo(() => {
    return members.reduce(
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
  }, [members]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-6 flex items-center justify-center text-gray-500">
        Loading payments...
      </div>
    );
  }

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

        {filtered.length > 0 ? (
          filtered.map((m) => (
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
                <button
                  onClick={() => handleMarkPaid(m)}
                  disabled={m.pending === 0}
                  className="bg-black text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  {m.pending === 0 ? "Paid" : "Mark Paid"}
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