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
  Trash2, 
  ArrowUpRight, 
  Check, 
  Star,
  Users,
  Building,
  HeartHandshake
} from "lucide-react";
import CountUp from "react-countup";
import { FaBolt, FaBurger, FaPlane, FaGamepad } from "react-icons/fa6";

export default function Home() {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Interactive mock state for Hero demo widget
  const [mockBalance, setMockBalance] = useState(48250);
  const [mockIncome, setMockIncome] = useState(72000);
  const [mockExpense, setMockExpense] = useState(23750);
  const [mockTransactions, setMockTransactions] = useState([
    { id: 1, title: "Freelance Project", amount: 15000, type: "income", category: "Design", date: "Just now" },
    { id: 2, title: "Coffee & Pastry", amount: 450, type: "expense", category: "Food", date: "2 hours ago" },
    { id: 3, title: "Monthly Subscription", amount: 1299, type: "expense", category: "Utilities", date: "1 day ago" },
  ]);
  const [activeTab, setActiveTab] = useState("features");

  useEffect(() => {
    setMounted(true);
    // Check local storage for token
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("token"));
    }
  }, []);

  const handleAddMock = (type) => {
    if (type === "income") {
      const amount = 5000;
      setMockIncome(prev => prev + amount);
      setMockBalance(prev => prev + amount);
      setMockTransactions(prev => [
        {
          id: Date.now(),
          title: "Freelance Bonus",
          amount,
          type: "income",
          category: "Work",
          date: "Just now"
        },
        ...prev
      ].slice(0, 4));
    } else {
      const amount = 1200;
      setMockExpense(prev => prev + amount);
      setMockBalance(prev => prev - amount);
      setMockTransactions(prev => [
        {
          id: Date.now(),
          title: "Dinner Outing",
          amount,
          type: "expense",
          category: "Food",
          date: "Just now"
        },
        ...prev
      ].slice(0, 4));
    }
  };

  const handleResetMock = () => {
    setMockBalance(48250);
    setMockIncome(72000);
    setMockExpense(23750);
    setMockTransactions([
      { id: 1, title: "Freelance Project", amount: 15000, type: "income", category: "Design", date: "Just now" },
      { id: 2, title: "Coffee & Pastry", amount: 450, type: "expense", category: "Food", date: "2 hours ago" },
      { id: 3, title: "Monthly Subscription", amount: 1299, type: "expense", category: "Utilities", date: "1 day ago" },
    ]);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-outfit transition-colors duration-300">
      
      {/* ── HEADER NAVBAR ── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/")}
            className="flex items-center gap-2.5 font-syne text-xl font-extrabold tracking-tight cursor-pointer"
          >
            <span className="bg-red-500 text-white p-2 rounded-xl shadow-lg shadow-red-500/25">
              <Wallet className="w-5 h-5" />
            </span>
            <span>
              Finance<span className="text-red-500">Flow</span>
            </span>
          </motion.div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#demo" className="hover:text-foreground transition-colors">Live Simulation</a>
            <a href="#analytics" className="hover:text-foreground transition-colors">Insights</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all border border-transparent hover:border-border/40"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {isLoggedIn ? (
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 h-10 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 rounded-xl flex items-center gap-2 border-none transition-all duration-300 font-outfit"
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
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 h-10 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 rounded-xl border-none transition-all duration-300 font-outfit"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden border-b border-border/20">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 dark:bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Dot Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text (7 cols) */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-red-500 bg-red-500/10 border border-red-500/20"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Revolutionize your wealth tracking
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-syne tracking-tight leading-[1.08] text-foreground"
            >
              Take Control of <br />
              Your Wealth. <br />
              <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                Track Smarter.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground text-lg sm:text-xl max-w-xl leading-relaxed font-light"
            >
              FinanceFlow consolidates your budget, analytics, and future planning inside a single, high-fidelity ecosystem. Beautiful, intuitive, and lightning fast.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Button
                onClick={() => router.push(isLoggedIn ? "/dashboard" : "/register")}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 h-12 text-base shadow-xl shadow-red-500/25 hover:shadow-red-500/35 rounded-xl border-none flex items-center gap-2 group transition-all duration-300 font-outfit"
              >
                {isLoggedIn ? "Go to Dashboard" : "Start Tracking Free"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <a
                href="#demo"
                className="inline-flex items-center justify-center font-bold px-6 h-12 text-base text-muted-foreground hover:text-foreground transition-colors border border-border hover:bg-muted/50 rounded-xl"
              >
                Try Interactive Demo
              </a>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 sm:gap-10 pt-8 border-t border-border/40 w-full"
            >
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold font-syne">10k+</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Active Users</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold font-syne">₹85Cr+</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Volume Tracked</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold font-syne">4.9/5</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">User Rating</p>
              </div>
            </motion.div>
          </div>

          {/* Interactive Mock Dashboard (6 cols) */}
          <div className="lg:col-span-6 relative" id="demo">
            {/* Ambient behind-widget glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-emerald-500/10 blur-[80px] -z-10 rounded-full opacity-60" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full bg-card/60 backdrop-blur-2xl border border-border/80 rounded-3xl p-5 sm:p-6 shadow-2xl relative"
            >
              
              {/* Header with Widget Controls */}
              <div className="flex items-center justify-between pb-5 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-muted-foreground ml-2 font-mono">live_simulator.js</span>
                </div>
                <button 
                  onClick={handleResetMock} 
                  className="text-xs text-red-500 hover:text-red-600 bg-red-500/10 px-2 py-1 rounded-lg font-semibold transition-colors"
                >
                  Reset Demo
                </button>
              </div>

              {/* Grid Cards (Balance, Income, Expense) */}
              <div className="grid grid-cols-3 gap-3 my-5">
                <div className="bg-background/80 border border-border/50 rounded-2xl p-3.5 space-y-1">
                  <p className="text-xs font-bold text-muted-foreground">Net Balance</p>
                  <p className="text-base sm:text-lg font-black text-foreground">
                    ₹{mockBalance.toLocaleString()}
                  </p>
                </div>
                <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 rounded-2xl p-3.5 space-y-1">
                  <p className="text-xs font-bold text-emerald-500">Total Income</p>
                  <p className="text-base sm:text-lg font-black text-emerald-500">
                    ₹{mockIncome.toLocaleString()}
                  </p>
                </div>
                <div className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/15 rounded-2xl p-3.5 space-y-1">
                  <p className="text-xs font-bold text-red-500">Expenses</p>
                  <p className="text-base sm:text-lg font-black text-red-500">
                    ₹{mockExpense.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Main Interactive Interactive Widget Action Panel */}
              <div className="bg-background/50 border border-border/40 rounded-2xl p-4 mb-5 text-center">
                <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <FaBolt className="text-amber-500" /> Simulating Interactive Budget additions
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => handleAddMock("income")}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/15 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4" /> Add mock income (+₹5,000)
                  </button>
                  <button
                    onClick={() => handleAddMock("expense")}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-500/15 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4" /> Add mock expense (+₹1,200)
                  </button>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Recent Entries Log
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <AnimatePresence initial={false}>
                    {mockTransactions.map((tx) => (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -15, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 15, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-between items-center bg-background/90 hover:bg-background border border-border/50 hover:border-border px-4 py-3 rounded-xl transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                            tx.type === "income" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                          }`}>
                            {tx.type === "income" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-foreground leading-tight">{tx.title}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{tx.category} • {tx.date}</p>
                          </div>
                        </div>
                        <p className={`text-sm font-black ${
                          tx.type === "income" ? "text-emerald-500" : "text-red-500"
                        }`}>
                          {tx.type === "income" ? "+" : "-"}₹{tx.amount}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </section>

      {/* ── CORE VALUE FEATURE SHOWCASE ── */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6 relative">
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1 rounded-full">
            Core Features
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-syne tracking-tight">
            Designed to fit your high financial standard.
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            We bypass complex spreadsheets and archaic bank statements. Get structured analytics in a sleek package.
          </p>
        </div>

        {/* Features Tabs and Previews */}
        <div className="grid lg:grid-cols-12 gap-8 items-center mt-12">
          
          {/* Left: Tab options (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {[
              {
                id: "features",
                title: "Smart Transaction Log",
                desc: "Quickly record income and expenses with absolute precision. Categorize easily and keep notes on special transactions.",
                icon: <Wallet className="w-5 h-5" />
              },
              {
                id: "analytics",
                title: "Interactive Analytics",
                desc: "Observe where your money flows. View breakdowns of categories via rich responsive visualizations that make budgeting enjoyable.",
                icon: <PieChart className="w-5 h-5" />
              },
              {
                id: "savings",
                title: "Savings Accelerator",
                desc: "Calculate savings rates and balance adjustments instantly. Maintain clear target guidelines and easily exceed them.",
                icon: <TrendingUp className="w-5 h-5" />
              },
              {
                id: "security",
                title: "High-grade Security",
                desc: "Rest easy knowing your financial details are encrypted, stored securely, and completely isolated under private authentication keys.",
                icon: <Shield className="w-5 h-5" />
              }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-start gap-4 p-5 rounded-2xl text-left border transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-card border-border/80 shadow-md ring-1 ring-red-500/10 scale-[1.01]"
                    : "bg-transparent border-transparent hover:bg-muted/40 hover:border-border/30"
                }`}
              >
                <div className={`p-2.5 rounded-xl flex items-center justify-center transition-colors ${
                  activeTab === tab.id
                    ? "bg-red-500 text-white"
                    : "bg-muted/80 text-muted-foreground"
                }`}>
                  {tab.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-foreground">{tab.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{tab.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Rich Visual Showcase Card (7 cols) */}
          <div className="lg:col-span-7 h-full flex items-center">
            <div className="w-full bg-card/45 backdrop-blur-md border border-border/50 rounded-3xl p-6 sm:p-8 min-h-[400px] flex flex-col justify-between shadow-lg relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-60 h-60 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {activeTab === "features" && (
                  <motion.div
                    key="features"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center pb-4 border-b border-border/50">
                      <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2.5 py-1 rounded-md">Live Preview</span>
                      <span className="text-xs text-muted-foreground font-mono">app/components/expense-form</span>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-bold font-syne">Instant Log Sheet</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Never double guess where your budget stands. Add and adjust entries seamlessly in seconds.
                      </p>
                      
                      {/* Fake form mockup */}
                      <div className="space-y-3 bg-background/50 border border-border/40 rounded-2xl p-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Title</span>
                            <div className="h-8 bg-muted/60 rounded-lg flex items-center px-3 text-xs font-medium">Adobe Creative Cloud</div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Amount</span>
                            <div className="h-8 bg-muted/60 rounded-lg flex items-center px-3 text-xs font-bold text-red-500">₹4,230</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Category</span>
                            <div className="h-8 bg-muted/60 rounded-lg flex items-center px-3 text-xs font-medium">Software / Work</div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Actions</span>
                            <div className="h-8 bg-red-500 text-white rounded-lg flex items-center justify-center text-xs font-bold cursor-default">Simulated Add</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "analytics" && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center pb-4 border-b border-border/50">
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md">Distribution Insights</span>
                      <span className="text-xs text-muted-foreground font-mono">app/dashboard/analytics</span>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-bold font-syne">Category Outflows</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Watch how cash splits into distinct streams. Keep close guard on utilities, food, and miscellaneous costs.
                      </p>

                      {/* Visual Progress Bar Mockups representing categories */}
                      <div className="space-y-3.5 bg-background/50 border border-border/40 rounded-2xl p-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="flex items-center gap-1.5"><FaBurger className="text-red-500" /> Food & Dining Out</span>
                            <span className="text-red-500">78% Budget Limit</span>
                          </div>
                          <div className="w-full bg-muted/80 h-2 rounded-full overflow-hidden">
                            <div className="bg-red-500 h-full rounded-full" style={{ width: "78%" }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="flex items-center gap-1.5"><FaPlane className="text-emerald-500" /> Travel & Commuting</span>
                            <span className="text-emerald-500">32% Budget Limit</span>
                          </div>
                          <div className="w-full bg-muted/80 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "32%" }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="flex items-center gap-1.5"><FaGamepad className="text-amber-500" /> Entertainment & Games</span>
                            <span className="text-amber-500">92% Budget Limit</span>
                          </div>
                          <div className="w-full bg-muted/80 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: "92%" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "savings" && (
                  <motion.div
                    key="savings"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center pb-4 border-b border-border/50">
                      <span className="text-xs font-bold text-violet-500 bg-violet-500/10 px-2.5 py-1 rounded-md">Growth Speed</span>
                      <span className="text-xs text-muted-foreground font-mono">analytics/savings-rate</span>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-bold font-syne">Accelerate Financial Freedom</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Exposing savings ratios directly on the interface encourages strict self-regulation and rewards steady progress.
                      </p>

                      <div className="grid grid-cols-2 gap-4 bg-background/50 border border-border/40 rounded-2xl p-4">
                        <div className="text-center p-3 bg-muted/20 border border-border/30 rounded-xl space-y-1">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Target Savings</span>
                          <p className="text-2xl font-black text-violet-500 font-syne">45%</p>
                        </div>
                        <div className="text-center p-3 bg-violet-500/5 border border-violet-500/10 rounded-xl space-y-1">
                          <span className="text-[10px] font-bold text-violet-400 uppercase">Current Rate</span>
                          <p className="text-2xl font-black text-emerald-500 font-syne">54.2%</p>
                        </div>
                      </div>
                      
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" /> Target exceeded! You saved an extra ₹15,480 this calendar cycle.
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center pb-4 border-b border-border/50">
                      <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-md">Data Isolated</span>
                      <span className="text-xs text-muted-foreground font-mono">auth/secure-token</span>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-bold font-syne">Absolute Confidentiality</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Data belongs to you alone. We apply local storage token validation, secure hashing, and custom routing layers to block unauthorized requests.
                      </p>

                      <div className="space-y-3 bg-background/50 border border-border/40 rounded-2xl p-4 font-mono text-xs text-muted-foreground">
                        <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                          <Lock className="w-3.5 h-3.5" /> AES-256 JWT Encryption active
                        </div>
                        <div className="bg-muted/80 p-2.5 rounded-lg border border-border/30 break-all text-[10px] leading-relaxed">
                          eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVXNlciIsImV4cCI6MTcxNjExNTIwfQ...
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="pt-4 border-t border-border/40 text-xs text-muted-foreground flex items-center justify-between">
                <span>Next.js Client Components</span>
                <span className="font-semibold text-foreground hover:text-red-500 transition-colors flex items-center gap-0.5 cursor-pointer">
                  Explore full features <ChevronRight className="w-3 h-3" />
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── STATS / BENCHMARKS SECTION ── */}
      <section className="py-20 bg-muted/20 border-y border-border/40 relative">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <p className="text-4xl sm:text-5xl font-extrabold font-syne text-red-500">₹85,000,000+</p>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Volume Logged</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl sm:text-5xl font-extrabold font-syne text-red-500">99.98%</p>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Uptime Reliability</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl sm:text-5xl font-extrabold font-syne text-red-500">10,480</p>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Budgets Maintained</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl sm:text-5xl font-extrabold font-syne text-red-500">&lt; 15ms</p>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Server Latency</p>
          </div>
        </div>
      </section>

      {/* ── ADVANCED ANALYTICS VALUE SECTION ── */}
      <section id="analytics" className="py-24 max-w-7xl mx-auto px-6 relative">
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Graphic representation */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="bg-card/75 border border-border rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-red-500/5 pointer-events-none" />
              
              {/* Graphic Title */}
              <div className="flex justify-between items-center pb-4 border-b border-border/50 mb-6">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-md">Smart Insights engine</span>
                <span className="text-xs text-muted-foreground font-mono">insights_report.pdf</span>
              </div>

              {/* simulated insights items */}
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-2xl bg-background/50 border border-border/30 hover:border-border transition-all">
                  <div className="w-10 h-10 shrink-0 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">Entertainment Expense Increase</h5>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      You spent <span className="text-red-500 font-semibold">18% more</span> in food and games this week compared to last month's averages. Restrict casual spending for another 4 days.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-background/50 border border-border/30 hover:border-border transition-all">
                  <div className="w-10 h-10 shrink-0 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">Rent/Utilities Adjustment</h5>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Monthly utilities charges remain <span className="text-emerald-500 font-semibold">4.8% below</span> predictions. Save these extra funds for investment accounts.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-background/50 border border-border/30 hover:border-border transition-all">
                  <div className="w-10 h-10 shrink-0 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">Action Plan: 20% Savings Target</h5>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Based on current inflows, you require an additional ₹8,420 to reach this month's savings threshold. Check category logs for potential cuts.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Text explanation */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
              Financial intelligence
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-syne tracking-tight">
              Actionable advice. <br />No second guessing.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              We compile all data points to discover spending irregularities, outline concrete recommendations, and build custom models that align with your long term savings.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span className="text-sm font-semibold text-foreground">Advanced categorization heuristics</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span className="text-sm font-semibold text-foreground">Savings progress multipliers</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span className="text-sm font-semibold text-foreground">Custom warning limits for excessive spending</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── TESTIMONIALS SECTION ── */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative border-t border-border/20">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1 rounded-full">
            Social Proof
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-syne tracking-tight">
            Backed by users in top institutions.
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Loved by financial planners, freelance builders, and developers who command clean digital designs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="bg-card/40 backdrop-blur-sm border border-border/60 p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic font-light">
                "Spreadsheets were making me lose track of my freelance commissions. FinanceFlow is extremely direct, beautifully designed, and keeps my calculations sorted in seconds."
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 font-extrabold text-sm flex items-center justify-center">
                AK
              </div>
              <div>
                <h6 className="text-xs font-bold text-foreground">Aman Kapoor</h6>
                <p className="text-[10px] text-muted-foreground">Product Designer at Razorpay</p>
              </div>
            </div>
          </div>

          <div className="bg-card/40 backdrop-blur-sm border border-border/60 p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic font-light">
                "The instant calculations on savings rates completely changed how I regulate my lifestyle. Dark mode is absolutely stunning. Strongly recommended!"
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 font-extrabold text-sm flex items-center justify-center">
                SP
              </div>
              <div>
                <h6 className="text-xs font-bold text-foreground">Sneha Patel</h6>
                <p className="text-[10px] text-muted-foreground">Core Engineer at CRED</p>
              </div>
            </div>
          </div>

          <div className="bg-card/40 backdrop-blur-sm border border-border/60 p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic font-light">
                "Finally a budgeting UI that is lightning fast and does not feel bloated. The responsive layout scales smoothly across my workstation and mobile device."
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 font-extrabold text-sm flex items-center justify-center">
                RD
              </div>
              <div>
                <h6 className="text-xs font-bold text-foreground">Rohan Das</h6>
                <p className="text-[10px] text-muted-foreground">Tech Lead at Polygon</p>
              </div>
            </div>
          </div>

        </div>

        {/* Corporate Trust Badges */}
        <div className="mt-16 flex flex-wrap gap-8 justify-center items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-300">
          <div className="flex items-center gap-1.5 font-bold"><Users className="w-5 h-5" /> Razorsharp</div>
          <div className="flex items-center gap-1.5 font-bold"><Building className="w-5 h-5" /> CRED Labs</div>
          <div className="flex items-center gap-1.5 font-bold"><HeartHandshake className="w-5 h-5" /> PolyGlobal</div>
        </div>
      </section>

      {/* ── PRICING SECTION ── */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-6 border-t border-border/20 relative">
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1 rounded-full">
            Pricing Plans
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-syne tracking-tight">
            Select your budget acceleration tier.
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Simple, honest pricing. Pay only for advanced analysis tools and multi-account trackers.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Free Tier */}
          <div className="bg-card/45 backdrop-blur-sm border border-border p-8 rounded-3xl flex flex-col justify-between space-y-8 relative">
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-syne">Standard</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">Perfect for tracking personal budgets and routine outflows.</p>
              
              <div className="pt-2">
                <span className="text-4xl font-extrabold font-syne text-foreground">₹0</span>
                <span className="text-sm text-muted-foreground font-light"> / Month</span>
              </div>

              <div className="space-y-2.5 pt-4">
                <div className="flex items-center gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-red-500 shrink-0" /> Full income & expense recording
                </div>
                <div className="flex items-center gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-red-500 shrink-0" /> standard category analytics chart
                </div>
                <div className="flex items-center gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-red-500 shrink-0" /> Savings rates monitoring
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground/60 line-through">
                  <span>Advanced AI recommendations</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground/60 line-through">
                  <span>Export reports to PDF & Excel</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => router.push("/register")}
              className="w-full bg-transparent hover:bg-muted border border-border text-foreground hover:text-foreground font-bold h-11 rounded-xl transition-all duration-300 font-outfit"
            >
              Sign Up Now
            </Button>
          </div>

          {/* Premium Tier */}
          <div className="bg-card border-2 border-red-500 p-8 rounded-3xl flex flex-col justify-between space-y-8 relative shadow-2xl scale-[1.02]">
            
            {/* Pop tag */}
            <span className="absolute top-0 right-8 -translate-y-1/2 bg-red-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-red-500/20">
              Most Popular
            </span>

            <div className="space-y-4">
              <h3 className="text-xl font-bold font-syne flex items-center gap-2 text-foreground">
                Flow Premium <Sparkles className="w-4 h-4 text-red-500 animate-pulse" />
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">Fully unlocks advanced wealth models and export pipelines.</p>
              
              <div className="pt-2">
                <span className="text-4xl font-extrabold font-syne text-foreground">₹249</span>
                <span className="text-sm text-muted-foreground font-light"> / Month</span>
              </div>

              <div className="space-y-2.5 pt-4">
                <div className="flex items-center gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-red-500 shrink-0" /> Full income & expense recording
                </div>
                <div className="flex items-center gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-red-500 shrink-0" /> standard category analytics chart
                </div>
                <div className="flex items-center gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-red-500 shrink-0" /> Savings rates monitoring
                </div>
                <div className="flex items-center gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-red-500 shrink-0" /> Advanced AI recommendations
                </div>
                <div className="flex items-center gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-red-500 shrink-0" /> Export reports to PDF & Excel
                </div>
              </div>
            </div>

            <Button
              onClick={() => router.push("/register")}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold h-11 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 rounded-xl border-none transition-all duration-300 font-outfit"
            >
              Get Premium Access
            </Button>
          </div>

        </div>
      </section>

      {/* ── BOTTOM CALL TO ACTION ── */}
      <section className="py-24 max-w-5xl mx-auto px-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 via-amber-500/5 to-violet-500/10 blur-[100px] -z-10 rounded-3xl" />
        
        <div className="bg-card/50 backdrop-blur-2xl border border-border/80 p-8 sm:p-12 md:p-16 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
          
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-extrabold font-syne tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to secure your financial freedom?
          </h2>
          
          <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto font-light">
            Deploy FinanceFlow to start tracking cash flow with extreme detail in under 3 minutes.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button
              onClick={() => router.push(isLoggedIn ? "/dashboard" : "/register")}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 h-12 shadow-xl shadow-red-500/20 hover:shadow-red-500/30 rounded-xl border-none flex items-center justify-center gap-2 group transition-all duration-300 font-outfit"
            >
              {isLoggedIn ? "Access Dashboard" : "Register Free Account"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link
              href="/login"
              className="inline-flex items-center justify-center font-bold px-6 h-12 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all border border-border rounded-xl"
            >
              Login to existing account
            </Link>
          </div>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/40 py-12 bg-muted/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-8 pb-10 border-b border-border/20">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5 font-syne text-xl font-extrabold tracking-tight">
              <span className="bg-red-500 text-white p-2 rounded-xl">
                <Wallet className="w-5 h-5" />
              </span>
              <span>
                Finance<span className="text-red-500">Flow</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm font-light leading-relaxed">
              Consolidate budgets, track expenses, map wealth strategies, and enjoy a state of the art financial view.
            </p>
          </div>

          <div className="md:col-span-2.5 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">Product</h5>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#demo" className="hover:text-foreground transition-colors">Simulation Widget</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing Levels</a></li>
            </ul>
          </div>

          <div className="md:col-span-2.5 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">Resources</h5>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li><a href="https://nextjs.org" className="hover:text-foreground transition-colors">Next.js Framework</a></li>
              <li><a href="https://tailwindcss.com" className="hover:text-foreground transition-colors">Tailwind CSS v4</a></li>
              <li><a href="https://framer.com/motion" className="hover:text-foreground transition-colors">Framer Motion</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">Legal</h5>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground font-medium">
          <p>© {new Date().getFullYear()} FinanceFlow Corporation · Made with excellence.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <span className="hover:text-foreground transition-colors cursor-pointer">Twitter</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">GitHub</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">LinkedIn</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
