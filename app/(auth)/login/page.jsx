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
  FaFaceSmile,
  FaKey,
  FaArrowLeft,
  FaPaperPlane,
  FaCircleCheck,
  FaFingerprint
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();

  // Tab State: 'password' | 'otp'
  const [loginMethod, setLoginMethod] = useState("password");
  
  // Password login form
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // OTP flow states
  const [otpEmail, setOtpEmail] = useState("");
  const [otpStep, setOtpStep] = useState("email"); // 'email' | 'code'
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const otpInputRefs = useRef([]);

  // Timer countdown effect for OTP resend
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

  // Handle standard password login inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Password login submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login", form);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        
        toast.success(
          <span className="flex items-center gap-1.5">
            Welcome back! Login successful. <FaFaceSmile className="text-red-500" />
          </span>,
          { duration: 3000 }
        );

        router.push("/dashboard");
      } else {
        toast.error(res.data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger Send OTP API
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otpEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/otp/send", { email: otpEmail });

      if (res.data.success) {
        toast.success(res.data.message);
        
        setOtpStep("code");
        setTimer(60); // 60 seconds resend cooldown
        // Clear previous input
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

  // Handle individual OTP digital inputs
  const handleOtpChange = (index, value) => {
    // Only allow single numeric inputs
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input if filled
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

  // Trigger Verify OTP API
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const verificationCode = otp.join("");
    if (verificationCode.length !== 6) {
      toast.error("Please enter a complete 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/otp/verify", {
        email: otpEmail,
        code: verificationCode,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        
        toast.success(
          <span className="flex items-center gap-1.5">
            {res.data.isNewUser 
              ? "Welcome to FinanceFlow! Account created successfully." 
              : "Welcome back! Login successful."}
            <FaCircleCheck className="text-red-500" />
          </span>,
          { duration: 4000 }
        );

        router.push("/dashboard");
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

        <Card className="border-border/60 shadow-xl bg-card/70 backdrop-blur-xl rounded-2xl overflow-hidden">
          {/* Custom Tabs */}
          <div className="flex border-b border-border/50 bg-muted/10">
            <button
              onClick={() => {
                setLoginMethod("password");
              }}
              className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 border-b-2 flex items-center justify-center gap-2 ${
                loginMethod === "password"
                  ? "border-red-500 text-foreground bg-muted/20"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FaLock className="text-xs" />
              Password Login
            </button>
            <button
              onClick={() => setLoginMethod("otp")}
              className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 border-b-2 flex items-center justify-center gap-2 ${
                loginMethod === "otp"
                  ? "border-red-500 text-foreground bg-muted/20"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FaFingerprint className="text-xs" />
              OTP / Code Login
            </button>
          </div>

          <CardHeader className="space-y-1.5 pb-6 pt-6">
            <CardTitle className="text-2xl font-extrabold tracking-tight text-center">
              {loginMethod === "password"
                ? "Welcome back"
                : otpStep === "email"
                ? "Passwordless Sign In"
                : "Verify OTP Code"}
            </CardTitle>
            <CardDescription className="text-center text-sm text-muted-foreground">
              {loginMethod === "password"
                ? "Enter your credentials to access your dashboard"
                : otpStep === "email"
                ? "We will email you a 6-digit OTP verification code"
                : `We sent a temporary access code to ${otpEmail}`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {/* PASSWORD METHOD */}
              {loginMethod === "password" && (
                <motion.form
                  key="password-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75">
                        <FaEnvelope className="text-sm" />
                      </span>
                      <Input
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={handleChange}
                        className="pl-10 h-11 bg-input/5 backdrop-blur-sm rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75">
                        <FaLock className="text-sm" />
                      </span>
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        className="pl-10 pr-10 h-11 bg-input/5 backdrop-blur-sm rounded-xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                      >
                        {showPassword ? (
                          <FaEyeSlash className="text-sm" />
                        ) : (
                          <FaEye className="text-sm" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md shadow-red-500/25 rounded-xl mt-6 transition-all duration-200"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Sign In <FaArrowRight className="text-xs" />
                      </span>
                    )}
                  </Button>
                </motion.form>
              )}

              {/* OTP METHOD */}
              {loginMethod === "otp" && (
                <motion.div
                  key="otp-container"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {otpStep === "email" ? (
                    /* Step 1: Input Email */
                    <form onSubmit={handleSendOtp} className="space-y-4">
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
                            value={otpEmail}
                            onChange={(e) => setOtpEmail(e.target.value)}
                            className="pl-10 h-11 bg-input/5 backdrop-blur-sm rounded-xl"
                            required
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
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending Code...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            Send Verification Code <FaPaperPlane className="text-xs" />
                          </span>
                        )}
                      </Button>
                    </form>
                  ) : (
                    /* Step 2: Verify 6-digit Code */
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block text-center">
                          Verification Code
                        </label>
                        
                        {/* 6 Digit Input Grid */}
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
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Verifying Code...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              Verify & Sign In <FaKey className="text-xs" />
                            </span>
                          )}
                        </Button>

                        <div className="flex justify-between items-center text-xs mt-2 px-1">
                          <button
                            type="button"
                            onClick={() => {
                              setOtpStep("email");
                            }}
                            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 font-semibold"
                          >
                            <FaArrowLeft className="text-[10px]" /> Change Email
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
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t border-border/50 bg-muted/20 px-6 py-4 mt-6">
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-red-500 hover:text-red-600 underline underline-offset-4 transition-colors"
              >
                Create an account
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}