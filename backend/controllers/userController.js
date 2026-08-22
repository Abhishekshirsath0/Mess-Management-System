import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "71a1567f574122600060c086d8971a1f41e6d68abed01e01470c8130c31240a3";

export const postUserdata = async (req, res) => {
  try {
    const { Name, Mobile, Parent_Mob, Email, DietType, Address, Gender, Password, Usertype, Plan } = req.body;

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = new User({
      Name,
      Mobile,
      Parent_Mob,
      Email,
      DietType: DietType || "Mixed",
      Address,
      Gender,
      Password: hashedPassword,
      Usertype: Usertype || "user",
      Plan: Plan || "STANDARD",

    });

    const savedUser = await newUser.save();

    const { Password: _, ...userWithoutPassword } = savedUser.toObject();
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email or phone number already exists" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ Email: email }).select("+Password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.Usertype, email: user.Email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { Password: _, ...userWithoutPassword } = user.toObject();
    return res.status(200).json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserdata = async (req, res) => {
  try {
    const users = await User.find().select("-Password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };

    // Prevent password update from this route
    delete updateData.Password;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select("-Password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};