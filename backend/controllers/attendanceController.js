import Attendance from "../model/attendance.js";

export const postAttendence = async (req, res) => {
    try {
        const body = req.body;
        const records = Array.isArray(body) ? body : [body];

        const ops = records.map((r) => ({
            updateOne: {
                filter: { userId: r.userId, date: r.date },
                update: {
                    $set: {
                        userName: r.userName,
                        status: r.status,
                        lunch: r.lunch,
                        dinner: r.dinner,
                        extraTiffin: r.extraTiffin ?? 0,
                    },
                },
                upsert: true,
            },
        }));

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

        const ops = records.map((r) => ({
            updateOne: {
                filter: { userId: r.userId, date: r.date },
                update: {
                    $set: {
                        userName: r.userName,
                        status: r.status,
                        lunch: r.lunch,
                        dinner: r.dinner,
                        extraTiffin: r.extraTiffin ?? 0,
                    },
                },
                upsert: true,
            },
        }));

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

        const start = new Date(`${date}T00:00:00.000Z`);
        const end = new Date(`${date}T23:59:59.999Z`);

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