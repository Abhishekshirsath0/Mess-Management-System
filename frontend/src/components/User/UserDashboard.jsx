import { useState, useEffect } from "react";
import {
  Wallet,
  UtensilsCrossed,
  Receipt,
  MapPin,
  Sun,
  CloudSun,
  Moon,
  CalendarDays,
} from "lucide-react";
import { getTodayMeal, getUserAttendanceStats } from "../../service";

/* ---------------- PLANS ---------------- */
const PLANS = {
  BASIC: { price: 1800, meals: ["dinner"] },
  STANDARD: { price: 3600, meals: ["lunch", "dinner"] },
  PREMIUM: { price: 4200, meals: ["breakfast", "lunch", "dinner"] },
};

/* ---------------- ICONS ---------------- */
const mealIcons = {
  lunch: <CloudSun size={18} className="text-orange-600" />,
  veg: <Sun size={18} className="text-green-800" />,
  nonveg: <Moon size={18} className="text-red-600" />,
};

/* ---------------- STYLE FUNCTION (ALL FOOD) ---------------- */
const getFoodStyle = (type) => {
  const base =
    "px-3 py-1 rounded-lg text-sm font-medium shadow-sm transition";

  if (type === "lunch") {
    return `${base} bg-orange-100 text-orange-800`;
  }
  if (type === "veg") {
    return `${base} bg-green-100 text-green-800`;
  }
  if (type === "nonveg") {
    return `${base} bg-red-100 text-red-800`;
  }

  return `${base} bg-gray-100 text-gray-700`;
};

export default function UserDashboard() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: "Abhishek",
      plan: "STANDARD",
      paymentStatus: "Paid",
      address: "Nashik Road",
      paid: 3600,
    };
  });

  const [tiffinCount, setTiffinCount] = useState(0);
  const [todayMenu, setTodayMenu] = useState({
    lunch: [],
    dinnerVeg: [],
    dinnerNonVeg: [],
  });

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load meal
        const meal = await getTodayMeal();
        if (meal) {
          setTodayMenu({
            lunch: [...(meal.lunch?.veg || []), ...(meal.lunch?.nonVeg || [])],
            dinnerVeg: meal.dinner?.veg || [],
            dinnerNonVeg: meal.dinner?.nonVeg || [],
          });
        }
      } catch (err) {
        console.error("Error loading today's meal:", err);
      }

      try {
        // Load attendance stats if user id is available
        if (currentUser.id) {
          const stats = await getUserAttendanceStats(currentUser.id);
          if (stats) {
            setTiffinCount(stats.totalTiffins || 0);
          }
        }
      } catch (err) {
        console.error("Error loading attendance stats:", err);
      }
    };

    loadData();
  }, [currentUser]);

  const planInfo = PLANS[currentUser.plan] || PLANS.STANDARD;
  const billAmount = currentUser.paid || planInfo.price;

  const userCards = [
    {
      title: "Payment Status",
      value: currentUser.paymentStatus || "Paid",
      subtitle: "Current Month",
      icon: <Wallet size={22} />,
      bg: currentUser.paymentStatus === "Pending" ? "bg-red-100" : "bg-green-100",
      color: currentUser.paymentStatus === "Pending" ? "text-red-600" : "text-green-600",
    },
    {
      title: "Total Tiffins",
      value: tiffinCount,
      subtitle: "This Month",
      icon: <UtensilsCrossed size={22} />,
      bg: "bg-orange-100",
      color: "text-orange-600",
    },
    {
      title: "Total Bill",
      value: `₹${billAmount}`,
      subtitle: `Plan ₹${planInfo.price}`,
      icon: <Receipt size={22} />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Address",
      value: currentUser.address || "Nashik Road",
      subtitle: "Delivery Location",
      icon: <MapPin size={22} />,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
  ];

  const lunchItems = todayMenu.lunch.length > 0 ? todayMenu.lunch : ["Dal", "Rice", "Chapati", "Sabzi"];
  const dinnerVegItems = todayMenu.dinnerVeg.length > 0 ? todayMenu.dinnerVeg : ["Dal", "Rice", "Chapati", "Paneer Curry"];
  const dinnerNonVegItems = todayMenu.dinnerNonVeg.length > 0 ? todayMenu.dinnerNonVeg : ["Rice", "Chapati", "Chicken Curry"];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome, {currentUser.name}
          </h1>

          <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm">
            <CalendarDays size={16} />
            <span>{today}</span>
          </div>
        </div>
      </div>

      {/* CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {userCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg} ${card.color}`}
              >
                {card.icon}
              </div>

              <span className="text-xs text-gray-500">
                {card.subtitle}
              </span>
            </div>

            <h3 className="text-sm uppercase tracking-wide text-gray-500">
              {card.title}
            </h3>

            <p className="text-2xl font-bold mt-2 wrap-break-word">
              {card.value}
            </p>
          </div>
        ))}
      </section>

      {/* MEALS */}
      <section className="bg-white rounded-2xl border shadow-sm p-6">

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h2 className="text-2xl font-bold">Today's Meal</h2>
              <h1 className="text-lg text-black md:text-right ml-5">
                {today}
              </h1>
            </div>

            <p className="text-gray-500 text-sm mt-1">
              Plan: {currentUser.plan || "STANDARD"} 
            </p>
          </div>

          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            Active Menu
          </div>
        </div>

        {/* LUNCH */}
        <div className="rounded-2xl border p-5 bg-linear-to-r from-orange-50 to-white mb-6">
          <h3 className="text-lg font-semibold mb-3">🍛 Lunch</h3>

          <div className="flex flex-wrap gap-2">
            {lunchItems.map((item, i) => (
              <span key={i} className={getFoodStyle("lunch")}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* DINNER */}
        <div className="grid md:grid-cols-2 gap-4">

          {/* VEG */}
          <div className="rounded-2xl border p-5 bg-linear-to-br from-green-200 to-white">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              {mealIcons.veg} Veg Dinner
            </h4>

            <div className="flex flex-wrap gap-2">
              {dinnerVegItems.map((item, i) => (
                <span key={i} className={getFoodStyle("veg")}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* NON VEG */}
          <div className="rounded-2xl border p-5 bg-linear-to-br from-red-200 to-white">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              {mealIcons.nonveg} Non-Veg Dinner
            </h4>

            <div className="flex flex-wrap gap-2">
              {dinnerNonVegItems.map((item, i) => (
                <span key={i} className={getFoodStyle("nonveg")}>
                  {item}
                </span>
              ))}
            </div>
          </div>

        </div>

      </section>
    </div>
  );
}