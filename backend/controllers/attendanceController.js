import Attendance from "../model/attendance.js"

export const postAttendence = async (req, res) => {
    try {
        const body = req.body;

        // support both a single object and an array of records
        const records = Array.isArray(body) ? body : [body];

        const docs = records.map((r) => ({
            userId: r.userId,
            date: r.date,
            meal_type: r.meal_type,
            status: r.status,
            time: r.time,
            Extra_Tiffin: r.Extra_Tiffin ?? 0,
        }));

        const saved = await Attendance.insertMany(docs);

        return res.status(201).json({
            message: "Attendance added successfully",
            data: saved,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error while saving attendance",
        });
    }
};