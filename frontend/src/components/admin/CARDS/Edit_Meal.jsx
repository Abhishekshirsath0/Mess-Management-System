import { useState } from "react";

const initialMeals = [
  {
    id: 1,
    day: "Monday",
    date: "2026-05-26",
    veg: ["Paneer Butter Masala", "Dal Tadka"],
    nonVeg: ["Chicken Curry", "Egg Curry"],
  },
  {
    id: 2,
    day: "Tuesday",
    date: "2026-05-27",
    veg: ["Veg Biryani", "Chapati"],
    nonVeg: ["Chicken Biryani", "Fish Fry"],
  },
  {
    id: 3,
    day: "Wednesday",
    date: "2026-05-28",
    veg: ["Mix Veg", "Rice"],
    nonVeg: ["Mutton Curry", "Egg Bhurji"],
  },
  {
    id: 4,
    day: "Thursday",
    date: "2026-05-29",
    veg: ["Paneer Tikka", "Dal Rice"],
    nonVeg: ["Chicken Handi", "Fish Fry"],
  },
  {
    id: 5,
    day: "Friday",
    date: "2026-05-30",
    veg: ["Aloo Gobi", "Chapati"],
    nonVeg: ["Chicken Tandoori", "Egg Curry"],
  },
  {
    id: 6,
    day: "Saturday",
    date: "2026-05-31",
    veg: ["Veg Pulav", "Roti"],
    nonVeg: ["Chicken Curry", "Egg Fry"],
  },
  {
    id: 7,
    day: "Sunday",
    date: "2026-06-01",
    veg: ["Shahi Paneer", "Naan"],
    nonVeg: ["Special Chicken Thali", "Fish Fry"],
  },
];

export const Edit_Meal = () => {
  const [mealType, setMealType] = useState("Lunch");
  const [meals, setMeals] = useState(initialMeals);

  const handleDateChange = (id, value) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.id === id ? { ...meal, date: value } : meal
      )
    );
  };

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

  const handleSaveCard = (meal) => {
    console.log("Saved Meal:", meal);
    alert(`${meal.day} saved successfully`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-10">
        <h1 className="text-3xl font-bold">
          Weekly Meal Management
        </h1>

        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className="border px-4 py-2 rounded-xl"
        >
          <option>Lunch</option>
          <option>Dinner</option>
        </select>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {meals.map((meal) => (
          <div
            key={meal.id}
            className="bg-white rounded-3xl border p-6 shadow-sm"
          >

            {/* HEADER */}
            <div className="flex justify-between mb-6">

              <div>
                <h2 className="text-2xl font-bold">
                  {meal.day}
                </h2>

                <input
                  type="date"
                  value={meal.date}
                  onChange={(e) =>
                    handleDateChange(meal.id, e.target.value)
                  }
                  className="border mt-2 px-3 py-2 rounded-lg"
                />
              </div>

              <span className="inline-flex items-center bg-black text-white px-2 py-1 rounded-lg text-xs font-medium leading-none h-fit">
                {mealType}
              </span>

            </div>

            {/* VEG */}
            <div className="mb-5">
              <div className="flex justify-between mb-3">
                <h3 className="font-semibold text-green-600">
                  Veg
                </h3>

                <button
                  onClick={() => addMenuItem(meal.id, "veg")}
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg"
                >
                  + Add
                </button>
              </div>

              {meal.veg.map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    value={item}
                    onChange={(e) =>
                      handleMenuChange(meal.id, "veg", i, e.target.value)
                    }
                    className="border flex-1 px-3 py-2 rounded-lg"
                  />

                  <button
                    onClick={() =>
                      removeMenuItem(meal.id, "veg", i)
                    }
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
                <h3 className="font-semibold text-red-600">
                  Non Veg
                </h3>

                <button
                  onClick={() =>
                    addMenuItem(meal.id, "nonVeg")
                  }
                  className="text-sm bg-red-600 text-white px-3 py-1 rounded-lg"
                >
                  + Add
                </button>
              </div>

              {meal.nonVeg.map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    value={item}
                    onChange={(e) =>
                      handleMenuChange(meal.id, "nonVeg", i, e.target.value)
                    }
                    className="border flex-1 px-3 py-2 rounded-lg"
                  />

                  <button
                    onClick={() =>
                      removeMenuItem(meal.id, "nonVeg", i)
                    }
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
              className="w-full bg-black text-white py-3 rounded-2xl font-medium hover:bg-gray-800 transition"
            >
              Save This Day
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};