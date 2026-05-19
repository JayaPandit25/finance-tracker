"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { FaScaleBalanced, FaPen, FaCheck, FaXmark } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export default function BudgetCard({ totalExpense, refreshKey, onBudgetUpdated }) {
  const [budgetLimit, setBudgetLimit] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBudget = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await axios.get("/api/budget", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success && res.data.budget) {
        setBudgetLimit(res.data.budget.limit);
        setEditValue(res.data.budget.limit.toString());
      }
    } catch (err) {
      console.error("Failed to load budget limit", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [refreshKey]);

  const handleSaveBudget = async () => {
    const token = getToken();
    if (!token) return;

    const newLimit = Number(editValue);
    if (isNaN(newLimit) || newLimit < 0) {
      toast.error("Please enter a valid budget limit");
      return;
    }

    try {
      const res = await axios.post(
        "/api/budget",
        { limit: newLimit },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setBudgetLimit(res.data.budget.limit);
        setIsEditing(false);
        toast.success("Monthly budget limit updated");
        if (onBudgetUpdated) onBudgetUpdated();
      }
    } catch (err) {
      toast.error("Failed to update budget limit");
    }
  };

  if (loading) {
    return (
      <div className="h-44 bg-muted/40 rounded-2xl animate-pulse flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Loading budget...</span>
      </div>
    );
  }

  const spentPercentage = budgetLimit > 0 ? Math.min((totalExpense / budgetLimit) * 100, 100) : 0;
  const remaining = budgetLimit - totalExpense;
  const isOverBudget = totalExpense > budgetLimit;

  // Determine progress bar color based on percentage
  let progressColor = "bg-emerald-500";
  let textColor = "text-emerald-500";
  let bgColor = "bg-emerald-500/10 dark:bg-emerald-500/15";
  let border = "border-emerald-500/20";

  if (budgetLimit > 0) {
    const pct = (totalExpense / budgetLimit) * 100;
    if (pct >= 100) {
      progressColor = "bg-red-500";
      textColor = "text-red-500";
      bgColor = "bg-red-500/10 dark:bg-red-500/15";
      border = "border-red-500/20";
    } else if (pct >= 80) {
      progressColor = "bg-amber-500";
      textColor = "text-amber-500";
      bgColor = "bg-amber-500/10 dark:bg-amber-500/15";
      border = "border-amber-500/20";
    }
  }

  return (
    <div className={`relative rounded-2xl border ${border} ${bgColor} p-6 space-y-4 overflow-hidden transition-all duration-300`}>
      {/* Background decoration */}
      <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full ${progressColor}/5 blur-2xl pointer-events-none`} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor} ${textColor} text-base border ${border}`}>
            <FaScaleBalanced />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              Monthly Budget Progress
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Keep your spending under control
            </p>
          </div>
        </div>

        {!isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
            onClick={() => {
              setEditValue(budgetLimit.toString());
              setIsEditing(true);
            }}
          >
            <FaPen className="text-xs" />
          </Button>
        ) : (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-emerald-500/20 text-emerald-500"
              onClick={handleSaveBudget}
            >
              <FaCheck className="text-xs" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-red-500/20 text-red-500"
              onClick={() => setIsEditing(false)}
            >
              <FaXmark className="text-xs" />
            </Button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="flex items-center gap-2 py-1"
          >
            <span className="text-sm font-bold text-muted-foreground">₹</span>
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 bg-background/50 border border-border rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-red-500"
              placeholder="Set monthly limit"
              autoFocus
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-1.5"
          >
            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-black ${textColor}`}>
                ₹{totalExpense.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                of ₹{budgetLimit > 0 ? budgetLimit.toLocaleString() : "unlimited"}
              </span>
            </div>
            {budgetLimit > 0 ? (
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                {isOverBudget ? (
                  <span className="text-red-500 font-semibold">
                    Over budget by ₹{Math.abs(remaining).toLocaleString()}!
                  </span>
                ) : (
                  <span>
                    ₹{remaining.toLocaleString()} remaining
                  </span>
                )}
                <span>{Math.round(spentPercentage)}% spent</span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground font-medium">
                Set a budget limit to track your spending limits!
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {budgetLimit > 0 && !isEditing && (
        <div className="w-full h-2.5 bg-muted/65 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${spentPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full ${progressColor} rounded-full`}
          />
        </div>
      )}
    </div>
  );
}
