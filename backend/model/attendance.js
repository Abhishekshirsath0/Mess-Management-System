import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userName: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["present", "absent"],
            default: "present",
        },
        lunch: {
            type: Boolean,
            default: false,
        },
        dinner: {
            type: Boolean,
            default: false,
        },
        extraTiffin: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

// One record per student per day — no more separate Lunch/Dinner docs
attendanceSchema.index(
    { userId: 1, date: 1 },
    { unique: true }
);

const Attendance =
    mongoose.models.Attendance ||
    mongoose.model("Attendance", attendanceSchema);

export default Attendance;