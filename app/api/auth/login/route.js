import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password, tempToken } = await req.json();

    let emailToUse = email;

    if (tempToken) {
      try {
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        if (!decoded.otpVerified) {
          return Response.json({
            success: false,
            message: "Invalid OTP verification state",
          });
        }
        emailToUse = decoded.email;
      } catch (err) {
        return Response.json({
          success: false,
          message: "OTP verification session has expired. Please request a new OTP.",
        });
      }
    }

    if (!emailToUse) {
      return Response.json({
        success: false,
        message: "Email is required",
      });
    }

    // Check user exists
    const user = await User.findOne({ email: emailToUse });

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json({
        success: false,
        message: "Invalid credentials",
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
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}