import { useState, useEffect } from "react";
import {
  CalendarCheck,
  History,
  UtensilsCrossed,
  Users,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getUserdatafromserver, getAttendanceByDate } from "../../service";

const todayStr = () => new Date().toISOString().split("T")[0];

export default function CardsSection() {
  const [stats, setStats] = useState({
    attendanceVal: "0 / 0",
    attendanceSub: "Today's Attendance",
    historyVal: "All Records",
    historySub: "Attendance History",
    mealsVal: "Active Batch",
    mealsSub: "Today's Menu",
    membersVal: "0 Members",
    membersSub: "Manage Members",
    paymentsVal: "₹0",
    paymentsSub: "0 Pending",
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const date = todayStr();
        const [users, records] = await Promise.all([
          getUserdatafromserver(),
          getAttendanceByDate(date),
        ]);

        const totalUsers = users.length;
        const presentCount = records.filter((r) => r.status === "present").length;

        const totalPaid = users.reduce((acc, u) => acc + (u.paid || 0), 0);
        const pendingUsers = users.filter((u) => u.paymentStatus === "Pending").length;

        setStats({
          attendanceVal: `${presentCount} / ${totalUsers}`,
          attendanceSub: "Today's Attendance",
          historyVal: `${records.length} Today`,
          historySub: "Attendance History",
          mealsVal: "Active Batch",
          mealsSub: "Today's Menu",
          membersVal: `${totalUsers} Registered`,
          membersSub: "Manage Members",
          paymentsVal: `₹${totalPaid}`,
          paymentsSub: `${pendingUsers} Pending`,
        });
      } catch (err) {
        console.error("Error fetching card stats:", err);
      }
    };

    fetchDashboardStats();
  }, []);

  const cards = [
    {
      title: "Attendance",
      value: stats.attendanceVal,
      subtitle: stats.attendanceSub,
      icon: <CalendarCheck size={24} />,
      bg: "bg-black text-white dark:bg-slate-800 dark:text-white",
      action: "View Attendance",
      path: "/attendance",
    },
    {
      title: "History",
      value: stats.historyVal,
      subtitle: stats.historySub,
      icon: <History size={24} />,
      bg: "bg-black text-white dark:bg-slate-800 dark:text-white",
      action: "View History",
      path: "/history",
    },
    {
      title: "Calendar",
      value: "Member Calendar",
      subtitle: "Individual Tracking",
      icon: <CalendarCheck size={24} />,
      bg: "bg-black text-white dark:bg-slate-800 dark:text-white",
      action: "Open Calendar",
      path: "/calendar",
    },
    {
      title: "Meals",
      value: stats.mealsVal,
      subtitle: stats.mealsSub,
      icon: <UtensilsCrossed size={24} />,
      bg: "bg-black text-white dark:bg-slate-800 dark:text-white",
      action: "Edit Meals",
      path: "/meals",
    },
    {
      title: "Members",
      value: stats.membersVal,
      subtitle: stats.membersSub,
      icon: <Users size={24} />,
      bg: "bg-black text-white dark:bg-slate-800 dark:text-white",
      action: "Open Members",
      path: "/members",
    },
    {
      title: "Payments",
      value: stats.paymentsVal,
      subtitle: stats.paymentsSub,
      icon: <Wallet size={24} />,
      bg: "bg-black text-white dark:bg-slate-800 dark:text-white",
      action: "View Payments",
      path: "/payments",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4 md:gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 md:p-6 border-2 border-black dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between text-black dark:text-white"
        >
          {/* Top */}
          <div className="flex items-center justify-between mb-5">
            <div
              className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-bold ${card.bg}`}
            >
              {card.icon}
            </div>

            <span className="text-xs md:text-sm text-black dark:text-gray-300 font-semibold">
              {card.subtitle}
            </span>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-xs md:text-sm uppercase tracking-wide text-black dark:text-gray-400 font-bold">
              {card.title}
            </h3>

            <p className="text-2xl md:text-3xl font-black mt-2 text-black dark:text-white">
              {card.value}
            </p>
          </div>

          {/* Button */}
          <Link to={`/admin${card.path}`}>
            <button className="mt-5 w-full py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white text-sm font-bold transition cursor-pointer">
              {card.action}
            </button>
          </Link>
        </div>
      ))}
    </section>
  );
}