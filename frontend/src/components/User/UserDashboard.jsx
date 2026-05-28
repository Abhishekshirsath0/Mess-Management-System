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

/* ---------------- PLANS ---------------- */
const PLANS = {
  BASIC: { price: 1800, meals: ["dinner"] },
  STANDARD: { price: 3600, meals: ["lunch", "dinner"] },
  PREMIUM: { price: 4200, meals: ["breakfast", "lunch", "dinner"] },
};

/* ---------------- USER ---------------- */
const user = {
  name: "Abhishek",
  plan: "STANDARD",
  paymentStatus: "Paid",
  tiffins: 48,
  bill: 3600,
  address: "Nashik Road",
};

/* ---------------- MEAL DATA ---------------- */
const mealData = {
  lunch: ["Dal", "Rice", "Chapati", "Sabzi"],
  dinnerVeg: ["Dal", "Rice", "Chapati", "Paneer Curry"],
  dinnerNonVeg: ["Rice", "Chapati", "Chicken Curry"],
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
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const userCards = [
    {
      title: "Payment Status",
      value: user.paymentStatus,
      subtitle: "Current Month",
      icon: <Wallet size={22} />,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Total Tiffins",
      value: user.tiffins,
      subtitle: "This Month",
      icon: <UtensilsCrossed size={22} />,
      bg: "bg-orange-100",
      color: "text-orange-600",
    },
    {
      title: "Total Bill",
      value: `₹${user.bill}`,
      subtitle: `Plan ₹${PLANS[user.plan].price}`,
      icon: <Receipt size={22} />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Address",
      value: user.address,
      subtitle: "Delivery Location",
      icon: <MapPin size={22} />,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome, {user.name}
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

            <p className="text-2xl font-bold mt-2 break-words">
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

  <h1 className="text-lg text-black md:text-righ ml-5">
    {today}
  </h1>
</div>

            <p className="text-gray-500 text-sm mt-1">
              Plan: {user.plan} 
            </p>
          </div>

          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            Active Menu
          </div>
        </div>

        {/* LUNCH */}
        <div className="rounded-2xl border p-5 bg-gradient-to-r from-orange-50 to-white mb-6">
          <h3 className="text-lg font-semibold mb-3">🍛 Lunch</h3>

          <div className="flex flex-wrap gap-2">
            {mealData.lunch.map((item, i) => (
              <span key={i} className={getFoodStyle("lunch")}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* DINNER */}
        <div className="grid md:grid-cols-2 gap-4">

          {/* VEG */}
          <div className="rounded-2xl border p-5 bg-gradient-to-br from-green-200 to-white">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              {mealIcons.veg} Veg Dinner
            </h4>

            <div className="flex flex-wrap gap-2">
              {mealData.dinnerVeg.map((item, i) => (
                <span key={i} className={getFoodStyle("veg")}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* NON VEG */}
          <div className="rounded-2xl border p-5 bg-gradient-to-br from-red-200 to-white">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              {mealIcons.nonveg} Non-Veg Dinner
            </h4>

            <div className="flex flex-wrap gap-2">
              {mealData.dinnerNonVeg.map((item, i) => (
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