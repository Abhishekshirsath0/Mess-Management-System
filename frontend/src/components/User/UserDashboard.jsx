import { useState, useEffect } from "react";
import { RingLoader } from "react-spinners"
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
import { useTheme } from "../../context/ThemeContext";

/* ---------------- PLANS ---------------- */
const PLANS = {
  BASIC: { price: 1800, meals: ["dinner"] },
  STANDARD: { price: 3600, meals: ["lunch", "dinner"] },
  PREMIUM: { price: 4200, meals: ["breakfast", "lunch", "dinner"] },
};

/* ---------------- ICONS ---------------- */
const mealIcons = {
  lunch: (
    <CloudSun size={18} className="text-orange-700 dark:text-orange-400" />
  ),
  veg: <Sun size={18} className="text-green-700 dark:text-green-400" />,
  nonveg: <Moon size={18} className="text-red-700 dark:text-red-400" />,
};

/* ---------------- STYLE FUNCTION (ALL FOOD) ---------------- */
const getFoodStyle = (type) => {
  const base =
    "px-3.5 py-1.5 rounded-xl text-sm font-bold shadow-xs transition-all text-black";

  if (type === "lunch") {
    return `${base} bg-orange-100/90 border border-orange-200 dark:bg-orange-950/80 dark:text-orange-100 dark:border-orange-800/80`;
  }
  if (type === "veg") {
    return `${base} bg-green-100/90 border border-green-200 dark:bg-green-950/80 dark:text-green-100 dark:border-green-800/80`;
  }
  if (type === "nonveg") {
    return `${base} bg-red-100/90 border border-red-200 dark:bg-red-950/80 dark:text-red-100 dark:border-red-800/80`;
  }

  return `${base} bg-gray-100 border border-gray-200 dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700`;
};

