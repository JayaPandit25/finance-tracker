import nodemailer from "nodemailer";

export async function sendOtpEmail(email, code) {
  const isConfigured =
    (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS) ||
    (process.env.EMAIL_USER && process.env.EMAIL_PASS);

  if (!isConfigured) {
    console.log("\n" + "=".repeat(60));
    console.log(`[SIMULATED EMAIL SERVICE] OTP Code for ${email}:`);
    console.log(`\n       >>>  ${code}  <<<\n`);
    console.log("To send real emails, configure your SMTP settings in .env.local");
    console.log("=".repeat(60) + "\n");
    return { success: true, simulated: true };
  }

  try {
    let transporter;
    
    if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Direct Gmail or simple service config
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }

    const mailOptions = {
      from: `"FinanceFlow Auth" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your FinanceFlow Verification Code: ${code}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0d0d0e; padding: 40px; color: #f3f4f6; text-align: center; border-radius: 16px; max-width: 500px; margin: 0 auto; border: 1px solid #27272a;">
          <div style="margin-bottom: 24px;">
            <span style="background-color: #ef4444; color: #ffffff; padding: 10px 16px; font-weight: 800; font-size: 20px; border-radius: 10px; display: inline-block;">FF</span>
            <span style="font-size: 24px; font-weight: 800; color: #ffffff; margin-left: 10px; vertical-align: middle;">Finance<span style="color: #ef4444;">Flow</span></span>
          </div>
          <h2 style="color: #ffffff; margin-bottom: 12px; font-size: 22px; font-weight: 700;">Verification Code</h2>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
            Use the following single-use verification code to secure your session. This code will expire in 10 minutes.
          </p>
          <div style="background-color: #18181b; border: 1px dashed #ef4444; padding: 16px; border-radius: 12px; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #ef4444; margin-bottom: 24px; display: inline-block; min-width: 200px;">
            ${code}
          </div>
          <p style="color: #71717a; font-size: 12px; line-height: 1.4;">
            If you did not request this verification, you can safely ignore this email. Someone may have entered your email address by mistake.
          </p>
          <hr style="border: 0; border-top: 1px solid #27272a; margin: 30px 0;">
          <p style="color: #52525b; font-size: 11px; margin: 0;">
            &copy; 2026 FinanceFlow. All rights reserved.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, simulated: false };
  } catch (error) {
    console.error("Error sending email via nodemailer:", error);
    // Return simulated delivery on SMTP error to let developers progress during local dev
    return { success: false, error: error.message };
  }
}
