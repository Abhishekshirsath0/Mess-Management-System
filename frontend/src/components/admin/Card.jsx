import { useState, useEffect } from "react";
import {
  CalendarCheck,
  CalendarOff,
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

        const presentCount = records.filter(
          (r) => r.status === "present"
        ).length;

        const totalPaid = users.reduce(
          (acc, u) => acc + (u.paid || 0),
          0
        );

        const pendingUsers = users.filter(
          (u) => u.paymentStatus === "Pending"
        ).length;

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
      icon: <CalendarCheck size={22} strokeWidth={2.5} />,
      action: "View Attendance",
      path: "/attendance",
    },
    {
      title: "History",
      value: stats.historyVal,
      subtitle: stats.historySub,
      icon: <History size={22} strokeWidth={2.5} />,
      action: "View History",
      path: "/history",
    },
    {
      title: "Calendar",
      value: "Member Calendar",
      subtitle: "Individual Tracking",
      icon: <CalendarCheck size={22} strokeWidth={2.5} />,
      action: "Open Calendar",
      path: "/calendar",
    },
    {
      title: "Meals",
      value: stats.mealsVal,
      subtitle: stats.mealsSub,
      icon: <UtensilsCrossed size={22} strokeWidth={2.5} />,
      action: "Edit Meals",
      path: "/meals",
    },
    {
      title: "Members",
      value: stats.membersVal,
      subtitle: stats.membersSub,
      icon: <Users size={22} strokeWidth={2.5} />,
      action: "Open Members",
      path: "/members",
    },
    {
      title: "Payments",
      value: stats.paymentsVal,
      subtitle: stats.paymentsSub,
      icon: <Wallet size={22} strokeWidth={2.5} />,
      action: "View Payments",
      path: "/payments",
    },
  ];

  return (
    <section
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-5
        md:gap-6
        w-full
      "
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className="
            group
            min-h-[230px]
            bg-white
            dark:bg-slate-900
            border-2
            border-black
            dark:border-slate-700
            rounded-2xl
            p-5
            md:p-6
            shadow-sm
            hover:shadow-lg
            hover:-translate-y-1
            transition-all
            duration-300
            flex
            flex-col
          "
        >
          {/* HEADER */}
          <div className="flex items-start justify-between gap-4">
            {/* Icon */}
            <div
              className="
                shrink-0
                w-12
                h-12
                rounded-xl
                bg-black
                text-white
                flex
                items-center
                justify-center
                group-hover:scale-105
                transition-transform
                duration-300
              "
            >
              {card.icon}
            </div>

            {/* Subtitle */}
            <span
              className="
                text-xs
                md:text-sm
                font-semibold
                text-right
                leading-5
                text-black
                dark:text-gray-300
              "
            >
              {card.subtitle}
            </span>
          </div>

          {/* CONTENT */}
          <div className="mt-6 flex-1">
            <h3
              className="
                text-xs
                md:text-sm
                uppercase
                tracking-wider
                font-bold
                text-black
                dark:text-gray-400
              "
            >
              {card.title}
            </h3>

            <p
              className="
                mt-2
                text-2xl
                md:text-3xl
                font-black
                tracking-tight
                text-black
                dark:text-white
                break-words
              "
            >
              {card.value}
            </p>
          </div>

          {/* BUTTON */}
          <Link
            to={`/admin${card.path}`}
            className="block mt-6"
          >
            <button
              className="
                w-full
                h-11
                rounded-xl
                bg-black
                text-white
                text-sm
                font-bold
                border-2
                border-black
                hover:bg-white
                hover:text-black
                dark:hover:bg-slate-800
                transition-all
                duration-200
                cursor-pointer
              "
            >
              {card.action}
            </button>
          </Link>
        </div>
      ))}
    </section>
  );
}