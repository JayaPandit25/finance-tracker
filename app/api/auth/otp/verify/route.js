import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const { email, code } = await req.json();

    if (!email || !code) {
      return Response.json({
        success: false,
        message: "Email and verification code are required",
      });
    }

    // Find the OTP code in database
    const otpDoc = await Otp.findOne({ email });

    if (!otpDoc) {
      return Response.json({
        success: false,
        message: "No active verification code found for this email",
      });
    }

    // Verify code match
    if (otpDoc.code !== code) {
      return Response.json({
        success: false,
        message: "Invalid verification code. Please try again.",
      });
    }

    // Check expiration
    if (new Date() > otpDoc.expiresAt) {
      await Otp.deleteOne({ _id: otpDoc._id }); // Clean up expired
      return Response.json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
    }

    // OTP is valid! Delete it so it cannot be reused
    await Otp.deleteOne({ _id: otpDoc._id });

    // Look up if user already exists
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      // Auto-register the user (Passwordless OTP Signup)
      isNewUser = true;

      // Generate a default display name from email (e.g., jayap from jayap@example.com)
      const emailPrefix = email.split("@")[0];
      const displayName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

      // Generate a strong random password for security since password field is required
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        name: displayName,
        email,
        password: hashedPassword,
        currency: "INR", // Default currency
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return Response.json({
      success: true,
      message: isNewUser
        ? "Welcome! Account created and logged in successfully."
        : "Login successful! Welcome back.",
      token,
      isNewUser,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
    });

  } catch (error) {
    console.error("Error verifying OTP code:", error);
    return Response.json({
      success: false,
      message: "An error occurred during verification",
      error: error.message,
    });
  }
}
