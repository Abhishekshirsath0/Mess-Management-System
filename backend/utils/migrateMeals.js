import mongoose from "mongoose";

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const migrateMeals = async () => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      console.warn("[migrateMeals] No active database connection.");
      return;
    }

    const collections = await db.listCollections({ name: "meals" }).toArray();
    if (collections.length === 0) {
      // Collection doesn't exist yet, nothing to migrate
      return;
    }

    const collection = db.collection("meals");

    // Check indexes and drop legacy unique date index if present
    const indexes = await collection.indexes();
    const hasDateUniqueIndex = indexes.some(
      (idx) => idx.name === "date_1" && idx.unique
    );
    if (hasDateUniqueIndex) {
      console.log("[migrateMeals] Dropping legacy unique index 'date_1'...");
      try {
        await collection.dropIndex("date_1");
        console.log("[migrateMeals] Successfully dropped 'date_1' index.");
      } catch (err) {
        console.warn("[migrateMeals] Failed to drop 'date_1' index:", err.message);
      }
    }

    // Migrate any legacy documents missing day or weekday
    const unmigrated = await collection
      .find({
        $or: [
          { day: { $exists: false } },
          { day: null },
          { weekday: { $exists: false } },
          { weekday: null },
        ],
      })
      .toArray();

    if (unmigrated.length > 0) {
      console.log(`[migrateMeals] Found ${unmigrated.length} legacy meal document(s) to migrate.`);

      for (const doc of unmigrated) {
        let dayName = null;
        if (doc.date) {
          const d = new Date(doc.date);
          dayName = WEEKDAYS[d.getUTCDay()];
        } else {
          dayName = "Monday"; // fallback
        }

        await collection.updateOne(
          { _id: doc._id },
          {
            $set: {
              day: dayName,
              weekday: dayName,
              messId: doc.messId || null,
              lunch: doc.lunch || { veg: [], nonVeg: [] },
              dinner: doc.dinner || { veg: [], nonVeg: [] },
            },
          }
        );
        console.log(`[migrateMeals] Migrated meal ${doc._id} to weekday ${dayName}.`);
      }
    }

    // Ensure compound unique index { messId: 1, day: 1 } exists
    try {
      await collection.createIndex({ messId: 1, day: 1 }, { unique: true });
      await collection.createIndex({ messId: 1, weekday: 1 });
      await collection.createIndex({ day: 1 });
      console.log("[migrateMeals] Weekly meal schedule indexes verified.");
    } catch (idxErr) {
      console.warn("[migrateMeals] Index creation notice:", idxErr.message);
    }
  } catch (error) {
    console.error("[migrateMeals] Error during meal migration:", error);
  }
};

export default migrateMeals;
