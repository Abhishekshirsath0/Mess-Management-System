import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./Router/userRouter.js";
import attendanceRouter from "./Router/attendanceRouter.js";
import mealRouter from "./Router/mealRouter.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/user", userRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/meal", mealRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

import User from "./model/user.js";
import bcrypt from "bcrypt";

const seedAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ Email: "admin@gmail.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("123456", 10);
      await User.create({
        Name: "Admin",
        Mobile: 9999999999,
        Parent_Mob: 9999999998,
        Email: "admin@gmail.com",
        Address: "Main Office",
        Gender: "Male",
        Password: hashedPassword,
        Usertype: "admin",
        Plan: "PREMIUM",
        PaymentStatus: "Paid",
        PaidAmount: 4200,
        PendingAmount: 0,
      });
      console.log("Default Admin user created (admin@gmail.com / 123456)");
    }
  } catch (err) {
    console.error("Admin seed error:", err.message);
  }
};

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await seedAdminUser();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });