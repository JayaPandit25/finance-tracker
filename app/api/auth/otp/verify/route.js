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
    const user = await User.findOne({ email });
    const userExists = !!user;

    // Create a secure temporary token indicating OTP has been verified
    const tempToken = jwt.sign(
      { email, otpVerified: true },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return Response.json({
      success: true,
      message: "OTP verified successfully. Please proceed with password entry.",
      tempToken,
      userExists,
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

