"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Wallet, 
  PieChart, 
  Activity, 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Sun, 
  Moon, 
  ChevronRight, 
  Zap, 
  Lock, 
  Plus, 
  ArrowUpRight, 
  Check, 
  Star,
  Users,
  Building,
  HeartHandshake,
  Orbit,
  Globe,
  Rocket,
  Compass,
  RefreshCw
} from "lucide-react";
import { FaBolt } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Interactive Cosmic Balance Simulator State
  const [selectedOrbit, setSelectedOrbit] = useState("sun"); // "sun", "income", "expense", "savings", "investment"
  const [stellarBalance, setStellarBalance] = useState(482500);
  const [stellarIncome, setStellarIncome] = useState(72000);
  const [stellarExpense, setStellarExpense] = useState(23750);
  const [simulationFlash, setSimulationFlash] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("token"));
    }
  }, []);

  const triggerFlash = () => {
    setSimulationFlash(true);
    setTimeout(() => setSimulationFlash(false), 800);
  };

  const handleAddIncomeMass = () => {
    const boost = 15000;
    setStellarIncome(prev => prev + 5000);
    setStellarBalance(prev => prev + boost);
    triggerFlash();
  };

  const handleAddExpenseMeteor = () => {
    const drainage = 8000;
    setStellarExpense(prev => prev + 2500);
    setStellarBalance(prev => prev - drainage);
    triggerFlash();
  };

  const handleResetSimulation = () => {
    setStellarBalance(482500);
    setStellarIncome(72000);
    setStellarExpense(23750);
    triggerFlash();
  };

  // Helper values for current details panel based on selected orbit
  const orbitDetails = {
    sun: {
      title: "Core Balance Sun",
      tagline: "The core gravitational center of your financial cosmos.",
      metric: `₹${stellarBalance.toLocaleString()}`,
      subtext: "Represents total liquid assets and net worth gravity. All orbits derive stability from the density of this core.",
      status: "Stable Core Orbit",
      statusColor: "text-amber-400",
      speed: "1.00x Gravity Multiplier",
      icon: <Orbit className="w-5 h-5 text-amber-400" />
    },
    income: {
      title: "Inflow Planet (Vesta)",
      tagline: "Steady solar wind fueling your growing wealth reserves.",
      metric: `+₹${stellarIncome.toLocaleString()} / mo`,
      subtext: "Active income streams, freelance revenues, and stellar commissions orbiting the core hub.",
      status: "High Acceleration",
      statusColor: "text-emerald-400",
      speed: "Orbit Period: 16 days",
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />
    },
    expense: {
      title: "Expense Asteroid Belt",
      tagline: "Scattered debris threatening to drain core power.",
      metric: `-₹${stellarExpense.toLocaleString()} / mo`,
      subtext: "Regular subscriptions, rent, utilities, and minor asteroid impacts. Manage velocity to avoid collision.",
      status: "Controlled Expansion",
      statusColor: "text-red-400",
      speed: "Orbit Period: 24 days",
      icon: <TrendingDown className="w-5 h-5 text-red-400" />
    },
    savings: {
      title: "Savings Ring Star (Astraea)",
      tagline: "A beautiful protected sphere accumulating high-density reserves.",
      metric: `54.2% Savings Ratio`,
      subtext: "Funds diverted into deep stellar vaults. Shielded against regular expense asteroid collisions.",
      status: "Accelerated Mass",
      statusColor: "text-violet-400",
      speed: "Orbit Period: 36 days",
      icon: <Sparkles className="w-5 h-5 text-violet-400" />
    },
    investment: {
      title: "Compound Growth Planet (Nirvana)",
      tagline: "Expanding celestial systems creating compounding value.",
      metric: "+12.4% Asset Yield",
      subtext: "Stocks, crypto nodes, mutual galaxy holdings, and yield farms compounding value over time.",
      status: "Expanding Orbit",
      statusColor: "text-cyan-400",
      speed: "Orbit Period: 48 days",
      icon: <Globe className="w-5 h-5 text-cyan-400" />
    }
  };

  const currentDetails = orbitDetails[selectedOrbit];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-outfit transition-colors duration-500 relative">
      
      {/* ── AMBIENT CELESTIAL BACKGROUNDS ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Glow / Nebulas */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-violet-600/10 dark:bg-violet-600/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/10 dark:bg-emerald-600/5 rounded-full blur-[160px]" />
        <div className="absolute top-[40%] right-[10%] w-[45%] h-[45%] bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[140px]" />
        
        {/* Twinkling Star Background Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:24px_24px] dark:opacity-30 dark:bg-[radial-gradient(rgba(255,255,255,0.25)_1.5px,transparent_1.5px)]" />
      </div>

      {/* ── HEADER NAVBAR ── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          
          {/* Logo with Orbital theme */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/")}
            className="flex items-center gap-3 font-syne text-xl font-extrabold tracking-tight cursor-pointer"
          >
            <span className="bg-primary text-primary-foreground p-2 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center">
              <Orbit className="w-5 h-5 animate-pulse" />
            </span>
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Finance<span className="text-primary">Flow</span>
            </span>
          </motion.div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <a href="#galaxy-intro" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Cosmic Engine
            </a>
            <a href="#solar-simulation" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <Orbit className="w-4 h-4" /> Stellar Simulator
            </a>
            <a href="#cosmic-features" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Features
            </a>
            <a href="#pricing-tiers" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <Rocket className="w-4 h-4" /> Launch Plans
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all border border-transparent hover:border-border/40"
              aria-label="Toggle celestial lighting"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            {isLoggedIn ? (
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 h-10 shadow-lg shadow-primary/20 rounded-xl flex items-center gap-2 border-none transition-all duration-300 font-outfit"
              >
                Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-bold text-muted-foreground hover:text-foreground px-3 py-2 transition-colors"
                >
                  Log In
                </Link>
                <Button
                  onClick={() => router.push("/register")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 h-10 shadow-lg shadow-primary/20 rounded-xl border-none transition-all duration-300 font-outfit"
                >
                  Launch Ships
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO SECTION WITH SWIRLING GALAXY BG ── */}
      <section id="galaxy-intro" className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden border-b border-border/20">
        
        {/* SWIRLING GALAXY SVG BACKGROUND */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-25 dark:opacity-35 pointer-events-none mix-blend-screen overflow-visible z-0">
          <svg className="w-full h-full" viewBox="0 0 800 800" fill="none">
            <defs>
              <radialGradient id="galaxyGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
                <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
              <filter id="blurGalaxy" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="25" />
              </filter>
            </defs>

            <motion.g
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 200, ease: "linear" }}
              style={{ transformOrigin: "400px 400px" }}
            >
              {/* Outer Swirling Arms */}
              <path d="M 400 400 Q 450 300, 580 260 T 730 320 T 780 480" stroke="url(#galaxyGrad)" strokeWidth="45" strokeLinecap="round" filter="url(#blurGalaxy)" />
              <path d="M 400 400 Q 350 500, 220 540 T 70 480 T 20 320" stroke="url(#galaxyGrad)" strokeWidth="45" strokeLinecap="round" filter="url(#blurGalaxy)" />
              <path d="M 400 400 Q 300 350, 260 220 T 320 70 T 480 20" stroke="url(#galaxyGrad)" strokeWidth="35" strokeLinecap="round" filter="url(#blurGalaxy)" />
              <path d="M 400 400 Q 500 450, 540 580 T 480 730 T 320 780" stroke="url(#galaxyGrad)" strokeWidth="35" strokeLinecap="round" filter="url(#blurGalaxy)" />

              {/* Sparkling Stars along spiral branches */}
              <circle cx="500" cy="280" r="2.5" fill="#fff" opacity="0.9" />
              <circle cx="580" cy="240" r="1.5" fill="#3b82f6" opacity="0.7" />
              <circle cx="650" cy="270" r="3" fill="#8b5cf6" opacity="0.8" />
              <circle cx="700" cy="350" r="2" fill="#fff" opacity="0.9" />
              <circle cx="300" cy="520" r="2" fill="#fff" opacity="0.9" />
              <circle cx="220" cy="550" r="3" fill="#06b6d4" opacity="0.8" />
              <circle cx="150" cy="500" r="1.5" fill="#8b5cf6" opacity="0.7" />
              <circle cx="90" cy="420" r="2" fill="#fff" opacity="0.9" />
              <circle cx="350" cy="200" r="2.5" fill="#fff" opacity="0.9" />
              <circle cx="280" cy="150" r="2" fill="#3b82f6" opacity="0.7" />
              <circle cx="450" cy="600" r="2" fill="#fff" opacity="0.8" />
              <circle cx="530" cy="650" r="2.5" fill="#06b6d4" opacity="0.9" />
            </motion.g>

            {/* Glowing Galaxy Core */}
            <circle cx="400" cy="400" r="60" fill="url(#galaxyGrad)" filter="url(#blurGalaxy)" />
            <circle cx="400" cy="400" r="20" fill="#fff" opacity="0.6" filter="blur(8px)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20"
            >
              <Rocket className="w-3.5 h-3.5 animate-bounce" />
              Navigate Your Financial Constellation
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-syne tracking-tight leading-[1.08] text-foreground"
            >
              Orbit Your Wealth. <br />
              Map Your Cash Flow. <br />
              <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                Control the Galaxy.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-lg sm:text-xl max-w-xl leading-relaxed font-light"
            >
              FinanceFlow transforms absolute tracking spreadsheets into a gorgeous, highly visual stellar mapping of your financial ecosystem. Pilot assets, observe gravity balances, and secure your horizon.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Button
                onClick={() => router.push(isLoggedIn ? "/dashboard" : "/register")}
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-8 h-12 text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 rounded-xl flex items-center gap-2 group transition-all duration-300 font-outfit"
              >
                {isLoggedIn ? "Go to Dashboard" : "Initiate Free System"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Button>
              <a
                href="#solar-simulation"
                className="inline-flex items-center justify-center font-bold px-6 h-12 text-base text-muted-foreground hover:text-foreground transition-all border border-border hover:bg-muted/50 rounded-xl"
              >
                Scan Orbit Map
              </a>
            </motion.div>

            {/* Galaxy Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 sm:gap-10 pt-8 border-t border-border/40 w-full"
            >
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold font-syne text-primary">15k+</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Star Pilots</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold font-syne text-violet-500">₹90Cr+</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Asset Mass Tracked</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold font-syne text-cyan-500">99.9%</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Uptime Frequency</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Hero Stellar Illustration */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Background glowing rings */}
            <div className="absolute w-[450px] h-[450px] bg-gradient-to-tr from-primary/10 to-cyan-500/10 blur-[80px] -z-10 rounded-full opacity-60 animate-pulse" />
            <div className="absolute border border-dashed border-white/5 rounded-full w-[440px] h-[440px] animate-spin" style={{ animationDuration: "120s" }} />
            <div className="absolute border border-dashed border-white/10 rounded-full w-[320px] h-[320px] animate-spin" style={{ animationDuration: "80s", animationDirection: "reverse" }} />

            {/* Astronaut space vector floating */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative p-2"
            >
              <div className="bg-card/40 dark:bg-slate-900/60 backdrop-blur-xl border border-border/80 dark:border-white/10 rounded-3xl p-6 shadow-2xl relative max-w-[400px]">
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                    <Orbit className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} /> Cosmic Dashboard Live
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">system_online.sh</span>
                </div>
                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center bg-background/50 border border-border/30 rounded-xl p-3.5">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground">Galactic Balance</p>
                      <p className="text-xl font-black text-foreground mt-0.5">₹4,82,500</p>
                    </div>
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Wallet className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-emerald-500">Inflows Rate</p>
                      <p className="text-sm font-black text-emerald-500 mt-0.5">+₹72k/mo</p>
                    </div>
                    <div className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-red-500">Outflows Mass</p>
                      <p className="text-sm font-black text-red-500 mt-0.5">-₹23.7k/mo</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border/30 flex justify-between text-xs text-muted-foreground">
                    <span>Trajectory: Positive</span>
                    <span className="text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5" onClick={() => router.push(isLoggedIn ? "/dashboard" : "/register")}>
                      View Radar <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ── INTERACTIVE SOLAR SYSTEM SIMULATION ── */}
      <section id="solar-simulation" className="py-24 max-w-7xl mx-auto px-6 relative">
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            Stellar Interface
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-syne tracking-tight">
            Map and Simulate Your Financial System
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Tap or hover over each financial planet orbit below to inspect its volume and inject simulated assets directly into the trajectory.
          </p>
        </div>

        {/* Solar System Dashboard Widget */}
        <div className="w-full bg-card/40 dark:bg-slate-900/60 backdrop-blur-xl border border-border/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col lg:flex-row gap-8 items-center min-h-[580px]">
          
          {/* Outer Ring Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-cyan-500/5 pointer-events-none rounded-3xl" />
          
          {/* SOLAR SYSTEM SVG COLUMN */}
          <div className="w-full lg:w-1/2 flex justify-center items-center relative min-h-[420px] sm:min-h-[500px]">
            {/* Center Solar Flares */}
            <div className={`absolute w-[95px] h-[95px] rounded-full bg-amber-500/20 blur-[20px] transition-all duration-500 ${simulationFlash ? "scale-[1.8] bg-primary/30" : "scale-100"}`} />
            
            <svg className="w-full max-w-[480px] aspect-square overflow-visible" viewBox="0 0 600 600" fill="none">
              <defs>
                <radialGradient id="solarGold" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                  <stop offset="60%" stopColor="#d97706" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="incomeGreen" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="1" />
                  <stop offset="70%" stopColor="#059669" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="expenseRed" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fb7185" stopOpacity="1" />
                  <stop offset="70%" stopColor="#e11d48" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#be123c" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="savingsViolet" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="1" />
                  <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#6d28d9" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="investmentCyan" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
                  <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
                </radialGradient>
                
                <filter id="solarGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="15" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Concentric Dashed Orbit Circles */}
              <circle cx="300" cy="300" r="75" stroke={selectedOrbit === "income" ? "#10b981" : "rgba(16,185,129,0.15)"} strokeWidth={selectedOrbit === "income" ? "2.5" : "1.5"} strokeDasharray="6 6" className="transition-all duration-300" />
              <circle cx="300" cy="300" r="135" stroke={selectedOrbit === "expense" ? "#f43f5e" : "rgba(244,63,94,0.15)"} strokeWidth={selectedOrbit === "expense" ? "2.5" : "1.5"} strokeDasharray="8 6" className="transition-all duration-300" />
              <circle cx="300" cy="300" r="195" stroke={selectedOrbit === "savings" ? "#8b5cf6" : "rgba(139,92,246,0.15)"} strokeWidth={selectedOrbit === "savings" ? "2.5" : "1.5"} strokeDasharray="10 8" className="transition-all duration-300" />
              <circle cx="300" cy="300" r="255" stroke={selectedOrbit === "investment" ? "#06b6d4" : "rgba(6,182,212,0.12)"} strokeWidth={selectedOrbit === "investment" ? "2.5" : "1.5"} strokeDasharray="12 10" className="transition-all duration-300" />

              {/* CORE SUN (Net Balance Hub) */}
              <g className="cursor-pointer" onClick={() => setSelectedOrbit("sun")} onMouseEnter={() => setSelectedOrbit("sun")}>
                <motion.circle
                  cx="300"
                  cy="300"
                  r="35"
                  fill="url(#solarGold)"
                  filter="url(#solarGlow)"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                />
                <circle cx="300" cy="300" r="25" fill="#f59e0b" />
                <motion.path
                  d="M 300 288 L 300 312 M 292 294 L 308 294 M 294 306 L 306 306"
                  stroke="#fff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                  style={{ transformOrigin: "300px 300px" }}
                />
              </g>

              {/* ORBIT 1: Income Planet (Vesta) */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
                style={{ transformOrigin: "300px 300px" }}
              >
                <g 
                  transform="translate(300, 225)" 
                  className="cursor-pointer group"
                  onClick={() => setSelectedOrbit("income")}
                  onMouseEnter={() => setSelectedOrbit("income")}
                >
                  <circle r="10" fill="url(#incomeGreen)" filter="url(#solarGlow)" />
                  <circle r="7" fill="#10b981" />
                  <ellipse rx="15" ry="4" fill="none" stroke="rgba(16,185,129,0.5)" strokeWidth="1.2" transform="rotate(-15)" />
                </g>
              </motion.g>

              {/* ORBIT 2: Expense Planet (Asteroid) */}
              <motion.g
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 26, ease: "linear" }}
                style={{ transformOrigin: "300px 300px" }}
              >
                <g 
                  transform="translate(300, 165)" 
                  className="cursor-pointer"
                  onClick={() => setSelectedOrbit("expense")}
                  onMouseEnter={() => setSelectedOrbit("expense")}
                >
                  <circle r="14" fill="url(#expenseRed)" filter="url(#solarGlow)" />
                  <circle r="10" fill="#f43f5e" />
                  {/* Crater markings */}
                  <circle cx="-3" cy="-3" r="2.2" fill="rgba(0,0,0,0.22)" />
                  <circle cx="3" cy="2.5" r="1.8" fill="rgba(0,0,0,0.22)" />
                  <circle cx="-2" cy="4" r="1" fill="rgba(0,0,0,0.22)" />
                </g>
              </motion.g>

              {/* ORBIT 3: Savings Planet (Astraea) */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                style={{ transformOrigin: "300px 300px" }}
              >
                <g 
                  transform="translate(300, 105)" 
                  className="cursor-pointer"
                  onClick={() => setSelectedOrbit("savings")}
                  onMouseEnter={() => setSelectedOrbit("savings")}
                >
                  <circle r="18" fill="url(#savingsViolet)" filter="url(#solarGlow)" />
                  <circle r="13" fill="#8b5cf6" />
                  {/* Beautiful Satellites/Rings */}
                  <ellipse rx="27" ry="8" fill="none" stroke="rgba(139,92,246,0.6)" strokeWidth="2.5" transform="rotate(20)" />
                  <circle cx="20" cy="-6" r="2" fill="#d8b4fe" />
                </g>
              </motion.g>

              {/* ORBIT 4: Investment Planet (Nirvana) */}
              <motion.g
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 55, ease: "linear" }}
                style={{ transformOrigin: "300px 300px" }}
              >
                <g 
                  transform="translate(300, 45)" 
                  className="cursor-pointer"
                  onClick={() => setSelectedOrbit("investment")}
                  onMouseEnter={() => setSelectedOrbit("investment")}
                >
                  <circle r="13" fill="url(#investmentCyan)" filter="url(#solarGlow)" />
                  <circle r="9" fill="#06b6d4" />
                  {/* Rotating Satellite group */}
                  <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                    style={{ transformOrigin: "0px 0px" }}
                  >
                    <circle cx="20" cy="0" r="3" fill="#22d3ee" />
                    <line x1="0" y1="0" x2="20" y2="0" stroke="rgba(6,182,212,0.3)" strokeWidth="0.8" />
                  </motion.g>
                </g>
              </motion.g>
            </svg>
          </div>

          {/* SIMULATOR COMMAND CONTROLS */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-6">
            
            {/* Header Details */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-muted text-foreground flex items-center justify-center">
                    {currentDetails.icon}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-lg sm:text-xl font-syne">{currentDetails.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{currentDetails.tagline}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-muted border border-border/40 ${currentDetails.statusColor}`}>
                  {currentDetails.status}
                </span>
              </div>

              {/* Dynamic Mass Indicator Card */}
              <div className="bg-background/80 dark:bg-slate-950/40 border border-border/50 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-muted-foreground">
                  {currentDetails.speed}
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Stellar Density</p>
                <h3 className={`text-3xl font-black font-syne mt-2 transition-all duration-300 ${simulationFlash ? "scale-[1.03] text-primary" : "scale-100"}`}>
                  {currentDetails.metric}
                </h3>
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed font-light">
                  {currentDetails.subtext}
                </p>
              </div>
            </div>

            {/* Simulated actions */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 justify-start">
                <FaBolt className="text-amber-500 animate-bounce" /> Solar Energy Adjustment Panel
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddIncomeMass}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:translate-y-px transition-all"
                >
                  <Plus className="w-4 h-4" /> Inject Income Mass (+₹15,000)
                </button>
                <button
                  onClick={handleAddExpenseMeteor}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-500/10 hover:shadow-red-500/20 active:translate-y-px transition-all"
                >
                  <Plus className="w-4 h-4" /> Deploy Expense Asteroid (+₹8,000)
                </button>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={handleResetSimulation}
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-align Cosmic Coordinates
                </button>
                <span className="text-[10px] text-muted-foreground font-mono">stability_factor: 98.42%</span>
              </div>
            </div>

            {/* CTA inside Solar Simulator */}
            <div className="pt-5 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground leading-snug">
                Configure your live bank credentials to sync custom celestial coordinates automatically.
              </span>
              <Button
                onClick={() => router.push(isLoggedIn ? "/dashboard" : "/register")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold w-full sm:w-auto px-6 h-10 shadow-lg shadow-primary/10 rounded-xl flex items-center justify-center gap-2 border-none font-outfit"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

          </div>

        </div>
      </section>

      {/* ── STELLAR FEATURES SECTION ── */}
      <section id="cosmic-features" className="py-24 border-t border-border/20 relative">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-500 bg-cyan-500/10 px-3 py-1 rounded-full">
              Celestial Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-syne tracking-tight">
              A Complete Planetary Toolkit
            </h2>
            <p className="text-muted-foreground text-lg font-light">
              We compile all cash coordinates to outline concrete trajectories, protect net balance shields, and accelerate savings stars.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-card/45 backdrop-blur-md border border-border p-8 rounded-3xl space-y-6 shadow-md hover:border-primary/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Orbit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-syne text-foreground">Stellar Orbit Records</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                Quickly record every transaction coordinate. Filter by asset galaxy clusters, customize categories, and maintain flawless balance stability.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card/45 backdrop-blur-md border border-border p-8 rounded-3xl space-y-6 shadow-md hover:border-violet-500/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-syne text-foreground">Nebula Analytics</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                Observe cash flow distribution through responsive, glowing radial breakdowns. No complex spreadsheets required. Just pure visual insights.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card/45 backdrop-blur-md border border-border p-8 rounded-3xl space-y-6 shadow-md hover:border-cyan-500/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-syne text-foreground">Meteor-Proof Shield</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                Rest easy with secure local storage validation and high-grade cryptographic shielding. Your stellar net coordinates belong to you alone.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── STELLAR PLANS PRICING ── */}
      <section id="pricing-tiers" className="py-24 border-t border-border/20 relative">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              System Levels
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-syne tracking-tight">
              Select Your Navigation Ship
            </h2>
            <p className="text-muted-foreground text-lg font-light">
              Accelerate your financial orbits with stellar limits or premium galactic control capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Voyager Free Tier */}
            <div className="bg-card/45 backdrop-blur-sm border border-border p-8 rounded-3xl flex flex-col justify-between space-y-8 relative hover:border-border/80 transition-all">
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-syne">Stellar Voyager</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">Perfect for individual cosmic pilots tracking simple asset coordinates.</p>
                
                <div className="pt-2">
                  <span className="text-4xl font-extrabold font-syne text-foreground">₹0</span>
                  <span className="text-sm text-muted-foreground font-light"> / mo</span>
                </div>

                <div className="space-y-2.5 pt-4">
                  <div className="flex items-center gap-2.5 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" /> standard solar coordinates recording
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" /> Core sun balance dashboard view
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" /> Inflow and outflow category log
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground/60 line-through">
                    <span>Advanced nebula predictive analytics</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground/60 line-through">
                    <span>Stellar data exports (PDF/CSV nodes)</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => router.push("/register")}
                className="w-full bg-transparent hover:bg-muted border border-border text-foreground hover:text-foreground font-bold h-11 rounded-xl transition-all duration-300 font-outfit"
              >
                Board Space Ship
              </Button>
            </div>

            {/* Commander Premium Tier */}
            <div className="bg-card border-2 border-primary p-8 rounded-3xl flex flex-col justify-between space-y-8 relative shadow-2xl scale-[1.02] transition-all">
              
              <span className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-primary/20">
                Most Popular
              </span>

              <div className="space-y-4">
                <h3 className="text-xl font-bold font-syne flex items-center gap-2 text-foreground">
                  Galactic Commander <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">Unlocks deep telescope systems, predictive trajectory analytics, and export layers.</p>
                
                <div className="pt-2">
                  <span className="text-4xl font-extrabold font-syne text-foreground">₹249</span>
                  <span className="text-sm text-muted-foreground font-light"> / mo</span>
                </div>

                <div className="space-y-2.5 pt-4">
                  <div className="flex items-center gap-2.5 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" /> Full solar coordinates recording
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" /> Core sun balance dashboard view
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" /> Inflow and outflow category log
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" /> Advanced nebula predictive analytics
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" /> Stellar data exports (PDF/CSV nodes)
                  </div>
                </div>
              </div>

              <Button
                onClick={() => router.push("/register")}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 shadow-lg shadow-primary/10 rounded-xl border-none transition-all duration-300 font-outfit"
              >
                Initiate Warp Drive
              </Button>
            </div>

          </div>

        </div>
      </section>

      {/* ── STELLAR TESTIMONIALS ── */}
      <section className="py-24 border-t border-border/20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              Comms Log
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-syne tracking-tight">
              Backed by Stellar Developers
            </h2>
            <p className="text-muted-foreground text-lg font-light">
              Loved by cosmic builders, freelance astronauts, and product engineers who demand beautiful interface control grids.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="bg-card/45 border border-border/60 p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic font-light">
                  "Spreadsheets were making me lose orbit of my freelance design cash stream coordinates. FinanceFlow is direct, beautifully cosmic, and keeps planetary parameters stable."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/15 text-primary font-extrabold text-sm flex items-center justify-center">
                  AK
                </div>
                <div>
                  <h6 className="text-xs font-bold text-foreground">Aman Kapoor</h6>
                  <p className="text-[10px] text-muted-foreground">Product Pilot at Razorpay</p>
                </div>
              </div>
            </div>

            <div className="bg-card/45 border border-border/60 p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic font-light">
                  "The visual solar simulations on asset ratios completely changed how I allocate funds. Dark mode feels like a real space observatory deck. Strongly recommended!"
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-500/15 text-violet-500 font-extrabold text-sm flex items-center justify-center">
                  SP
                </div>
                <div>
                  <h6 className="text-xs font-bold text-foreground">Sneha Patel</h6>
                  <p className="text-[10px] text-muted-foreground">Core Engineer at CRED</p>
                </div>
              </div>
            </div>

            <div className="bg-card/45 border border-border/60 p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic font-light">
                  "Finally, a budgeting UI that is lightning fast and does not feel bloated. The responsive layout scales smoothly across my workstation radar and mobile receiver."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/15 text-cyan-500 font-extrabold text-sm flex items-center justify-center">
                  RD
                </div>
                <div>
                  <h6 className="text-xs font-bold text-foreground">Rohan Das</h6>
                  <p className="text-[10px] text-muted-foreground">Stellar Architect at Polygon</p>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-16 flex flex-wrap gap-8 justify-center items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-300">
            <div className="flex items-center gap-1.5 font-bold text-sm"><Users className="w-5 h-5" /> Razorsharp Labs</div>
            <div className="flex items-center gap-1.5 font-bold text-sm"><Building className="w-5 h-5" /> CRED Systems</div>
            <div className="flex items-center gap-1.5 font-bold text-sm"><HeartHandshake className="w-5 h-5" /> PolyGlobal Systems</div>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION SECTION ── */}
      <section className="py-24 max-w-5xl mx-auto px-6 text-center relative z-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-violet-500/5 to-cyan-500/10 blur-[100px] -z-10 rounded-3xl" />
        
        <div className="bg-card/50 backdrop-blur-2xl border border-border/80 p-8 sm:p-12 md:p-16 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
          
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-extrabold font-syne tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to secure your celestial coordinates?
          </h2>
          
          <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto font-light">
            Deploy FinanceFlow to start tracking cash flow with stellar detail in under 3 minutes.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button
              onClick={() => router.push(isLoggedIn ? "/dashboard" : "/register")}
              className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-8 h-12 shadow-xl shadow-primary/20 hover:shadow-primary/30 rounded-xl flex items-center justify-center gap-2 group transition-all duration-300 font-outfit"
            >
              {isLoggedIn ? "Enter Core Dashboard" : "Deploy Voyager Shuttle"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Button>
            <Link
              href="/login"
              className="inline-flex items-center justify-center font-bold px-6 h-12 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all border border-border rounded-xl"
            >
              Connect Existing Ship
            </Link>
          </div>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/40 py-12 bg-muted/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-8 pb-10 border-b border-border/20">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5 font-syne text-xl font-extrabold tracking-tight">
              <span className="bg-primary text-primary-foreground p-2 rounded-xl">
                <Orbit className="w-5 h-5" />
              </span>
              <span>
                Finance<span className="text-primary">Flow</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm font-light leading-relaxed">
              Consolidate budgets, track expenses, map wealth strategies, and enjoy a state of the art financial view.
            </p>
          </div>

          <div className="md:col-span-2.5 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">Mission Parameters</h5>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li><a href="#galaxy-intro" className="hover:text-foreground transition-colors">Cosmic Engine</a></li>
              <li><a href="#solar-simulation" className="hover:text-foreground transition-colors">Simulator Radar</a></li>
              <li><a href="#pricing-tiers" className="hover:text-foreground transition-colors">Nav Levels</a></li>
            </ul>
          </div>

          <div className="md:col-span-2.5 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">Navigation</h5>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li><a href="https://nextjs.org" className="hover:text-foreground transition-colors">Next.js Engine</a></li>
              <li><a href="https://tailwindcss.com" className="hover:text-foreground transition-colors">Tailwind v4</a></li>
              <li><a href="https://framer.com/motion" className="hover:text-foreground transition-colors">Framer Motion</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">System Log</h5>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Privacy Protocol</Link></li>
              <li><Link href="/" className="hover:text-foreground transition-colors">Terms of Comm</Link></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground font-medium">
          <p>© {new Date().getFullYear()} FinanceFlow Corporation · Engineered for galactic stability.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <span className="hover:text-foreground transition-colors cursor-pointer">Stellar Net</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">GitHub Node</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Comm Center</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
