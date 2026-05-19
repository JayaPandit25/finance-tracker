import connectDB from "@/lib/mongodb";
import Otp from "@/models/Otp";
import { sendOtpEmail } from "@/lib/email";

export async function POST(req) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return Response.json({
        success: false,
        message: "Email address is required",
      });
    }

    // Generate a 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Remove any existing codes for this email to avoid duplicates
    await Otp.deleteMany({ email });

    // Store in DB
    await Otp.create({
      email,
      code,
      expiresAt,
    });

    // Send the email
    const emailResult = await sendOtpEmail(email, code);

    return Response.json({
      success: true,
      message: "Verification code sent to your email address.",
    });

  } catch (error) {
    console.error("Error in sending OTP API:", error);
    return Response.json({
      success: false,
      message: "Failed to generate or send verification code",
      error: error.message,
    });
  }
}
