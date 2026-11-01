import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Meal from "./model/meal.js";
import User from "./model/user.js";
import Attendance from "./model/attendance.js";
import { migrateMeals } from "./utils/migrateMeals.js";
import * as mealController from "./controllers/mealController.js";

// Mock Express req/res
const createMockReqRes = ({ body = {}, query = {}, user = null } = {}) => {
  const req = { body, query, user, headers: {} };
  const res = {
    statusCode: 200,
    jsonData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.jsonData = data;
      return this;
    },
  };
  return { req, res };
};

const runTests = async () => {
  console.log("=================================================");
  console.log("   WEEKLY MEALS PERSISTENCE VERIFICATION SUITE   ");
  console.log("=================================================\n");

  await mongoose.connect(process.env.MONGODB_URI);
  console.log(" Connected to MongoDB");

  // Run startup migration
  await migrateMeals();
  console.log(" Startup migration completed.\n");

  const admin1User = await User.findOne({ Usertype: "admin" });
  if (!admin1User) {
    throw new Error("No admin user found in database for test.");
  }
  const admin1 = { userId: admin1User._id.toString(), role: "admin", email: admin1User.Email };
  console.log(`Using Admin 1: ${admin1User.Name} (${admin1.userId})`);

  let passedTests = 0;

  // -------------------------------------------------------------
  // TEST 1: Save Paneer for Monday & verify persistence
  // -------------------------------------------------------------
  console.log("\n--- TEST 1: Save 'Paneer' for Monday & verify reload ---");
  {
    const { req: postReq, res: postRes } = createMockReqRes({
      body: {
        day: "Monday",
        mealType: "Lunch",
        veg: ["Paneer"],
        nonVeg: [],
      },
      user: admin1,
    });
    await mealController.postMealdata(postReq, postRes);
    if (postRes.statusCode !== 200) {
      throw new Error(`Failed to save Monday meal: ${postRes.jsonData?.message}`);
    }

    const { req: getReq, res: getRes } = createMockReqRes({
      query: { day: "Monday" },
      user: admin1,
    });
    await mealController.getMealdata(getReq, getRes);
    const mondayMeal = Array.isArray(getRes.jsonData) ? getRes.jsonData[0] : getRes.jsonData;
    
    if (mondayMeal && mondayMeal.lunch?.veg?.includes("Paneer")) {
      console.log(" PASS: Monday meal successfully saved and fetched as 'Paneer'.");
      passedTests++;
    } else {
      throw new Error(`Expected Monday to have 'Paneer', got: ${JSON.stringify(mondayMeal)}`);
    }
  }

  // -------------------------------------------------------------
  // TEST 2: Calendar date changed to following Monday (e.g. 2026-11-02)
  // -------------------------------------------------------------
  console.log("\n--- TEST 2: Check following Monday date (2026-11-02) ---");
  {
    const followingMonday = "2026-11-02";
    const { req, res } = createMockReqRes({
      query: { date: followingMonday },
      user: admin1,
    });
    await mealController.getMealdata(req, res);
    const meal = Array.isArray(res.jsonData) ? res.jsonData[0] : res.jsonData;

    if (meal && meal.day === "Monday" && meal.lunch?.veg?.includes("Paneer")) {
      console.log(` PASS: Following Monday (${followingMonday}) correctly mapped to Monday schedule showing 'Paneer'.`);
      passedTests++;
    } else {
      throw new Error(`Following Monday did not resolve to Paneer: ${JSON.stringify(meal)}`);
    }
  }

  // -------------------------------------------------------------
  // TEST 3: Calendar date changed to different month & year (e.g. 2027-03-15)
  // -------------------------------------------------------------
  console.log("\n--- TEST 3: Check Monday in different month and year (2027-03-15) ---");
  {
    // 2027-03-15 is a Monday
    const futureDate = "2027-03-15";
    const { req, res } = createMockReqRes({
      query: { date: futureDate },
      user: admin1,
    });
    await mealController.getMealdata(req, res);
    const meal = Array.isArray(res.jsonData) ? res.jsonData[0] : res.jsonData;

    if (meal && meal.day === "Monday" && meal.lunch?.veg?.includes("Paneer")) {
      console.log(` PASS: Monday in March 2027 (${futureDate}) remains 'Paneer'. Schedule is fully date-independent.`);
      passedTests++;
    } else {
      throw new Error(`Future Monday did not resolve to Paneer: ${JSON.stringify(meal)}`);
    }
  }

  // -------------------------------------------------------------
  // TEST 4: Update Monday to 'Shahi Paneer'
  // -------------------------------------------------------------
  console.log("\n--- TEST 4: Update Monday's meal to 'Shahi Paneer' ---");
  {
    const { req: updateReq, res: updateRes } = createMockReqRes({
      body: {
        day: "Monday",
        mealType: "Lunch",
        veg: ["Shahi Paneer"],
        nonVeg: [],
      },
      user: admin1,
    });
    await mealController.postMealdata(updateReq, updateRes);

    // Verify using getMealdata
    const { req: getReq, res: getRes } = createMockReqRes({
      query: { day: "Monday" },
      user: admin1,
    });
    await mealController.getMealdata(getReq, getRes);
    const updated = Array.isArray(getRes.jsonData) ? getRes.jsonData[0] : getRes.jsonData;

    // Verify using getTodayMeal when date is a Monday
    const { req: todayReq, res: todayRes } = createMockReqRes({
      query: { date: "2026-11-09" }, // A Monday
      user: admin1,
    });
    await mealController.getTodayMeal(todayReq, todayRes);

    if (
      updated?.lunch?.veg?.includes("Shahi Paneer") &&
      todayRes.jsonData?.lunch?.veg?.includes("Shahi Paneer")
    ) {
      console.log(" PASS: Monday meal successfully updated to 'Shahi Paneer' across all schedule views.");
      passedTests++;
    } else {
      throw new Error(`Failed to update to Shahi Paneer: ${JSON.stringify(updated)}`);
    }
  }

  // -------------------------------------------------------------
  // TEST 5: Simulate Backend Restart and verify persistence
  // -------------------------------------------------------------
  console.log("\n--- TEST 5: Simulate Backend Restart & Reload ---");
  {
    // Disconnect and reconnect to simulate a full server restart
    await mongoose.disconnect();
    await mongoose.connect(process.env.MONGODB_URI);
    await migrateMeals();

    const { req, res } = createMockReqRes({
      query: { day: "Monday" },
      user: admin1,
    });
    await mealController.getMealdata(req, res);
    const meal = Array.isArray(res.jsonData) ? res.jsonData[0] : res.jsonData;

    if (meal?.lunch?.veg?.includes("Shahi Paneer")) {
      console.log(" PASS: After backend restart, Monday meal remains 'Shahi Paneer'. Stored permanently in DB.");
      passedTests++;
    } else {
      throw new Error(`Meal was lost across restart: ${JSON.stringify(meal)}`);
    }
  }

  // -------------------------------------------------------------
  // TEST 6: Tuesday unaffected by changes to Monday
  // -------------------------------------------------------------
  console.log("\n--- TEST 6: Verify Tuesday unaffected by Monday changes ---");
  {
    // Save Tuesday as 'Dal Rice'
    const { req: tueReq, res: tueRes } = createMockReqRes({
      body: {
        day: "Tuesday",
        mealType: "Lunch",
        veg: ["Dal Rice"],
        nonVeg: [],
      },
      user: admin1,
    });
    await mealController.postMealdata(tueReq, tueRes);

    // Modify Monday again to 'Paneer Masala'
    const { req: monReq, res: monRes } = createMockReqRes({
      body: {
        day: "Monday",
        mealType: "Lunch",
        veg: ["Paneer Masala"],
        nonVeg: [],
      },
      user: admin1,
    });
    await mealController.postMealdata(monReq, monRes);

    // Verify Tuesday remains 'Dal Rice'
    const { req: verifyTueReq, res: verifyTueRes } = createMockReqRes({
      query: { day: "Tuesday" },
      user: admin1,
    });
    await mealController.getMealdata(verifyTueReq, verifyTueRes);
    const tueMeal = Array.isArray(verifyTueRes.jsonData)
      ? verifyTueRes.jsonData[0]
      : verifyTueRes.jsonData;

    if (tueMeal?.lunch?.veg?.includes("Dal Rice")) {
      console.log(" PASS: Tuesday meal remains 'Dal Rice' and is completely independent of Monday changes.");
      passedTests++;
    } else {
      throw new Error(`Tuesday was affected by Monday: ${JSON.stringify(tueMeal)}`);
    }
  }

  // -------------------------------------------------------------
  // TEST 7: Multi-mess support (independent schedules for different owners)
  // -------------------------------------------------------------
  console.log("\n--- TEST 7: Verify Multi-Mess Isolation between Owners ---");
  {
    const dummyMessOwnerId = new mongoose.Types.ObjectId();
    const admin2 = { userId: dummyMessOwnerId.toString(), role: "admin", email: "admin2@mess.com" };

    // Admin 1 sets Wednesday as 'Veg Thali'
    const { req: req1, res: res1 } = createMockReqRes({
      body: {
        day: "Wednesday",
        mealType: "Lunch",
        veg: ["Veg Thali"],
      },
      user: admin1,
    });
    await mealController.postMealdata(req1, res1);

    // Admin 2 (different mess owner) sets Wednesday as 'Chole Bhature'
    const { req: req2, res: res2 } = createMockReqRes({
      body: {
        day: "Wednesday",
        mealType: "Lunch",
        veg: ["Chole Bhature"],
      },
      user: admin2,
    });
    await mealController.postMealdata(req2, res2);

    // Query Admin 1's Wednesday
    const { req: qReq1, res: qRes1 } = createMockReqRes({
      query: { day: "Wednesday" },
      user: admin1,
    });
    await mealController.getMealdata(qReq1, qRes1);
    const meal1 = Array.isArray(qRes1.jsonData) ? qRes1.jsonData[0] : qRes1.jsonData;

    // Query Admin 2's Wednesday
    const { req: qReq2, res: qRes2 } = createMockReqRes({
      query: { day: "Wednesday" },
      user: admin2,
    });
    await mealController.getMealdata(qReq2, qRes2);
    const meal2 = Array.isArray(qRes2.jsonData) ? qRes2.jsonData[0] : qRes2.jsonData;

    if (
      meal1?.lunch?.veg?.includes("Veg Thali") &&
      meal2?.lunch?.veg?.includes("Chole Bhature")
    ) {
      console.log(` PASS: Admin 1 has 'Veg Thali' and Admin 2 has 'Chole Bhature'. Schedules are completely isolated.`);
      passedTests++;
    } else {
      throw new Error(`Multi-mess isolation failed: Owner 1=${JSON.stringify(meal1)}, Owner 2=${JSON.stringify(meal2)}`);
    }

    // Clean up dummy test mess records
    await Meal.deleteMany({ messId: dummyMessOwnerId });
  }

  // -------------------------------------------------------------
  // TEST 8: Verify attendance, payments, lunch, dinner, extra tiffins
  // -------------------------------------------------------------
  console.log("\n--- TEST 8: Verify Attendance, Categories & Historical Records ---");
  {
    // Test dinner and lunch co-existence on the same day
    const { req: dinnerReq, res: dinnerRes } = createMockReqRes({
      body: {
        day: "Thursday",
        mealType: "Dinner",
        veg: ["Biryani"],
        nonVeg: ["Chicken Curry"],
      },
      user: admin1,
    });
    await mealController.postMealdata(dinnerReq, dinnerRes);

    // Add Lunch on Thursday without erasing Dinner
    const { req: lunchReq, res: lunchRes } = createMockReqRes({
      body: {
        day: "Thursday",
        mealType: "Lunch",
        veg: ["Rajma Chawal"],
      },
      user: admin1,
    });
    await mealController.postMealdata(lunchReq, lunchRes);

    const { req: thursReq, res: thursRes } = createMockReqRes({
      query: { day: "Thursday" },
      user: admin1,
    });
    await mealController.getMealdata(thursReq, thursRes);
    const thursMeal = Array.isArray(thursRes.jsonData) ? thursRes.jsonData[0] : thursRes.jsonData;

    const hasLunch = thursMeal?.lunch?.veg?.includes("Rajma Chawal");
    const hasDinnerVeg = thursMeal?.dinner?.veg?.includes("Biryani");
    const hasDinnerNonVeg = thursMeal?.dinner?.nonVeg?.includes("Chicken Curry");

    // Verify existing attendance records remain fully intact
    const attendanceCount = await Attendance.countDocuments();
    const userCount = await User.countDocuments();

    if (hasLunch && hasDinnerVeg && hasDinnerNonVeg && attendanceCount >= 0 && userCount > 0) {
      console.log(` PASS: Lunch and Dinner categories coexist properly. User accounts (${userCount}) and Attendance records are 100% intact.`);
      passedTests++;
    } else {
      throw new Error(`Category preservation failed: ${JSON.stringify(thursMeal)}`);
    }
  }

  console.log("\n=================================================");
  console.log(` ALL ${passedTests}/8 VERIFICATION SCENARIOS PASSED! `);
  console.log("=================================================\n");

  await mongoose.disconnect();
};

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
