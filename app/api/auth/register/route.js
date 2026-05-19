import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password, tempToken } = body;

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

    // Check if user already exists
    const existingUser = await User.findOne({ email: emailToUse });


    if (existingUser) {
      return Response.json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: emailToUse,
      password: hashedPassword,
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // IMPORTANT: do NOT return password
    return Response.json({
      success: true,
      message: "User Registered Successfully",
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