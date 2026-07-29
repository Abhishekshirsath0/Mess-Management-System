import { useState, useEffect } from "react";
import {
  CalendarCheck,
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
    attendanceSub: "Daily Status",
    mealsVal: "Active",
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
      bg: "bg-blue-100",
      color: "text-blue-600",
      action: "View Attendance",
      path: "/attendance",
    },
    {
      title: "Meals",
      value: stats.mealsVal,
      subtitle: stats.mealsSub,
      icon: <UtensilsCrossed size={24} />,
      bg: "bg-orange-100",
      color: "text-orange-600",
      action: "Edit Meals",
      path: "/meals",
    },
    {
      title: "Members",
      value: stats.membersVal,
      subtitle: stats.membersSub,
      icon: <Users size={24} />,
      bg: "bg-green-100",
      color: "text-green-600",
      action: "Open Members",
      path: "/members",
    },
    {
      title: "Payments",
      value: stats.paymentsVal,
      subtitle: stats.paymentsSub,
      icon: <Wallet size={24} />,
      bg: "bg-purple-100",
      color: "text-purple-600",
      action: "View Payments",
      path: "/payments",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-5 md:p-6 border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
        >
          {/* Top */}
          <div className="flex items-center justify-between mb-5">
            <div
              className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${card.bg} ${card.color}`}
            >
              {card.icon}
            </div>

            <span className="text-xs md:text-sm text-gray-500 font-medium">
              {card.subtitle}
            </span>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-xs md:text-sm uppercase tracking-wide text-gray-500">
              {card.title}
            </h3>

            <p className="text-2xl md:text-3xl font-bold mt-2 text-black">
              {card.value}
            </p>
          </div>

          {/* Button */}
          <Link to={`/admin${card.path}`}>
            <button className="mt-5 w-full py-2 rounded-xl bg-black text-white text-sm hover:bg-gray-800 transition">
              {card.action}
            </button>
          </Link>
        </div>
      ))}
    </section>
  );
}