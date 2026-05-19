"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import {
  FaWallet,
  FaMoneyBillWave,
  FaChartLine,
  FaChartPie,
  FaMoon,
  FaSun,
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaScaleBalanced,
  FaReceipt,
} from "react-icons/fa6";

import AnalyticsDashboard from "../components/dashboard/AnalyticsDashboard";
import IncomeForm from "../components/dashboard/income/income-form";
import IncomeList from "../components/dashboard/income/income-list";
import EditIncomeModal from "../components/dashboard/income/EditIncomeModal";
import ExpenseForm from "../components/dashboard/expense/expense-form";
import ExpenseList from "../components/dashboard/expense/expense-list";
import BudgetCard from "../components/dashboard/budget/BudgetCard";
import GoalsManager from "../components/dashboard/goals/GoalsManager";
import FinancialInsights from "../components/dashboard/insights/FinancialInsights";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export default function Dashboard() {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [budgetLimit, setBudgetLimit] = useState(0);

  // Smooth scroll handler with offset for sticky navbar
  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // offset to account for sticky navbar and add padding
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Scrollspy to automatically highlight the current section on scroll
  useEffect(() => {
    if (!mounted) return;

    const sections = ["overview", "income", "expenses", "goals", "analytics"];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // If we are near the top of the page, set overview active
      if (scrollPosition < 100) {
        setActiveSection("overview");
        return;
      }

      // Check which section is currently in view
      let currentSection = "overview";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            currentSection = id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!getToken());
  }, []);

  const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalIncome = incomes.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  const fetchExpenses = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await axios.get("/api/expenses", { headers: { Authorization: `Bearer ${token}` } });
      setExpenses(res.data.expenses || []);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("not able to logged in");
      } else {
        toast.error("Failed to load expenses");
      }
    }
  };

  const fetchIncome = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await axios.get("/api/income", { headers: { Authorization: `Bearer ${token}` } });
      setIncomes(res.data.incomes || []);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("not able to logged in");
      } else {
        toast.error("Failed to load income");
      }
    }
  };
  const fetchBudget = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await axios.get("/api/budget", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success && res.data.budget) {
        setBudgetLimit(res.data.budget.limit);
      }
    } catch (err) {
      console.error("Failed to load budget limit", err);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast.error("not able to logged in");
      setIsLoggedIn(false);
      return;
    }
    setIsLoggedIn(true);
    fetchExpenses();
    fetchIncome();
    fetchBudget();
  }, [refreshKey]);

  const deleteIncome = async (id) => {
    try {
      await axios.delete(`/api/income?id=${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      toast.success("Income deleted");
      setRefreshKey((p) => p + 1);
    } catch { toast.error("Delete failed"); }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`/api/expenses?id=${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      toast.success("Expense deleted");
      setRefreshKey((p) => p + 1);
    } catch { toast.error("Failed to delete expense"); }
  };

  const handleEditIncome = (income) => { setSelectedIncome(income); setEditOpen(true); };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setExpenses([]);
    setIncomes([]);
    toast.success("Logged out successfully");
    router.push("/login");
  };

  if (!mounted) return null;

  const navLinks = [
    { id: "overview", label: "Overview" },
    { id: "income", label: "Income" },
    { id: "expenses", label: "Expenses" },
    { id: "goals", label: "Savings Goals" },
    { id: "analytics", label: "Analytics" },
  ];

  const summaryCards = [
    {
      label: "Total Income",
      value: totalIncome,
      icon: <FaArrowTrendUp />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      border: "border-emerald-500/20",
    },
    {
      label: "Total Expenses",
      value: totalExpense,
      icon: <FaArrowTrendDown />,
      color: "text-red-500",
      bg: "bg-red-500/10 dark:bg-red-500/15",
      border: "border-red-500/20",
    },
    {
      label: "Net Balance",
      value: balance,
      icon: <FaScaleBalanced />,
      color: balance >= 0 ? "text-blue-500" : "text-red-500",
      bg: balance >= 0 ? "bg-blue-500/10 dark:bg-blue-500/15" : "bg-red-500/10",
      border: balance >= 0 ? "border-blue-500/20" : "border-red-500/20",
    },
    {
      label: "Savings Rate",
      value: savingsRate,
      suffix: "%",
      icon: <FaChartLine />,
      color: savingsRate >= 20 ? "text-violet-500" : "text-amber-500",
      bg: savingsRate >= 20 ? "bg-violet-500/10 dark:bg-violet-500/15" : "bg-amber-500/10",
      border: savingsRate >= 20 ? "border-violet-500/20" : "border-amber-500/20",
    },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background text-foreground"
      >
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 500,
            },
          }}
        />

        {/* ── NAVBAR ── */}
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-2xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

            {/* Logo */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/")}
              className="flex items-center gap-2.5 font-black text-xl tracking-tight"
            >
              <span className="bg-red-500 text-white p-1.5 rounded-lg">
                <FaWallet className="text-sm" />
              </span>
              <span>
                Finance<span className="text-red-500">Flow</span>
              </span>
            </motion.button>

            {/* Nav Links — desktop */}
            <nav className="hidden md:flex items-center gap-1 bg-muted/60 rounded-full px-2 py-1.5">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeSection === link.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground font-medium"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground font-medium"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </Button>

                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold shadow-sm shadow-red-500/25 rounded-full px-5"
                    onClick={() => router.push("/register")}
                  >
                    Register
                  </Button>
                </>
              )}

              {/* Theme toggle */}
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="ml-1 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                {resolvedTheme === "dark"
                  ? <FaSun className="text-yellow-400 text-base" />
                  : <FaMoon className="text-base" />
                }
              </button>
            </div>
          </div>
        </header>
        {/* ── HERO ── */}
        <section id="overview" className="relative overflow-hidden border-b border-border/40">
  {/* Background blobs */}
  <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-red-500/8 rounded-full blur-3xl pointer-events-none" />

  {/* Floating Finance Icons */}
  <motion.div
    animate={{ y: [0, -18, 0] }}
    transition={{ duration: 4, repeat: Infinity }}
    className="absolute top-16 left-4 md:left-10 z-20"
  >
    <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 flex items-center justify-center shadow-lg">
      <FaWallet className="text-emerald-500 text-3xl md:text-4xl" />
    </div>
  </motion.div>

  <motion.div
    animate={{ y: [0, 15, 0], rotate: [0, 5, -5, 0] }}
    transition={{ duration: 5, repeat: Infinity }}
    className="absolute top-12 right-4 md:right-10 z-20"
  >
    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/20 flex items-center justify-center shadow-lg">
      <FaChartPie className="text-blue-500 text-4xl md:text-5xl" />
    </div>
  </motion.div>

  <motion.div
    animate={{ y: [0, -12, 0] }}
    transition={{ duration: 3.5, repeat: Infinity }}
    className="absolute bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-1/4 md:translate-x-0 z-20"
  >
    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-red-500/10 backdrop-blur-md border border-red-500/20 flex items-center justify-center shadow-lg">
      <FaMoneyBillWave className="text-red-500 text-2xl md:text-3xl" />
    </div>
  </motion.div>

  <div className="relative max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-10">

    {/* Left Content */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 space-y-4"
    >
      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        Personal Finance Dashboard
      </span>

      <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
        Track Smarter,
        <br />
        <span className="text-red-500">Save Better.</span>
      </h1>

      <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
        All your income, expenses, and analytics — unified in one clean dashboard.
      </p>
    </motion.div>

    {/* Mini stats strip */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="flex-shrink-0 grid grid-cols-2 gap-3 w-full md:w-72"
    >
      {[
        {
          label: "Income Entries",
          value: incomes.length,
          color: "text-emerald-500",
        },
        {
          label: "Expense Entries",
          value: expenses.length,
          color: "text-red-500",
        },
        {
          label: "Savings Rate",
          value: `${savingsRate}%`,
          color: "text-violet-500",
        },
        {
          label: "Net Balance",
          value: `₹${balance.toLocaleString()}`,
          color: balance >= 0 ? "text-blue-500" : "text-red-500",
        },
      ].map((stat) => (
        <div
          key={stat.label}
          className="bg-muted/50 border border-border/50 rounded-2xl p-4 space-y-1"
        >
          <p className={`text-xl font-black ${stat.color}`}>
            {stat.value}
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            {stat.label}
          </p>
        </div>
      ))}
    </motion.div>
  </div>
</section>

       
   

        {/* ── MAIN CONTENT ── */}
        <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {summaryCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-2xl border ${card.border} ${card.bg} p-5 space-y-3 overflow-hidden`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.bg} ${card.color} text-base border ${card.border}`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{card.label}</p>
                  <p className={`text-2xl font-black mt-0.5 ${card.color}`}>
                    {card.suffix ? "" : "₹"}
                    <CountUp end={card.value} duration={1.4} separator="," />
                    {card.suffix || ""}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main interactive layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Forms Section (Left Side) */}
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
              {/* Add Income */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="rounded-2xl border-border/60 shadow-sm h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2.5 text-base font-bold">
                      <span className="w-8 h-8 bg-emerald-500/15 text-emerald-500 rounded-xl flex items-center justify-center text-sm">
                        <FaMoneyBillWave />
                      </span>
                      Add Income
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <IncomeForm onSuccess={() => setRefreshKey((p) => p + 1)} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Add Expense */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Card className="rounded-2xl border-border/60 shadow-sm h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2.5 text-base font-bold">
                      <span className="w-8 h-8 bg-red-500/15 text-red-500 rounded-xl flex items-center justify-center text-sm">
                        <FaReceipt />
                      </span>
                      Add Expense
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ExpenseForm onSuccess={() => setRefreshKey((p) => p + 1)} />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Budget Card Section (Right Side) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.28 }}
              className="lg:col-span-1"
            >
              <BudgetCard
                totalExpense={totalExpense}
                refreshKey={refreshKey}
                onBudgetUpdated={() => setRefreshKey((p) => p + 1)}
              />
            </motion.div>
          </div>

          {/* Income History */}
          <motion.div
            id="income"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="rounded-2xl border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2.5 text-base font-bold">
                  <span className="w-8 h-8 bg-emerald-500/15 text-emerald-500 rounded-xl flex items-center justify-center text-sm">
                    <FaChartLine />
                  </span>
                  Income History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <IncomeList
                  refreshKey={refreshKey}
                  onEdit={handleEditIncome}
                  onDelete={deleteIncome}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Expense History */}
          <motion.div
            id="expenses"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="rounded-2xl border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2.5 text-base font-bold">
                  <span className="w-8 h-8 bg-red-500/15 text-red-500 rounded-xl flex items-center justify-center text-sm">
                    <FaMoneyBillWave />
                  </span>
                  Expense History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseList refreshKey={refreshKey} onDelete={deleteExpense} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Savings Goals Section */}
          <motion.div
            id="goals"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
          >
            <Card className="rounded-2xl border-border/60 shadow-sm">
              <CardContent className="pt-6">
                <GoalsManager
                  refreshKey={refreshKey}
                  onGoalUpdated={() => setRefreshKey((p) => p + 1)}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Analytics Chart & Smart Financial Insights */}
          <div id="analytics" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AnalyticsDashboard
                expenses={expenses}
                incomes={incomes}
                budgetLimit={budgetLimit}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
            >
              <Card className="rounded-2xl border-border/60 shadow-sm">
                <CardContent className="pt-6">
                  <FinancialInsights
                    totalIncome={totalIncome}
                    totalExpense={totalExpense}
                    balance={balance}
                    savingsRate={savingsRate}
                    expenses={expenses}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

        </main>

        {/* ── FOOTER ── */}
        <footer className="border-t border-border/40 mt-10">
          <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-2 font-semibold text-foreground">
              <FaWallet className="text-red-500" /> FinanceFlow
            </span>
            <span>© {new Date().getFullYear()} · All rights reserved</span>
          </div>
        </footer>

        <EditIncomeModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          income={selectedIncome}
          onUpdated={() => setRefreshKey((p) => p + 1)}
        />
      </motion.div>
    </AnimatePresence>
  );
}