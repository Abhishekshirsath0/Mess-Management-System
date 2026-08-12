import mongoose from "mongoose";
import Attendance from "../model/attendance.js";
import User from "../model/user.js";

const normalizeDateToUTC = (dateInput) => {
    const dateStr =
        typeof dateInput === "string"
            ? dateInput.slice(0, 10)
            : new Date(dateInput).toISOString().slice(0, 10);
    return new Date(`${dateStr}T00:00:00.000Z`);
};

const buildDateRangeFilter = (startDate, endDate) => {
    if (!startDate && !endDate) return {};

    const filter = { date: {} };
    if (startDate) {
        filter.date.$gte = normalizeDateToUTC(startDate);
    }
    if (endDate) {
        const endStr =
            typeof endDate === "string"
                ? endDate.slice(0, 10)
                : new Date(endDate).toISOString().slice(0, 10);
        filter.date.$lte = new Date(`${endStr}T23:59:59.999Z`);
    }
    return filter;
};

const buildMealTypeFilter = (mealType) => {
    if (!mealType || mealType === "all") return {};
    if (mealType === "lunch") return { lunch: true };
    if (mealType === "dinner") return { dinner: true };
    if (mealType === "both") return { lunch: true, dinner: true };
    return {};
};

const buildStatusFilter = (status) => {
    if (!status || status === "all") return {};
    return { status };
};

const computeSummary = (records) => ({
    totalRecords: records.length,
    totalPresent: records.filter((r) => r.status === "present").length,
    totalAbsent: records.filter((r) => r.status === "absent").length,
    totalLunch: records.reduce((acc, r) => acc + (r.lunch ? 1 : 0), 0),
    totalDinner: records.reduce((acc, r) => acc + (r.dinner ? 1 : 0), 0),
    totalExtraTiffin: records.reduce((acc, r) => acc + (r.extraTiffin || 0), 0),
});

const buildSearchFilter = async (search) => {
    if (!search || !search.trim()) return null;

    const q = search.trim();
    const regex = new RegExp(q, "i");
    const orConditions = [{ userName: regex }];

    if (mongoose.Types.ObjectId.isValid(q)) {
        orConditions.push({ userId: new mongoose.Types.ObjectId(q) });
    }

    const userQuery = {
        $or: [{ Name: regex }, { Email: regex }],
    };

    if (/^\d+$/.test(q)) {
        userQuery.$or.push({ Mobile: Number(q) });
    }

    const matchingUsers = await User.find(userQuery).select("_id");
    if (matchingUsers.length > 0) {
        orConditions.push({ userId: { $in: matchingUsers.map((u) => u._id) } });
    }

    return { $or: orConditions };
};

const buildHistoryQuery = async (queryParams, userIdScope = null) => {
    const { search, userId, startDate, endDate, mealType, status } = queryParams;

    const conditions = [
        buildDateRangeFilter(startDate, endDate),
        buildMealTypeFilter(mealType),
        buildStatusFilter(status),
    ].filter((c) => Object.keys(c).length > 0);

    if (userIdScope) {
        conditions.push({ userId: userIdScope });
    } else if (userId && userId !== "all") {
        conditions.push({ userId });
    }

    const searchFilter = await buildSearchFilter(search);
    if (searchFilter) {
        conditions.push(searchFilter);
    }

    if (conditions.length === 0) return {};
    if (conditions.length === 1) return conditions[0];
    return { $and: conditions };
};

export const postAttendence = async (req, res) => {
    try {
        const body = req.body;
        const records = Array.isArray(body) ? body : [body];

        const ops = records.map((r) => {
            const normalizedDate = normalizeDateToUTC(r.date);
            return {
                updateOne: {
                    filter: { userId: r.userId, date: normalizedDate },
                    update: {
                        $set: {
                            userName: r.userName,
                            status: r.status,
                            lunch: r.lunch,
                            dinner: r.dinner,
                            extraTiffin: r.extraTiffin ?? 0,
                            date: normalizedDate,
                        },
                    },
                    upsert: true,
                },
            };
        });

        const result = await Attendance.bulkWrite(ops);

        res.status(201).json({
            message: "Attendance saved successfully",
            data: result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while saving attendance" });
    }
};

export const UpdateAttendence = async (req, res) => {
    try {
        const { records } = req.body;

        const ops = records.map((r) => {
            const normalizedDate = normalizeDateToUTC(r.date);
            return {
                updateOne: {
                    filter: { userId: r.userId, date: normalizedDate },
                    update: {
                        $set: {
                            userName: r.userName,
                            status: r.status,
                            lunch: r.lunch,
                            dinner: r.dinner,
                            extraTiffin: r.extraTiffin ?? 0,
                            date: normalizedDate,
                        },
                    },
                    upsert: true,
                },
            };
        });

        const result = await Attendance.bulkWrite(ops);

        res.status(200).json({
            message: "Attendance updated successfully",
            data: result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update attendance", error: error.message });
    }
};

export const getAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ message: "date query param is required" });
        }

        const dateStr = typeof date === "string" ? date.slice(0, 10) : new Date(date).toISOString().slice(0, 10);
        const start = new Date(`${dateStr}T00:00:00.000Z`);
        const end = new Date(`${dateStr}T23:59:59.999Z`);

        const records = await Attendance.find({ date: { $gte: start, $lte: end } });

        res.status(200).json({
            message: "Attendance fetched successfully",
            data: records,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch attendance" });
    }
};

export const getUserAttendanceStats = async (req, res) => {
    try {
        const { userId } = req.params;
        const records = await Attendance.find({ userId });

        const totalLunch = records.reduce((acc, r) => acc + (r.lunch ? 1 : 0), 0);
        const totalDinner = records.reduce((acc, r) => acc + (r.dinner ? 1 : 0), 0);
        const totalExtra = records.reduce((acc, r) => acc + (r.extraTiffin || 0), 0);
        const totalTiffins = totalLunch + totalDinner + totalExtra;

        res.status(200).json({
            userId,
            totalLunch,
            totalDinner,
            totalExtra,
            totalTiffins,
            records,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch user attendance stats" });
    }
};

export const getAttendanceHistory = async (req, res) => {
    try {
        const { sort } = req.query;
        const query = await buildHistoryQuery(req.query);
        const sortOrder = sort === "oldest" ? { date: 1 } : { date: -1 };

        const records = await Attendance.find(query)
            .populate("userId", "Name Mobile Email Usertype")
            .sort(sortOrder);

        res.status(200).json({
            message: "Attendance history fetched successfully",
            data: records,
            summary: computeSummary(records),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch attendance history" });
    }
};

export const getUserAttendanceHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const { sort } = req.query;
        const query = await buildHistoryQuery(req.query, userId);
        const sortOrder = sort === "oldest" ? { date: 1 } : { date: -1 };

        const records = await Attendance.find(query).sort(sortOrder);

        res.status(200).json({
            message: "User attendance history fetched successfully",
            data: records,
            summary: computeSummary(records),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch user attendance history" });
    }
};
