import { useState, useEffect, useMemo } from "react";
import { getUserdatafromserver } from "../../service.js";

const PLAN_AMOUNTS = {
  BASIC: 1800,
  STANDARD: 3600,
  PREMIUM: 4200,
};

const PLAN_ORDER = ["BASIC", "STANDARD", "PREMIUM"];

export default function PerformanceSection() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
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
            plan: planName,
            planAmount,
            paidAmount,
            pendingAmount,
          };
        });
        setMembers(mapped);
      } catch (err) {
        console.error("Failed to load performance data:", err);
        setError("Could not load payment data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Collection rate per plan tier -> feeds the "Monthly Performance" bars
  const planPerformance = useMemo(() => {
    const buckets = PLAN_ORDER.reduce((acc, plan) => {
      acc[plan] = { planAmount: 0, paidAmount: 0 };
      return acc;
    }, {});

    members.forEach((m) => {
      if (!buckets[m.plan]) buckets[m.plan] = { planAmount: 0, paidAmount: 0 };
      buckets[m.plan].planAmount += m.planAmount;
      buckets[m.plan].paidAmount += m.paidAmount;
    });

    return PLAN_ORDER.map((plan) => {
      const { planAmount, paidAmount } = buckets[plan];
      const pct = planAmount > 0 ? Math.round((paidAmount / planAmount) * 100) : 0;
      return { label: plan, pct };
    });
  }, [members]);

  // Overall collection health -> feeds the "Daily Performance" progress rows
  const overallStats = useMemo(() => {
    const totals = members.reduce(
      (acc, m) => {
        acc.planAmount += m.planAmount;
        acc.paidAmount += m.paidAmount;
        acc.pendingAmount += m.pendingAmount;
        acc.totalUsers += 1;
        if (m.pendingAmount === 0) acc.paidUsers += 1;
        return acc;
      },
      { planAmount: 0, paidAmount: 0, pendingAmount: 0, totalUsers: 0, paidUsers: 0 }
    );

    const collectedPct = totals.planAmount > 0
      ? Math.round((totals.paidAmount / totals.planAmount) * 100)
      : 0;
    const pendingPct = totals.planAmount > 0
      ? Math.round((totals.pendingAmount / totals.planAmount) * 100)
      : 0;
    const membersPaidPct = totals.totalUsers > 0
      ? Math.round((totals.paidUsers / totals.totalUsers) * 100)
      : 0;

    return [
      {
        title: "Amount Collected",
        amount: `₹${totals.paidAmount.toLocaleString("en-IN")}`,
        progress: `${collectedPct}%`,
      },
      {
        title: "Amount Pending",
        amount: `₹${totals.pendingAmount.toLocaleString("en-IN")}`,
        progress: `${pendingPct}%`,
      },
      {
        title: "Members Paid",
        amount: `${totals.paidUsers}/${totals.totalUsers}`,
        progress: `${membersPaidPct}%`,
      },
    ];
  }, [members]);

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-500">
        Loading mess performance...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Plan-wise collection rate */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold mb-1 text-slate-900">
          Collection Rate by Plan
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          % of plan amount collected, per plan tier
        </p>

        <div className="h-52 md:h-64 flex items-end gap-3 md:gap-4">
          {planPerformance.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-xs font-semibold text-slate-700">{item.pct}%</span>
              <div
                className="w-full bg-black rounded-t-xl transition-all duration-300"
                style={{ height: `${item.pct}%` }}
                title={`${item.label}: ${item.pct}%`}
              />
              <span className="text-xs text-slate-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Overall collection health */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold mb-1 text-slate-900">
          Overall Mess Performance
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Live snapshot from payment records
        </p>

        <div className="space-y-6">
          {overallStats.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-2 text-sm md:text-base text-slate-800">
                <span>{item.title}</span>
                <span className="font-semibold">{item.amount}</span>
              </div>

              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black rounded-full transition-all duration-300"
                  style={{ width: item.progress }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}