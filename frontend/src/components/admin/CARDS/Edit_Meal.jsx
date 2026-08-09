import { useState, useEffect } from "react";
import { postMeal, getMeals } from "../../../service"; // adjust path to your api.js
import { RingLoader } from "react-spinners";

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
// (never use toISOString() for this — it converts to UTC first
// and can silently shift the date by a day depending on timezone)
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
      date: formatLocalDate(date), // FIXED: was date.toISOString().slice(0, 10)
      veg: [],
      nonVeg: [],
      dbId: null, // will hold the real MongoDB _id once saved/fetched
    };
  });
};

export const Edit_Meal = () => {
  const [mealType, setMealType] = useState("Lunch");
  const [weekOffset, setWeekOffset] = useState(0); // 0 = this week, 1 = next week, -1 = last week
  const [meals, setMeals] = useState(() => buildWeekTemplate(0));
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  // Rebuild the 7-day template whenever the week changes,
  // then merge in whatever's already saved for those exact dates
  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      const template = buildWeekTemplate(weekOffset);

      try {
        const saved = await getMeals();
        const field = mealType.toLowerCase(); // "lunch" or "dinner"

        const merged = template.map((slot) => {
          const match = saved.find(
            (m) => formatLocalDate(new Date(m.date)) === slot.date // FIXED: was toISOString
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
        setMeals(template); // fall back to empty template if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
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
    const cleanedMeal = {
      ...meal,
      veg: meal.veg.map((item) => item.trim()).filter(Boolean),
      nonVeg: meal.nonVeg.map((item) => item.trim()).filter(Boolean),
    };

    if (cleanedMeal.veg.length === 0 && cleanedMeal.nonVeg.length === 0) {
      alert("Please add at least one menu item.");
      return;
    }

    setSavingId(meal.id);

    try {
      const saved = await postMeal(cleanedMeal, mealType);

      setMeals((prev) =>
        prev.map((m) =>
          m.id === meal.id
            ? {
              ...m,
              dbId: saved._id,
              veg: cleanedMeal.veg,
              nonVeg: cleanedMeal.nonVeg,
            }
            : m
        )
      );

      alert(`${meal.day} (${mealType}) saved successfully.`);
    } catch (error) {
      console.error(error);
      alert(`Failed to save ${meal.day}`);
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
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold">Weekly Meal Management</h1>
          <p className="text-sm text-gray-500 mt-1">{weekLabel}</p>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="border px-3 py-2 rounded-xl hover:bg-blue-950 hover:text-white"
          >
            ← Prev Week
          </button>

          <button
            onClick={() => setWeekOffset(0)}
            className="border px-3 py-2 rounded-xl hover:bg-blue-950 hover:text-white"
          >
            This Week
          </button>

          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="border px-3 py-2 rounded-xl hover:bg-blue-950 hover:text-white"
          >
            Next Week →
          </button>

          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="border border-gray-300 bg-[#f5f5f0] px-4 py-2 rounded-xl text-gray-800 font-medium cursor-pointer shadow-sm transition-all duration-200 hover:bg-[#d9d9cf] hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="Lunch" className="hover:bg-blue-950 hover:text-white cursor-pointer">Lunch</option>
            <option value="Dinner" className="hover:bg-blue-950 hover:text-white cursor-pointer">Dinner</option>
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
              className="bg-white rounded-3xl border p-6 shadow-sm"
            >
              {/* HEADER */}
              <div className="flex justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{meal.day}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(meal.date + "T00:00:00").toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "short", year: "numeric" }
                    )}
                  </p>
                </div>

                <span className="inline-flex items-center bg-black text-white px-2 py-1 rounded-lg text-xs font-medium leading-none h-fit">
                  {mealType}
                </span>
              </div>

              {/* VEG */}
              <div className="mb-5">
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold text-green-600">Veg</h3>

                  <button
                    onClick={() => addMenuItem(meal.id, "veg")}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg"
                  >
                    + Add
                  </button>
                </div>

                {meal.veg.length === 0 && (
                  <p className="text-sm text-gray-400 mb-2">No veg items yet.</p>
                )}

                {meal.veg.map((item, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      value={item}
                      placeholder="Enter veg item"
                      onChange={(e) =>
                        handleMenuChange(meal.id, "veg", i, e.target.value)
                      }
                      className="border flex-1 px-3 py-2 rounded-lg"
                    />

                    <button
                      onClick={() => removeMenuItem(meal.id, "veg", i)}
                      className="bg-green-500 text-white px-3 rounded-lg"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* NON VEG */}
              <div className="mb-5">
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold text-red-600">Non Veg</h3>

                  <button
                    onClick={() => addMenuItem(meal.id, "nonVeg")}
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded-lg"
                  >
                    + Add
                  </button>
                </div>

                {meal.nonVeg.length === 0 && (
                  <p className="text-sm text-gray-400 mb-2">
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
                      className="border flex-1 px-3 py-2 rounded-lg"
                    />

                    <button
                      onClick={() => removeMenuItem(meal.id, "nonVeg", i)}
                      className="bg-red-500 text-white px-3 rounded-lg"
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
                className="w-full bg-black text-white py-3 rounded-2xl font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                {savingId === meal.id ? "Saving..." : "Save This Day"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};