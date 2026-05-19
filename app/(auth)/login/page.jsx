"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  FaWallet, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaArrowRight, 
  FaKey, 
  FaArrowLeft, 
  FaUser, 
  FaCircleCheck, 
  FaSpinner 
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();

  // Unified flow steps: "email" | "otp" | "password"
  const [step, setStep] = useState("email");
  
  // Inputs
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // System states
  const [userExists, setUserExists] = useState(true);
  const [tempToken, setTempToken] = useState("");
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const otpInputRefs = useRef([]);

  // Countdown timer for resending OTP
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handler: Send OTP (Step 1)
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/otp/send", { email });

      if (res.data.success) {
        toast.success(res.data.message || "OTP code sent successfully!");
        setUserExists(res.data.userExists);
        setStep("otp");
        setTimer(60);
        setOtp(["", "", "", "", "", ""]);
        setTimeout(() => {
          if (otpInputRefs.current[0]) otpInputRefs.current[0].focus();
        }, 100);
      } else {
        toast.error(res.data.message || "Failed to send OTP.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "An error occurred while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Handler: Verify OTP (Step 2)
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const verificationCode = otp.join("");
    if (verificationCode.length !== 6) {
      toast.error("Please enter a complete 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/otp/verify", {
        email,
        code: verificationCode,
      });

      if (res.data.success) {
        setTempToken(res.data.tempToken);
        setUserExists(res.data.userExists);
        setStep("password");
        toast.success("OTP verified successfully!");
      } else {
        toast.error(res.data.message || "Invalid or expired OTP code.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "An error occurred during verification.");
    } finally {
      setLoading(false);
    }
  };

  // Handler: Complete Authentication (Step 3)
  const handleCompleteAuth = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter a password.");
      return;
    }

    setLoading(true);
    try {
      if (userExists) {
        // Log in existing user
        const res = await axios.post("/api/auth/login", {
          tempToken,
          password,
        });

        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          toast.success(
            <span className="flex items-center gap-1.5">
              Welcome back! Login successful. <FaCircleCheck className="text-red-500" />
            </span>
          );
          router.push("/dashboard");
        } else {
          toast.error(res.data.message || "Invalid credentials. Please try again.");
        }
      } else {
        // Register new user
        if (!name) {
          toast.error("Please enter your name.");
          setLoading(false);
          return;
        }

        const res = await axios.post("/api/auth/register", {
          name,
          tempToken,
          password,
        });

        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          toast.success(
            <span className="flex items-center gap-1.5">
              Welcome! Account created successfully. <FaCircleCheck className="text-red-500" />
            </span>
          );
          router.push("/dashboard");
        } else {
          toast.error(res.data.message || "Failed to create account. Please try again.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // OTP inputs key events
  const handleOtpChange = (index, value) => {
    if (/[^0-9]/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      otpInputRefs.current[5].focus();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4 py-12 overflow-hidden">
      {/* Decorative Blur Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-600/8 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        {/* Branding header */}
        <div className="flex flex-col items-center mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2.5 font-black text-2xl tracking-tight cursor-pointer"
            onClick={() => router.push("/")}
          >
            <span className="bg-red-500 text-white p-2 rounded-xl shadow-lg shadow-red-500/20">
              <FaWallet className="text-lg" />
            </span>
            <span>
              Finance<span className="text-red-500">Flow</span>
            </span>
          </motion.div>
          <p className="text-muted-foreground text-sm mt-2">
            Track Smarter, Save Better.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center justify-center gap-4 mb-6 px-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              step === "email" ? "bg-red-500 text-white shadow-md shadow-red-500/25 ring-2 ring-red-500/50" : "bg-red-500 text-white"
            }`}>
              <FaEnvelope />
            </div>
            <span className={`text-xs font-semibold ${step === "email" ? "text-foreground" : "text-muted-foreground"}`}>Email</span>
          </div>
          
          <div className={`h-[2px] w-8 rounded transition-all duration-300 ${
            step !== "email" ? "bg-red-500" : "bg-border/60"
          }`} />

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              step === "otp" ? "bg-red-500 text-white shadow-md shadow-red-500/25 ring-2 ring-red-500/50" : 
              step === "password" ? "bg-red-500 text-white" : "bg-muted/80 text-muted-foreground border border-border"
            }`}>
              <FaKey />
            </div>
            <span className={`text-xs font-semibold ${step === "otp" ? "text-foreground" : "text-muted-foreground"}`}>Verify</span>
          </div>

          <div className={`h-[2px] w-8 rounded transition-all duration-300 ${
            step === "password" ? "bg-red-500" : "bg-border/60"
          }`} />

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              step === "password" ? "bg-red-500 text-white shadow-md shadow-red-500/25 ring-2 ring-red-500/50" : "bg-muted/80 text-muted-foreground border border-border"
            }`}>
              <FaLock />
            </div>
            <span className={`text-xs font-semibold ${step === "password" ? "text-foreground" : "text-muted-foreground"}`}>Security</span>
          </div>
        </div>

        <Card className="border-border/60 shadow-xl bg-card/70 backdrop-blur-xl rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1.5 pb-6 pt-6">
            <CardTitle className="text-2xl font-extrabold tracking-tight text-center">
              {step === "email" && "Unified Sign In"}
              {step === "otp" && "Verify Email Code"}
              {step === "password" && (userExists ? "Confirm Password" : "Setup Profile")}
            </CardTitle>
            <CardDescription className="text-center text-sm text-muted-foreground">
              {step === "email" && "Enter your email address to get started"}
              {step === "otp" && `We sent a 6-digit verification code to ${email}`}
              {step === "password" && (userExists ? "Enter your password to log in" : "Since this is your first time, let's complete your profile")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {step === "email" && (
                <motion.form
                  key="email-step"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSendOtp}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75">
                        <FaEnvelope className="text-sm" />
                      </span>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 bg-input/5 backdrop-blur-sm rounded-xl"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md shadow-red-500/25 rounded-xl mt-6 transition-all duration-200"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <FaSpinner className="animate-spin text-sm" /> Sending OTP Code...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Get Started <FaArrowRight className="text-xs" />
                      </span>
                    )}
                  </Button>
                </motion.form>
              )}

              {step === "otp" && (
                <motion.form
                  key="otp-step"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block text-center">
                      Verification Code
                    </label>
                    <div className="flex justify-between gap-2 max-w-sm mx-auto" onPaste={handleOtpPaste}>
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpInputRefs.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-12 h-12 text-center text-xl font-extrabold text-foreground bg-input/5 backdrop-blur-sm border border-border/80 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500/50 outline-none transition-all duration-200 shadow-inner"
                          required
                          disabled={loading}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md shadow-red-500/25 rounded-xl transition-all duration-200"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <FaSpinner className="animate-spin text-sm" /> Verifying Code...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Verify Code <FaArrowRight className="text-xs" />
                        </span>
                      )}
                    </Button>

                    <div className="flex justify-between items-center text-xs mt-2 px-1">
                      <button
                        type="button"
                        onClick={() => {
                          setStep("email");
                        }}
                        className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 font-semibold"
                        disabled={loading}
                      >
                        <FaArrowLeft className="text-[10px]" /> Back to Email
                      </button>
                      
                      <button
                        type="button"
                        disabled={timer > 0 || loading}
                        onClick={() => handleSendOtp()}
                        className="text-red-500 hover:text-red-600 disabled:text-muted-foreground transition-colors font-semibold"
                      >
                        {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}

              {step === "password" && (
                <motion.form
                  key="password-step"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleCompleteAuth}
                  className="space-y-4"
                >
                  {/* Name field - only for NEW users */}
                  {!userExists && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75">
                          <FaUser className="text-sm" />
                        </span>
                        <Input
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10 h-11 bg-input/5 backdrop-blur-sm rounded-xl"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      {userExists ? "Password" : "Create Password"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75">
                        <FaLock className="text-sm" />
                      </span>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 bg-input/5 backdrop-blur-sm rounded-xl"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                        disabled={loading}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="text-sm" />
                        ) : (
                          <FaEye className="text-sm" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md shadow-red-500/25 rounded-xl transition-all duration-200"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <FaSpinner className="animate-spin text-sm" /> Processing...
                        </span>
                      ) : userExists ? (
                        <span className="flex items-center justify-center gap-2">
                          Sign In <FaArrowRight className="text-xs" />
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Complete Registration <FaArrowRight className="text-xs" />
                        </span>
                      )}
                    </Button>

                    <button
                      type="button"
                      onClick={() => {
                        setStep("otp");
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1 font-semibold text-xs mx-auto mt-2"
                      disabled={loading}
                    >
                      <FaArrowLeft className="text-[10px]" /> Back to OTP Code
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t border-border/50 bg-muted/20 px-6 py-4 mt-6">
            <div className="text-center text-xs text-muted-foreground leading-relaxed">
              New to FinanceFlow? Just enter your email. The system will automatically guide you to create your secure account.
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}