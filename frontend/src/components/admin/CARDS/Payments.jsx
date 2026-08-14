import { useState, useEffect, useMemo } from "react";
import { getUserdatafromserver, updateUser } from "../../../service";
import { RingLoader } from "react-spinners";

const PLAN_AMOUNTS = {
  BASIC: 1800,
  STANDARD: 3600,
  PREMIUM: 4200,
};

const PLAN_OPTIONS = ["BASIC", "STANDARD", "PREMIUM"];

export const Payments = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingPlanId, setUpdatingPlanId] = useState(null);

  // State for Deposit Modal
  const [depositMember, setDepositMember] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMembers = async () => {
    try {
      const users = await getUserdatafromserver();
      const mapped = users.map((u) => {
        const planName = u.plan || "STANDARD";
        const planAmount = PLAN_AMOUNTS[planName] || 3600;
        const isPaid = u.paymentStatus === "Paid";
        const paidAmount = isPaid ? planAmount : (u.paid || 0);
        const pendingAmount = Math.max(0, planAmount - paidAmount);

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
      alert(`Marked full payment as Paid for ${member.name}`);
      fetchMembers();
    } catch (err) {
      alert(`Failed to update payment for ${member.name}`);
    }
  };

  // Custom Deposit Handler
  const handleCustomDeposit = async (e) => {
    e.preventDefault();
    if (!depositMember || !depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const addedAmount = Number(depositAmount);
    const newPaidAmount = depositMember.paid + addedAmount;
    const newPendingAmount = Math.max(0, depositMember.plan.amount - newPaidAmount);
    const newStatus = newPendingAmount === 0 ? "Paid" : "Pending";

    setIsSubmitting(true);
    try {
      await updateUser(depositMember.id, {
        PaidAmount: newPaidAmount,
        PendingAmount: newPendingAmount,
        PaymentStatus: newStatus,
      });
      alert(`Successfully added ₹${addedAmount} to ${depositMember.name}'s account.`);
      setDepositMember(null);
      setDepositAmount("");
      fetchMembers();
    } catch (err) {
      alert(`Failed to deposit amount for ${depositMember.name}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePlan = async (member, newPlanName) => {
    if (newPlanName === member.plan.name) return;

    const newPlanAmount = PLAN_AMOUNTS[newPlanName];
    const carriedPaid = member.paid;
    const newPending = Math.max(0, newPlanAmount - carriedPaid);
    const newStatus = newPending === 0 ? "Paid" : "Pending";

    setUpdatingPlanId(member.id);
    try {
      await updateUser(member.id, {
        Plan: newPlanName,
        PaidAmount: carriedPaid,
        PendingAmount: newPending,
        PaymentStatus: newStatus,
      });
      fetchMembers();
    } catch (err) {
      alert(`Failed to change plan for ${member.name}`);
    } finally {
      setUpdatingPlanId(null);
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
      <div>
        {loading && (
          <div className="flex justify-center items-center mt-70 h-full">
            <RingLoader color={"#ffffffff"} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-slate-950 p-6 text-gray-900 dark:text-white transition-colors relative">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Payments Management</h1>

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
              className="bg-white border rounded-3xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* HEADER */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{m.name}</h2>
                    <p className="text-sm text-gray-500">{m.phone}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${m.pending > 0
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                      }`}
                  >
                    {m.pending > 0 ? "PENDING" : "PAID"}
                  </span>
                </div>

                {/* PLAN */}
                <div className="mb-4 bg-blue-50 border rounded-2xl p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-blue-700">
                      {m.plan.name} PLAN
                    </span>

                    <span className="font-bold">₹{m.plan.amount}</span>
                  </div>

                  <p className="text-xs text-gray-500 mb-3">
                    Total bill for this plan
                  </p>

                  {/* CHANGE PLAN BUTTONS */}
                  <div className="flex gap-2">
                    {PLAN_OPTIONS.map((planOption) => {
                      const isActive = planOption === m.plan.name;
                      const isUpdating = updatingPlanId === m.id;

                      return (
                        <button
                          key={planOption}
                          onClick={() => handleChangePlan(m, planOption)}
                          disabled={isActive || isUpdating}
                          className={`flex-1 text-xs font-semibold px-2 py-1.5 rounded-lg border transition ${isActive
                            ? "bg-blue-600 text-white border-blue-600 cursor-default"
                            : "bg-white text-blue-700 border-blue-200 hover:bg-blue-100"
                            } disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                          {planOption}
                        </button>
                      );
                    })}
                  </div>
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
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-semibold">
                    Paid: ₹{m.paid}
                  </span>

                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-semibold">
                    Pending: ₹{m.pending}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setDepositMember(m)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                >
                  + Deposit
                </button>

                <button
                  onClick={() => handleMarkPaid(m)}
                  disabled={m.pending === 0}
                  className="bg-black text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  {m.pending === 0 ? "Paid" : "Mark Full Paid"}
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

      {/* DEPOSIT MODAL */}
      {depositMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border">
            <h2 className="text-xl font-bold mb-1">Deposit Amount</h2>
            <p className="text-sm text-gray-500 mb-4">
              Add payment for <b>{depositMember.name}</b>
            </p>

            <form onSubmit={handleCustomDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Enter Amount (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="e.g. 500 or 2000"
                  className="w-full border px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Current Paid:</span>
                  <b>₹{depositMember.paid}</b>
                </div>
                <div className="flex justify-between">
                  <span>Current Pending:</span>
                  <b className="text-red-600">₹{depositMember.pending}</b>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setDepositMember(null);
                    setDepositAmount("");
                  }}
                  className="px-4 py-2 border rounded-xl text-sm font-semibold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Confirm Deposit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};