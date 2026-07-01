import mongoose, { Schema } from "mongoose";

const attendance = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    date: {
        type: Date,
        required: true,
    },
    meal_type: {
        type: String,
        enum: ["Lunch", "Dinner"],
        required: true,
    },
    status: {
        type: String,
        enum: ["present", "absent"],
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    Extra_Tiffin: {
        type: Number,
        default: 0,
    },
});

const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", attendance);

export default Attendance;