import nodemailer from "nodemailer";

export const sendPasswordResetEmail = async ({ toEmail, resetToken }) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #111827; margin-bottom: 16px;">Password Reset Request</h2>
      <p style="color: #374151; font-size: 15px; line-height: 1.5;">You requested to reset your password for <strong>MessMaster Pro</strong>.</p>
      <p style="color: #374151; font-size: 15px; line-height: 1.5;">Click the button below to create a new password:</p>
      <div style="margin: 28px 0; text-align: center;">
        <a href="${resetLink}" target="_blank" style="background-color: #000000; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 14px;">Reset Password</a>
      </div>
      <p style="color: #6b7280; font-size: 13px; line-height: 1.5;">This link will expire in <strong>10 minutes</strong>.</p>
      <p style="color: #9ca3af; font-size: 12px; margin-top: 24px; border-top: 1px solid #f3f4f6; padding-top: 16px;">If you did not request this password reset, you can safely ignore this email.</p>
    </div>
  `;

  // If email credentials are present, send real email via Nodemailer
  if (emailUser && emailPassword) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPassword,
        },
      });

      await transporter.sendMail({
        from: `"MessMaster Pro" <${emailUser}>`,
        to: toEmail,
        subject: "Password Reset - MessMaster Pro",
        html: htmlContent,
      });

      console.log(`[Email Sent] Password reset email sent to ${toEmail}`);
      return;
    } catch (err) {
      console.error("[Email Error] Failed to send email via Nodemailer:", err.message);
      // Fallback to console simulation log below
    }
  }

  // Console simulation when EMAIL_USER/EMAIL_PASSWORD are not configured
  console.log("\n=======================================================");
  console.log(`[DEV MODE - PASSWORD RESET LINK SIMULATION]`);
  console.log(`To: ${toEmail}`);
  console.log(`Reset URL: ${resetLink}`);
  console.log(`Expires in: 10 minutes`);
  console.log("=======================================================\n");
};
