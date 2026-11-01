import { useState, useEffect } from "react";
import { postMeal, getMeals } from "../../../service";
import { RingLoader } from "react-spinners";
import { useToast } from "../../../context/ToastContext";
import { Calendar, Repeat, Utensils } from "lucide-react";

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Formats a Date object as YYYY-MM-DD using LOCAL date parts
const formatLocalDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Returns the Monday of the current week, shifted by weekOffset weeks
const getMondayOfWeek = (weekOffset = 0) => {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday, 1 = Monday, ...
  const diffToMonday = day === 0 ? -6 : 1 - day; // shift Sunday back to previous Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

// Builds 7 cards (Mon–Sun) with dates computed from the given week
const buildWeekTemplate = (weekOffset) => {
  const monday = getMondayOfWeek(weekOffset);

  return DAY_NAMES.map((day, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);

    return {
      id: `day-${i}`, // stable id per weekday slot
      day,
      date: formatLocalDate(date),
      veg: [],
      nonVeg: [],
      dbId: null, // holds MongoDB _id once saved/fetched
    };
  });
};

export const Edit_Meal = () => {
  const { showSuccess, showError } = useToast();
  const [mealType, setMealType] = useState("Lunch");
  const [weekOffset, setWeekOffset] = useState(0); // 0 = this week, 1 = next week, -1 = last week
  const [meals, setMeals] = useState(() => buildWeekTemplate(0));
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  // Fetch the persistent recurring schedule from DB whenever week or mealType changes
  useEffect(() => {
    let cancelled = false;

    const fetchMeals = async () => {
      setLoading(true);
      const template = buildWeekTemplate(weekOffset);

      try {
        const saved = await getMeals();
        const field = mealType.toLowerCase(); // "lunch" or "dinner"

        if (cancelled) return;

        const merged = template.map((slot) => {
          // Match by persistent weekday first; fallback to date for legacy records
          const match = (saved || []).find(
            (m) =>
              (m.day && m.day.toLowerCase() === slot.day.toLowerCase()) ||
              (m.weekday && m.weekday.toLowerCase() === slot.day.toLowerCase()) ||
              (m.date && formatLocalDate(new Date(m.date)) === slot.date)
          );

          if (match) {
            return {
              ...slot,
              dbId: match._id,
              veg: match[field]?.veg?.length ? match[field].veg : [],
              nonVeg: match[field]?.nonVeg?.length ? match[field].nonVeg : [],
            };
          }

          return slot;
        });

        setMeals(merged);
      } catch (error) {
        console.error("Failed to load meals:", error);
        if (!cancelled) {
          setMeals(template);
          if (showError) showError("Failed to load weekly meal schedule.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMeals();

    return () => {
      cancelled = true;
    };
  }, [weekOffset, mealType]);

  const handleMenuChange = (id, category, index, value) => {
    setMeals((prev) =>
      prev.map((meal) => {
        if (meal.id !== id) return meal;

        const updated = [...meal[category]];
        updated[index] = value;

        return { ...meal, [category]: updated };
      })
    );
  };

  const addMenuItem = (id, category) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.id === id
          ? { ...meal, [category]: [...meal[category], ""] }
          : meal
      )
    );
  };

  const removeMenuItem = (id, category, index) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.id === id
          ? {
              ...meal,
              [category]: meal[category].filter((_, i) => i !== index),
            }
          : meal
      )
    );
  };

  const handleSaveCard = async (meal) => {
    const cleanedVeg = meal.veg.map((item) => item.trim()).filter(Boolean);
    const cleanedNonVeg = meal.nonVeg.map((item) => item.trim()).filter(Boolean);

    if (cleanedVeg.length === 0 && cleanedNonVeg.length === 0) {
      if (showError) {
        showError("Please add at least one menu item.");
      } else {
        alert("Please add at least one menu item.");
      }
      return;
    }

    setSavingId(meal.id);

    try {
      const saved = await postMeal(
        {
          day: meal.day,
          weekday: meal.day,
          date: meal.date,
          veg: cleanedVeg,
          nonVeg: cleanedNonVeg,
        },
        mealType
      );

      setMeals((prev) =>
        prev.map((m) =>
          m.id === meal.id
            ? {
                ...m,
                dbId: saved._id,
                veg: cleanedVeg,
                nonVeg: cleanedNonVeg,
              }
            : m
        )
      );

      const successMsg = `Recurring ${meal.day} (${mealType}) saved successfully.`;
      if (showSuccess) {
        showSuccess(successMsg);
      } else {
        alert(successMsg);
      }
    } catch (error) {
      console.error("[handleSaveCard Error]:", error);
      const errMsg = error.message || `Failed to save ${meal.day}`;
      if (showError) {
        showError(errMsg);
      } else {
        alert(errMsg);
      }
    } finally {
      setSavingId(null);
    }
  };

  const monday = getMondayOfWeek(weekOffset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const weekLabel = `${monday.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  })} – ${sunday.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;

  return (
    <div className="w-full min-h-screen bg-transparent dark:bg-slate-950 p-6 text-gray-900 dark:text-white transition-colors">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Weekly Meal Management</h1>
            <span className="inline-flex items-center gap-1 text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
              <Repeat className="w-3.5 h-3.5" /> Recurring Schedule
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Meals repeat every week on their configured day • Week: {weekLabel}
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            ← Prev Week
          </button>

          <button
            onClick={() => setWeekOffset(0)}
            className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            This Week
          </button>

          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Next Week →
          </button>

          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl text-gray-800 dark:text-gray-200 font-medium cursor-pointer shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="Lunch" className="bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200">
              Lunch
            </option>
            <option value="Dinner" className="bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200">
              Dinner
            </option>
          </select>
        </div>
      </div>

      {/* CARDS */}
      {loading ? (
        <div className="flex justify-center items-center h-[70vh]">
          <RingLoader color="#000000" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm transition-colors"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{meal.day}</h2>
                    
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Every {meal.day} • {new Date(meal.date + "T00:00:00").toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "short", year: "numeric" }
                    )}
                  </p>
                </div>

                <span className="inline-flex items-center bg-black dark:bg-slate-800 text-white px-3 py-1 rounded-lg text-xs font-semibold leading-none h-fit">
                  {mealType}
                </span>
              </div>

              {/* VEG */}
              <div className="mb-5">
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold text-green-600 dark:text-green-400">Veg</h3>

                  <button
                    onClick={() => addMenuItem(meal.id, "veg")}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition cursor-pointer"
                  >
                    + Add
                  </button>
                </div>

                {meal.veg.length === 0 && (
                  <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">No veg items yet.</p>
                )}

                {meal.veg.map((item, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      value={item}
                      placeholder="Enter veg item"
                      onChange={(e) =>
                        handleMenuChange(meal.id, "veg", i, e.target.value)
                      }
                      className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white flex-1 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <button
                      onClick={() => removeMenuItem(meal.id, "veg", i)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 rounded-lg transition cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* NON VEG */}
              <div className="mb-5">
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold text-red-600 dark:text-red-400">Non Veg</h3>

                  <button
                    onClick={() => addMenuItem(meal.id, "nonVeg")}
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition cursor-pointer"
                  >
                    + Add
                  </button>
                </div>

                {meal.nonVeg.length === 0 && (
                  <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">
                    No non-veg items yet.
                  </p>
                )}

                {meal.nonVeg.map((item, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      value={item}
                      placeholder="Enter non-veg item"
                      onChange={(e) =>
                        handleMenuChange(meal.id, "nonVeg", i, e.target.value)
                      }
                      className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white flex-1 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                    />

                    <button
                      onClick={() => removeMenuItem(meal.id, "nonVeg", i)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 rounded-lg transition cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* SAVE */}
              <button
                onClick={() => handleSaveCard(meal)}
                disabled={savingId === meal.id}
                className="w-full bg-black dark:bg-slate-800 text-white py-3 rounded-2xl font-medium hover:bg-gray-800 dark:hover:bg-slate-700 transition disabled:opacity-50 cursor-pointer"
              >
                {savingId === meal.id ? "Saving..." : `Save ${meal.day}`}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};