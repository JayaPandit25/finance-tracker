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

import ExpenseChart from "../components/dashboard/ExpenseChart";

// Income Components
import IncomeForm from "../components/dashboard/income/income-form";
import IncomeList from "../components/dashboard/income/income-list";
import EditIncomeModal from "../components/dashboard/income/EditIncomeModal";

// Expense Components
import ExpenseForm from "../components/dashboard/expense/expense-form";
import ExpenseList from "../components/dashboard/expense/expense-list";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

// ---------------- TOKEN ----------------
const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export default function Dashboard() {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  const [refreshKey, setRefreshKey] = useState(0);

  // Income Edit
  const [editOpen, setEditOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ---------------- TOTALS ----------------
  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalIncome = incomes.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const balance = totalIncome - totalExpense;

  // ---------------- FETCH EXPENSES ----------------
  const fetchExpenses = async () => {
    try {
      const res = await axios.get("/api/expenses", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setExpenses(res.data.expenses || []);
    } catch (error) {
      console.error("Expense fetch error:", error);
      toast.error("Failed to load expenses");
    }
  };

  // ---------------- FETCH INCOME ----------------
  const fetchIncome = async () => {
    try {
      const res = await axios.get("/api/income", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setIncomes(res.data.incomes || []);
    } catch (error) {
      console.error("Income fetch error:", error);
      toast.error("Failed to load income");
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchIncome();
  }, [refreshKey]);

  // ---------------- DELETE INCOME ----------------
  const deleteIncome = async (id) => {
    try {
      await axios.delete(`/api/income?id=${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      toast.success("Income deleted");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }
  };

  // ---------------- DELETE EXPENSE ----------------
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`/api/expenses?id=${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      toast.success("Expense deleted");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete expense");
    }
  };

  // ---------------- EDIT INCOME ----------------
  const handleEditIncome = (income) => {
    setSelectedIncome(income);
    setEditOpen(true);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Toaster position="top-right" />

        {/* NAVBAR */}
        <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
            <motion.h1
              whileHover={{ scale: 1.05 }}
              className="font-bold text-2xl text-red-500 cursor-pointer flex items-center gap-2"
              onClick={() => router.push("/")}
            >
              <FaWallet />
              FinanceFlow
            </motion.h1>

            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() =>
                setTheme(
                  resolvedTheme === "dark"
                    ? "light"
                    : "dark"
                )
              }
            >
              {resolvedTheme === "dark" ? (
                <>
                  <FaSun className="text-yellow-500" />
                  Light Mode
                </>
              ) : (
                <>
                  <FaMoon />
                  Dark Mode
                </>
              )}
            </Button>
          </div>
        </header>

        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-background to-red-100 dark:from-black dark:via-zinc-950 dark:to-red-950/20" />

          <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-5"
            >
              <div className="bg-red-100 dark:bg-red-900/30 p-5 rounded-full">
                <FaWallet className="text-red-500 text-5xl" />
              </div>

              <h2 className="text-5xl md:text-7xl font-extrabold">
                Track Your Finances Smarter
              </h2>

              <p className="text-muted-foreground text-lg max-w-2xl">
                Manage income, expenses, analytics,
                and savings in one dashboard.
              </p>
            </motion.div>
          </div>
        </section>

        {/* DASHBOARD */}
        <section className="max-w-6xl mx-auto p-6 space-y-6">

          {/* SUMMARY CARDS */}
          <div className="grid md:grid-cols-3 gap-5">

            <Card className="hover:shadow-lg transition">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Total Income</CardTitle>
                <FaArrowTrendUp className="text-green-500 text-xl" />
              </CardHeader>

              <CardContent className="text-3xl font-bold text-green-500">
                ₹<CountUp end={totalIncome} duration={1.2} />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Total Expense</CardTitle>
                <FaArrowTrendDown className="text-red-500 text-xl" />
              </CardHeader>

              <CardContent className="text-3xl font-bold text-red-500">
                ₹<CountUp end={totalExpense} duration={1.2} />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Balance</CardTitle>
                <FaScaleBalanced className="text-blue-500 text-xl" />
              </CardHeader>

              <CardContent
                className={`text-3xl font-bold ${
                  balance >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                ₹<CountUp end={balance} duration={1.2} />
              </CardContent>
            </Card>
          </div>

          {/* ADD INCOME */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaMoneyBillWave className="text-green-500" />
                Add Income
              </CardTitle>
            </CardHeader>

            <CardContent>
              <IncomeForm
                onSuccess={() =>
                  setRefreshKey((prev) => prev + 1)
                }
              />
            </CardContent>
          </Card>

          {/* ADD EXPENSE */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaReceipt className="text-red-500" />
                Add Expense
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ExpenseForm
                onSuccess={() =>
                  setRefreshKey((prev) => prev + 1)
                }
              />
            </CardContent>
          </Card>

          {/* INCOME LIST */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaChartLine className="text-green-500" />
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

          {/* EXPENSE LIST */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaMoneyBillWave className="text-red-500" />
                Expense History
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ExpenseList
                refreshKey={refreshKey}
                onDelete={deleteExpense}
              />
            </CardContent>
          </Card>

          {/* CHART */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaChartPie className="text-blue-500" />
                Expense Analytics
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ExpenseChart expenses={expenses} />
            </CardContent>
          </Card>
        </section>

        {/* EDIT INCOME MODAL */}
        <EditIncomeModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          income={selectedIncome}
          onUpdated={() =>
            setRefreshKey((prev) => prev + 1)
          }
        />
      </motion.div>
    </AnimatePresence>
  );
}   