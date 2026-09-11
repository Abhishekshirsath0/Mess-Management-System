import { useState, useEffect, useCallback } from "react";
import Footer from "../common/Footer.jsx";
import {
  Wallet,
  UtensilsCrossed,
  Receipt,
  MapPin,
  Sun,
  CloudSun,
  Moon,
  CalendarDays,
  WifiOff,
  SignalLow,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import {
  getTodayMeal,
  getUserAttendanceStats,
  getUserMealAssignment,
  getUserAttendanceForUserAndDate,
  postUserMealSelection,
} from "../../service";
import { useTheme } from "../../context/ThemeContext";

/* ---------------- PLANS ---------------- */
const PLANS = {
  BASIC: { price: 1800, meals: ["dinner"] },
  STANDARD: { price: 3600, meals: ["lunch", "dinner"] },
  PREMIUM: { price: 4200, meals: ["breakfast", "lunch", "dinner"] },
};

const getTodayDateStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

/* ---------------- SKELETON PRIMITIVES ---------------- */
const Bone = ({ className = "" }) => (
  <div
    className={`animate-pulse rounded-md bg-gray-200 dark:bg-slate-700/80 ${className}`}
  />
);

const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-gray-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
    <div className="flex items-center justify-between gap-1 mb-2 sm:mb-4">
      <Bone className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl shrink-0" />
      <Bone className="h-3 w-14 sm:w-16" />
    </div>
    <div className="space-y-2">
      <Bone className="h-2.5 w-20" />
      <Bone className="h-5 sm:h-7 w-24 sm:w-28" />
    </div>
  </div>
);

const SkeletonChips = ({ count = 3 }) => (
  <div className="flex flex-wrap gap-2">
    {Array.from({ length: count }).map((_, i) => (
      <Bone
        key={i}
        className="h-8 rounded-xl"
        style={{ width: `${64 + ((i * 23) % 50)}px` }}
      />
    ))}
  </div>
);

const SkeletonMealBlock = ({ chips = 3 }) => (
  <div className="rounded-2xl border border-gray-200 dark:border-slate-700/80 p-5 shadow-xs">
    <div className="flex items-center justify-between mb-3">
      <Bone className="h-5 w-28" />
      <Bone className="h-4 w-32" />
    </div>
    <SkeletonChips count={chips} />
  </div>
);

const OfflineBanner = () => (
  <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm font-semibold px-4 py-2.5 rounded-xl">
    <WifiOff size={16} className="shrink-0" />
    <span>You're offline. Showing the last data we loaded.</span>
  </div>
);

const SlowNetworkNotice = () => (
  <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-sm font-semibold px-4 py-2.5 rounded-xl animate-pulse">
    <SignalLow size={16} className="shrink-0" />
    <span>Slow connection detected — still loading your dashboard…</span>
  </div>
);

const DashboardSkeleton = ({ isOffline, isSlow }) => (
  <div className="space-y-6 text-black dark:text-white">
    {isOffline && <OfflineBanner />}
    {!isOffline && isSlow && <SlowNetworkNotice />}

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="space-y-2">
        <Bone className="h-8 w-56" />
        <Bone className="h-4 w-40" />
      </div>
    </div>

    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </section>

    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Bone className="h-7 w-40" />
          <Bone className="h-4 w-28" />
        </div>
        <Bone className="h-9 w-28 rounded-full" />
      </div>

      <SkeletonMealBlock chips={4} />

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <SkeletonMealBlock chips={3} />
        <SkeletonMealBlock chips={3} />
      </div>
    </section>
  </div>
);

const NotUpdated = () => (
  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 italic">
    Menu for today has not been updated yet.
  </p>
);

