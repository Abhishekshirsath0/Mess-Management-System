import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  return process.env.JWT_SECRET;
};

export const postUserdata = async (req, res) => {
  try {
    const { Name, Mobile, Parent_Mob, Email, DietType, Address, Gender, Password, Plan } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = Email.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = new User({
      Name,
      Mobile,
      Parent_Mob,
      Email: normalizedEmail,
      DietType: DietType || "Mixed",
      Address,
      Gender,
      Password: hashedPassword,
      Usertype: "user", // Security enforcement: Public registration always creates standard 'user'
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

    const normalizedEmail = email.trim().toLowerCase();
    const escapedEmail = normalizedEmail.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const user = await User.findOne({
      Email: new RegExp("^" + escapedEmail + "$", "i"),
    }).select("+Password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.Usertype, email: user.Email },
      getJwtSecret(),
      { expiresIn: "10d" }
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

    // Security: Non-admins cannot alter administrative/financial fields
    const isAdmin = req.user && req.user.role === "admin";
    if (!isAdmin) {
      delete updateData.Usertype;
      delete updateData.PaymentStatus;
      delete updateData.PaidAmount;
      delete updateData.PendingAmount;
      delete updateData.Deposit;
      delete updateData.isConfirmed;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
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