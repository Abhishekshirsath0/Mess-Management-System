import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    Name: { type: String, required: [true, "Name is required"] },
    Mobile: {
      type: Number,
      required: [true, "Phone number is required"],
      unique: true,
    },
    Parent_Mob: {
      type: Number,
      required: [true, "Parent phone number is required"],
    },
    Email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    Address: { type: String, required: [true, "Address is required"] },
    Gender: { type: String, required: [true, "Gender is required"] },
    Password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
    },
    Usertype: { type: String, enum: ["user", "admin"], default: "user" },
    
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;