import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export async function POST(req) {
  try {
    await connectDB();

    const { accessToken } = await req.json();

    if (!accessToken) {
      return Response.json({
        success: false,
        message: "Access token is required",
      }, { status: 400 });
    }

    // Verify token and fetch user details from Google UserInfo API
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return Response.json({
        success: false,
        message: "Failed to verify access token with Google",
      }, { status: 400 });
    }

    const userData = await response.json();
    const { email, name } = userData;

    if (!email) {
      return Response.json({
        success: false,
        message: "Email not retrieved from Google account",
      }, { status: 400 });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // User doesn't exist, create a new one
      // Generate a secure random password to satisfy Schema's required field
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        name: name || email.split("@")[0],
        email,
        password: hashedPassword,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return Response.json({
      success: true,
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency || "INR",
      },
    });

  } catch (error) {
    console.error("Google Auth Route Error:", error);
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