export default function UserDashboard() {
  const { theme } = useTheme();

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { }
    }
    return {
      name: "Abhishek",
      plan: "STANDARD",
      PaymentStatus
: "Paid",
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
  const [menuLoaded, setMenuLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
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
        setLoading(false);
      } catch (err) {
        console.error("Error loading today's meal:", err);
      } finally {
        setMenuLoaded(true);
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
      title: "Total Bill",
      value: `₹${billAmount}`,
      subtitle: `Plan ₹${planInfo.price}`,
      icon: <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />,
      bg: "bg-blue-100 dark:bg-blue-950",
      color: "text-blue-700 dark:text-blue-300",
    },
    {
      title: "Total Tiffins",
      value: tiffinCount,
      subtitle: "This Month",
      icon: <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5" />,
      bg: "bg-orange-100 dark:bg-orange-950",
      color: "text-orange-700 dark:text-orange-300",
    },
    {
      title: "Payment Status",
      value: currentUser.PaymentStatus

 || "Paid",
      subtitle: "Current Month",
      icon: <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />,
      bg:
        currentUser.PaymentStatus
 === "Pending" ? "bg-red-100 dark:bg-red-950" : "bg-green-100 dark:bg-green-950",
      color:
        currentUser.PaymentStatus
 === "Pending"
          ? "text-red-700 dark:text-red-300"
          : "text-green-700 dark:text-green-300",
    },
    {
      title: "Address",
      value: currentUser.address || "Nashik Road",
      subtitle: "Delivery Location",
      icon: <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />,
      bg: "bg-purple-100 dark:bg-purple-950",
      color: "text-purple-700 dark:text-purple-300",
    },
  ];

  const lunchItems = todayMenu.lunch;
  const dinnerVegItems = todayMenu.dinnerVeg;
  const dinnerNonVegItems = todayMenu.dinnerNonVeg;
  if (loading) {
    <div className="flex justify-center items-center h-full">
      <RingLoader color={"#ffffffff"} />
    </div>
  }
  const NotUpdated = () => (
    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium italic">
      Menu not updated yet
    </p>
  );

  const cardBgStyle = {
    backgroundColor: theme === "light" ? "#faf9f5" : "#0b1328",
  };

  return (

    <div className="space-y-6 text-black dark:text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
            Welcome, {currentUser.name}
          </h1>

          <div className="flex items-center gap-2 text-black/80 dark:text-gray-300 mt-1 text-sm font-medium">
            <CalendarDays size={16} />
            <span>{today}</span>
          </div>
        </div>
      </div>

      {/* CARDS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {userCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-3.5 sm:p-5 border border-gray-200 dark:border-slate-800 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-1 mb-2 sm:mb-4">
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold shrink-0 ${card.bg} ${card.color}`}
              >
                {card.icon}
              </div>

              <span className="text-[10px] sm:text-xs font-semibold text-black/80 dark:text-gray-300 truncate">
                {card.subtitle}
              </span>
            </div>

            <div>
              <h3 className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-black/80 dark:text-gray-300 truncate">
                {card.title}
              </h3>

              <p className="text-base sm:text-2xl font-black mt-0.5 sm:mt-1 text-black dark:text-gray-50 truncate">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* MEALS */}
      <section className="bg-white rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h2 className="text-2xl font-bold text-black dark:text-gray-50">
                Today's Meal
              </h2>
              <h1 className="text-lg text-black dark:text-gray-200 font-semibold md:text-right md:ml-4">
                {today}
              </h1>
            </div>

            <p className="text-black/80 dark:text-gray-300 text-sm mt-1 font-medium">
              Plan: {currentUser.plan || "STANDARD"}
            </p>
          </div>

          <div className="bg-green-100 dark:bg-green-100 text-green-100 dark:text-green-200 px-4 py-2 rounded-full text-sm font-bold border border-green-300 dark:border-green-800">
            Active Menu
          </div>
        </div>

        {/* LUNCH */}
        <div
          style={cardBgStyle} 
          className="rounded-2xl border border-gray-200 dark:border-slate-700/80 p-5 mb-6 shadow-xs transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-black text-black dark:text-orange flex items-center gap-2">
              🍛 Lunch
            </h3>
            <span className="text-sm font-bold text-black dark:text-slate-200">
              8:00 AM - 3:00 PM
            </span>
          </div>

          {menuLoaded && lunchItems.length === 0 ? (
            <NotUpdated />
          ) : (
            <div className="flex flex-wrap gap-2">
              {lunchItems.map((item, i) => (
                <span key={i} className={getFoodStyle("lunch")}>
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* DINNER */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* VEG */}
          <div
            style={cardBgStyle}
            className="rounded-2xl border border-gray-200 dark:border-slate-700/80 p-5 shadow-xs transition-colors"
          >
            <h4 className="font-black text-black dark:text-green-400 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 text-black dark:text-green-400 font-black">
                {mealIcons.veg} Veg Dinner
              </span>
              <span className="text-sm font-bold text-black dark:text-slate-200">
                7:00 PM - 10:00 PM
              </span>
            </h4>

            {menuLoaded && dinnerVegItems.length === 0 ? (
              <NotUpdated />
            ) : (
              <div className="flex flex-wrap gap-2">
                {dinnerVegItems.map((item, i) => (
                  <span key={i} className={getFoodStyle("veg")}>
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* NON VEG */}
          <div
            style={cardBgStyle}
            className="rounded-2xl border border-gray-200 dark:border-slate-700/80 p-5 shadow-xs transition-colors"
          >
            <h4 className="font-black text-black dark:text-red-400 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 text-black dark:text-red-400 font-black">
                {mealIcons.nonveg} Non-Veg Dinner
              </span>
              <span className="text-sm font-bold text-black dark:text-slate-200">
                7:00 PM - 10:00 PM
              </span>
            </h4>

            {menuLoaded && dinnerNonVegItems.length === 0 ? (
              <NotUpdated />
            ) : (
              <div className="flex flex-wrap gap-2">
                {dinnerNonVegItems.map((item, i) => (
                  <span key={i} className={getFoodStyle("nonveg")}>
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}