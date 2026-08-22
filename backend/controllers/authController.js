import User from "../model/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../utils/sendEmail.js";

// ==================== FORGOT PASSWORD =======================
export const forgotPassword = async (req, res) => {
  try {
    const rawEmail = req.body.email;
    if (!rawEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const email = rawEmail.trim().toLowerCase();
    const GENERIC_RESPONSE = {
      message: "If an account with this email exists, a password reset link has been sent.",
    };

    // Case-insensitive email search
    const escapedEmail = email.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const user = await User.findOne({
      Email: new RegExp("^" + escapedEmail + "$", "i"),
    });

    // Security rule: Always return generic response to prevent email enumeration
    if (!user) {
      return res.status(200).json(GENERIC_RESPONSE);
    }

    // Generate cryptographically secure random token (32 bytes = 64 hex chars)
    const rawToken = crypto.randomBytes(32).toString("hex");

    // Hash token using SHA-256 before storing in DB
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    // Set token expiration to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expiresAt;
    await user.save();

    // Send reset password email asynchronously in its own try/catch
    // so email transport errors never leak account existence via 500 status codes
    try {
      await sendPasswordResetEmail({
        toEmail: user.Email,
        resetToken: rawToken,
      });
    } catch (emailErr) {
      console.error("[forgotPassword Email Error]: Failed to send reset email to", user.Email, emailErr.message);
      // Suppress error so response remains 200 with generic message
    }

    return res.status(200).json(GENERIC_RESPONSE);
  } catch (error) {
    console.error("[forgotPassword Error]:", error);
    return res.status(500).json({ message: "An error occurred while processing your request." });
  }
};

// ==================== RESET PASSWORD =======================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "New password is required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash token received from URL using SHA-256 to compare with stored hashed token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "This password reset link has expired or is invalid. Please request a new password reset link.",
      });
    }

    // Hash new password using bcrypt (matching existing postUserdata salt factor of 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and invalidate reset token
    user.Password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password has been reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("[resetPassword Error]:", error);
    return res.status(500).json({ message: "An error occurred while resetting your password." });
  }
};