export default function UserDashboard() {
  const { theme } = useTheme();

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
      PaymentStatus: "Paid",
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
  const [activeMealAssignment, setActiveMealAssignment] = useState(null);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [slowLoading, setSlowLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );

  // Date-based persistent meal selection state
  const [selectedDate, setSelectedDate] = useState(getTodayDateStr());
  const [dateMealState, setDateMealState] = useState({
    lunch: false,
    dinner: false,
    extraTiffin: 0,
    hasCustomRecord: false,
  });
  const [savingMealSelection, setSavingMealSelection] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const SLOW_LOAD_THRESHOLD = 4000;

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch date-based meal selection from DB
  const loadDateMealSelection = useCallback(async (dateStr, userId, activeAssign) => {
    if (!userId || !dateStr) return;
    try {
      const rec = await getUserAttendanceForUserAndDate(userId, dateStr);
      if (rec) {
        setDateMealState({
          lunch: Boolean(rec.lunch),
          dinner: Boolean(rec.dinner),
          extraTiffin: rec.extraTiffin || 0,
          hasCustomRecord: true,
        });
      } else {
        // Fallback default from active meal assignment if any
        const defaultLunch = activeAssign === "Lunch" || activeAssign === "Both";
        const defaultDinner = activeAssign === "Dinner" || activeAssign === "Both";
        setDateMealState({
          lunch: defaultLunch,
          dinner: defaultDinner,
          extraTiffin: 0,
          hasCustomRecord: false,
        });
      }
    } catch (err) {
      console.error("Failed to load meal selection for date:", err);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setSlowLoading(false);

      const slowTimer = setTimeout(() => {
        if (!cancelled) setSlowLoading(true);
      }, SLOW_LOAD_THRESHOLD);

      try {
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

      let currentAssign = null;
      if (currentUser.id) {
        try {
          const stats = await getUserAttendanceStats(currentUser.id);
          if (stats) {
            setTiffinCount(stats.totalTiffins || 0);
          }
        } catch (err) {
          console.error("Error loading attendance stats:", err);
        }

        try {
          const assignment = await getUserMealAssignment(currentUser.id);
          if (assignment && assignment.status === "active") {
            currentAssign = assignment.mealType;
            setActiveMealAssignment(assignment.mealType);
          } else {
            setActiveMealAssignment(null);
          }
        } catch (err) {
          console.error("Error loading user meal assignment:", err);
        }

        await loadDateMealSelection(selectedDate, currentUser.id, currentAssign);
      }

      clearTimeout(slowTimer);
      if (!cancelled) {
        setMenuLoaded(true);
        setLoading(false);
        setSlowLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [currentUser, selectedDate, loadDateMealSelection]);

  const handleToggleMeal = async (type) => {
    if (!currentUser.id || savingMealSelection) return;
    const newLunch = type === "lunch" ? !dateMealState.lunch : dateMealState.lunch;
    const newDinner = type === "dinner" ? !dateMealState.dinner : dateMealState.dinner;

    setSavingMealSelection(true);
    try {
      await postUserMealSelection({
        date: selectedDate,
        lunch: newLunch,
        dinner: newDinner,
        extraTiffin: dateMealState.extraTiffin,
      });

      setDateMealState({
        lunch: newLunch,
        dinner: newDinner,
        extraTiffin: dateMealState.extraTiffin,
        hasCustomRecord: true,
      });

      const updatedStats = await getUserAttendanceStats(currentUser.id).catch(() => null);
      if (updatedStats) {
        setTiffinCount(updatedStats.totalTiffins || 0);
      }
    } catch (err) {
      alert("Failed to save meal selection for selected date.");
    } finally {
      setSavingMealSelection(false);
    }
  };

  const handleShiftDate = (offsetDays) => {
    const d = new Date(selectedDate + "T00:00:00.000Z");
    d.setUTCDate(d.getUTCDate() + offsetDays);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    setSelectedDate(`${year}-${month}-${day}`);
  };

  const planInfo = PLANS[currentUser.plan] || PLANS.STANDARD;
  const billAmount = currentUser.paid || planInfo.price;

  const userCards = [
    {
      title: "Total Bill",
      value: `₹${billAmount}`,
      subtitle: `Plan ₹${planInfo.price}`,
      icon: <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-white" />,
      bg: "bg-black text-white dark:bg-slate-800",
      color: "text-white",
    },
    {
      title: "Total Tiffins",
      value: tiffinCount,
      subtitle: "This Month",
      icon: <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-white" />,
      bg: "bg-black text-white dark:bg-slate-800",
      color: "text-white",
    },
    {
      title: "Deposited",
      value: `₹${currentUser.deposit || 0}`,
      subtitle: "Admin Deposited",
      icon: <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800 dark:text-emerald-300" />,
      bg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800",
      color: "text-emerald-700 dark:text-emerald-400",
    },
    {
      title: "Payment Status",
      value: currentUser.PaymentStatus || "Paid",
      subtitle: "Current Month",
      icon: <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />,
      bg:
        currentUser.PaymentStatus === "Pending"
          ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-300"
          : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border border-green-300",
      color: "",
    },
    {
      title: "Address",
      value: currentUser.address || "Nashik Road",
      subtitle: "Delivery Location",
      icon: <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-white" />,
      bg: "bg-black text-white dark:bg-slate-800",
      color: "text-white",
    },
  ];

  const lunchItems = todayMenu.lunch;
  const dinnerVegItems = todayMenu.dinnerVeg;
  const dinnerNonVegItems = todayMenu.dinnerNonVeg;

  const cardBgStyle =
    theme === "dark"
      ? { backgroundColor: "#0f172a" }
      : { backgroundColor: "#ffffff" };

  if (loading) {
    return <DashboardSkeleton isOffline={isOffline} isSlow={slowLoading} />;
  }

  const isLunchActive = activeMealAssignment === "Lunch" || activeMealAssignment === "Both";
  const isDinnerActive = activeMealAssignment === "Dinner" || activeMealAssignment === "Both";

  return (
    <>
      <div className="space-y-6 text-black dark:text-white">
        {isOffline && <OfflineBanner />}

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

        {/* RECURRING MEAL ASSIGNMENT BANNER */}
   

        {/* STATS CARDS */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {userCards.map((card, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border-2 border-black dark:border-slate-800 shadow-xs hover:shadow-md transition flex flex-col justify-between text-black dark:text-white"
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

        {/* PERSISTENT DAY-BASED MEAL SELECTION */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-500/80 dark:border-indigo-800 shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                Persistent Day-Based Meal Selection
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Select your meal choices per calendar day. Your selection is permanently saved in the database.
              </p>
            </div>

            {/* DATE CONTROLS */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShiftDate(-1)}
                className="p-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl border border-gray-300 dark:border-slate-700 text-gray-800 dark:text-gray-200 transition cursor-pointer"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                onClick={() => handleShiftDate(1)}
                className="p-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl border border-gray-300 dark:border-slate-700 text-gray-800 dark:text-gray-200 transition cursor-pointer"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSelectedDate(getTodayDateStr())}
                className="px-3 py-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold transition hover:bg-indigo-100 cursor-pointer"
              >
                Today
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LUNCH SELECTION */}
            <div className={`p-5 rounded-2xl border-2 transition-all ${
              dateMealState.lunch
                ? "bg-emerald-50/70 border-emerald-500 dark:bg-emerald-950/40 dark:border-emerald-700"
                : "bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700"
            }`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-extrabold text-base flex items-center gap-2 text-gray-900 dark:text-white">
                  🍛 Lunch Selection
                </h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${
                  dateMealState.lunch
                    ? "bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100"
                    : "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-300"
                }`}>
                  {dateMealState.lunch ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  {dateMealState.lunch ? "SELECTED" : "NOT SELECTED"}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                Date: <b className="text-gray-900 dark:text-white">{selectedDate}</b>
              </p>
              <button
                disabled={savingMealSelection}
                onClick={() => handleToggleMeal("lunch")}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  dateMealState.lunch
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    : "bg-gray-900 hover:bg-black text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                } disabled:opacity-50`}
              >
                {savingMealSelection ? "Saving..." : dateMealState.lunch ? "Unselect Lunch" : "Select Lunch"}
              </button>
            </div>

            {/* DINNER SELECTION */}
            <div className={`p-5 rounded-2xl border-2 transition-all ${
              dateMealState.dinner
                ? "bg-purple-50/70 border-purple-500 dark:bg-purple-950/40 dark:border-purple-700"
                : "bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700"
            }`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-extrabold text-base flex items-center gap-2 text-gray-900 dark:text-white">
                  🌙 Dinner Selection
                </h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${
                  dateMealState.dinner
                    ? "bg-purple-200 text-purple-900 dark:bg-purple-900 dark:text-purple-100"
                    : "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-300"
                }`}>
                  {dateMealState.dinner ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  {dateMealState.dinner ? "SELECTED" : "NOT SELECTED"}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                Date: <b className="text-gray-900 dark:text-white">{selectedDate}</b>
              </p>
              <button
                disabled={savingMealSelection}
                onClick={() => handleToggleMeal("dinner")}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  dateMealState.dinner
                    ? "bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                    : "bg-gray-900 hover:bg-black text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                } disabled:opacity-50`}
              >
                {savingMealSelection ? "Saving..." : dateMealState.dinner ? "Unselect Dinner" : "Select Dinner"}
              </button>
            </div>
          </div>
        </section>

        {/* MEALS DISPLAY */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                  Today's Menu
                </h2>
                <h1 className="text-lg text-gray-800 dark:text-gray-200 font-semibold md:text-right md:ml-4">
                  {today}
                </h1>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 font-medium">
                Plan: {currentUser.plan || "STANDARD"}
              </p>
            </div>

            <div className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-bold border border-green-300 dark:border-green-800">
              Active Menu
            </div>
          </div>

          {/* LUNCH CARD */}
          <div
            style={cardBgStyle}
            className={`rounded-2xl border p-5 mb-6 shadow-xs transition-all ${
              isLunchActive
                ? "border-orange-400 dark:border-orange-600 ring-2 ring-orange-400/30"
                : "border-gray-200 dark:border-slate-700/80"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-black dark:text-orange flex items-center gap-2">
                  🍛 Lunch
                </h3>
                {isLunchActive && (
                  <span className="text-xs font-bold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200 px-2.5 py-0.5 rounded-full border border-orange-300">
                    Assigned to You
                  </span>
                )}
              </div>
              <span className="text-sm font-bold text-black dark:text-slate-200">
                8:00 AM - 3:00 PM
              </span>
            </div>

            {menuLoaded && lunchItems.length === 0 ? (
              <NotUpdated />
            ) : (
                <div className="flex flex-wrap gap-2">
                  <div className="flex flex-wrap gap-2">
                    {lunchItems.map((item, i) => (
                      <span
                        key={i}
                        className={`${getFoodStyle("lunch")} !bg-yellow-500 dark:!bg-yellow-500`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
            )}
          </div>

          {/* DINNER CARDS */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* VEG DINNER */}
            <div
              style={cardBgStyle}
              className={`rounded-2xl border p-5 shadow-xs transition-all ${
                isDinnerActive
                  ? "border-green-400 dark:border-green-600 ring-2 ring-green-400/30"
                  : "border-gray-200 dark:border-slate-700/80"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-black dark:text-green-400 flex items-center gap-2">
                    {mealIcons.veg} Veg Dinner
                  </h4>
                  {isDinnerActive && (
                    <span className="text-xs font-bold bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200 px-2 py-0.5 rounded-full border border-green-300">
                      Assigned
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-black dark:text-slate-200">
                  7:00 PM - 10:00 PM
                </span>
              </div>

              {menuLoaded && dinnerVegItems.length === 0 ? (
                <NotUpdated />
              ) : (
                  <div className="flex flex-wrap gap-2">
                    {dinnerVegItems.map((item, i) => (
                      <span
                        key={i}
                        className={`${getFoodStyle("veg")} !bg-green-500 dark:!bg-green-500`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
              )}
            </div>

            {/* NON VEG DINNER */}
            <div
              style={cardBgStyle}
              className={`rounded-2xl border p-5 shadow-xs transition-all ${
                isDinnerActive
                  ? "border-red-400 dark:border-red-600 ring-2 ring-red-400/30"
                  : "border-gray-200 dark:border-slate-700/80"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-black dark:text-red-400 flex items-center gap-2">
                    {mealIcons.nonveg} Non-Veg Dinner
                  </h4>
                  {isDinnerActive && (
                    <span className="text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200 px-2 py-0.5 rounded-full border border-red-300">
                      Assigned
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-black dark:text-slate-200">
                  7:00 PM - 10:00 PM
                </span>
              </div>

              {menuLoaded && dinnerNonVegItems.length === 0 ? (
                <NotUpdated />
              ) : (
                  <div className="flex flex-wrap gap-2">
                    {dinnerNonVegItems.map((item, i) => (
                      <span
                        key={i}
                        className={`${getFoodStyle("nonveg")} !bg-red-500 dark:!bg-red-500`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}