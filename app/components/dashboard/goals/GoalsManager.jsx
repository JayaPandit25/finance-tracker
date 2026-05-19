"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaPiggyBank,
  FaPlus,
  FaTrashCan,
  FaCircleCheck,
  FaCalendarDays,
  FaCoins,
  FaXmark,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export default function GoalsManager({ refreshKey, onGoalUpdated }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [depositGoalId, setDepositGoalId] = useState(null);
  const [depositValue, setDepositValue] = useState("");

  // New Goal fields
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [category, setCategory] = useState("General");

  const fetchGoals = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await axios.get("/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setGoals(res.data.goals || []);
      }
    } catch (err) {
      console.error("Failed to load goals", err);
      toast.error("Failed to load savings goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [refreshKey]);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    if (!title || !targetAmount) {
      toast.error("Please fill in title and target amount");
      return;
    }

    try {
      const res = await axios.post(
        "/api/goals",
        {
          title,
          targetAmount: Number(targetAmount),
          currentAmount: Number(currentAmount || 0),
          targetDate: targetDate || undefined,
          category,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Savings goal created!");
        setTitle("");
        setTargetAmount("");
        setCurrentAmount("");
        setTargetDate("");
        setCategory("General");
        setShowAddForm(false);
        fetchGoals();
        if (onGoalUpdated) onGoalUpdated();
      }
    } catch (err) {
      toast.error("Failed to create savings goal");
    }
  };

  const handleDeposit = async (id) => {
    const token = getToken();
    if (!token) return;

    const amount = Number(depositValue);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid deposit amount");
      return;
    }

    try {
      const res = await axios.patch(
        "/api/goals",
        { id, depositAmount: amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Deposit recorded successfully!");
        setDepositGoalId(null);
        setDepositValue("");
        fetchGoals();
        if (onGoalUpdated) onGoalUpdated();
      }
    } catch (err) {
      toast.error("Failed to record deposit");
    }
  };

  const handleDeleteGoal = async (id) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.delete(`/api/goals?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Goal deleted");
        fetchGoals();
        if (onGoalUpdated) onGoalUpdated();
      }
    } catch (err) {
      toast.error("Failed to delete goal");
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        Loading savings goals...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── HEADER & ADD BUTTON ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Savings Goals</h2>
          <p className="text-sm text-muted-foreground">
            Set and track targets for your future plans
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-violet-500 hover:bg-violet-600 text-white rounded-full font-semibold px-4 flex items-center gap-1.5 shadow-sm shadow-violet-500/20"
        >
          {showAddForm ? <FaXmark className="text-sm" /> : <FaPlus className="text-sm" />}
          {showAddForm ? "Cancel" : "New Goal"}
        </Button>
      </div>

      {/* ── ADD GOAL FORM ── */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="rounded-2xl border-border/50 bg-muted/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">Create Savings Goal</CardTitle>
                <CardDescription>
                  Define details for a goal you want to save for.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateGoal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Goal Name</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. New Macbook Pro"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                    >
                      <option value="General">General Savings</option>
                      <option value="Tech">Technology</option>
                      <option value="Travel">Travel & Leisure</option>
                      <option value="Vehicle">Car / Bike</option>
                      <option value="Emergency">Emergency Fund</option>
                      <option value="Investment">Investment</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Target Amount (₹)</label>
                    <input
                      type="number"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      placeholder="e.g. 150000"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Initial Saved Amount (₹)</label>
                    <input
                      type="number"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(e.target.value)}
                      placeholder="e.g. 15000 (Optional)"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground">Target Date</label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                  <div className="md:col-span-2 pt-2 flex justify-end">
                    <Button
                      type="submit"
                      className="bg-violet-500 hover:bg-violet-600 text-white rounded-full font-semibold px-6"
                    >
                      Save Goal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GOALS GRID ── */}
      {goals.length === 0 ? (
        <div className="text-center py-10 bg-muted/10 border border-dashed border-border/80 rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-3 text-lg">
            <FaPiggyBank />
          </div>
          <h3 className="font-semibold text-base">No active savings goals</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
            Create a goal to manage your savings progress in real time!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const percent = Math.min(
              Math.round((goal.currentAmount / goal.targetAmount) * 100),
              100
            );
            const isCompleted = goal.currentAmount >= goal.targetAmount;
            const remaining = goal.targetAmount - goal.currentAmount;

            return (
              <motion.div
                key={goal._id}
                layout
                className="relative bg-background border border-border/60 hover:border-violet-500/30 rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Status completion border glow */}
                {isCompleted && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-2xl rounded-full pointer-events-none" />
                )}

                {/* Card Title & Delete */}
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="inline-block text-[10px] font-black uppercase tracking-wider bg-violet-500/10 text-violet-500 px-2.5 py-1 rounded-full border border-violet-500/10">
                      {goal.category}
                    </span>
                    <h3 className="text-base font-extrabold text-foreground flex items-center gap-2 mt-1">
                      {goal.title}
                      {isCompleted && (
                        <FaCircleCheck className="text-emerald-500 text-sm animate-bounce" />
                      )}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    onClick={() => handleDeleteGoal(goal._id)}
                  >
                    <FaTrashCan className="text-xs" />
                  </Button>
                </div>

                {/* Amounts & Stats */}
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs text-muted-foreground font-semibold">
                    <span>
                      Saved: <strong className="text-foreground text-sm font-black">₹{goal.currentAmount.toLocaleString()}</strong>
                    </span>
                    <span>
                      Target: ₹{goal.targetAmount.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-muted/60 rounded-full overflow-hidden border border-border/20">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        isCompleted
                          ? "bg-emerald-500"
                          : "bg-gradient-to-r from-violet-500 to-indigo-500"
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium pt-0.5">
                    <span>{percent}% completed</span>
                    {!isCompleted && (
                      <span>₹{remaining.toLocaleString()} more needed</span>
                    )}
                  </div>
                </div>

                {/* Date & Deposit Action */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1.5 border-t border-border/30">
                  {goal.targetDate ? (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <FaCalendarDays className="text-violet-500 text-xs" />
                      By {new Date(goal.targetDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground font-medium">No target date set</span>
                  )}

                  {!isCompleted ? (
                    <div className="flex items-center gap-1">
                      {depositGoalId === goal._id ? (
                        <div className="flex items-center gap-1.5 bg-muted/30 border border-border rounded-xl p-1 max-w-[170px]">
                          <input
                            type="number"
                            placeholder="Amount"
                            value={depositValue}
                            onChange={(e) => setDepositValue(e.target.value)}
                            className="bg-transparent text-xs font-semibold px-2 py-1 w-20 focus:outline-none"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            className="h-6 px-2 bg-violet-500 text-[10px] text-white hover:bg-violet-600 rounded-lg"
                            onClick={() => handleDeposit(goal._id)}
                          >
                            Add
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-lg text-muted-foreground"
                            onClick={() => {
                              setDepositGoalId(null);
                              setDepositValue("");
                            }}
                          >
                            <FaXmark className="text-[10px]" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs font-bold border-violet-500/20 text-violet-500 hover:bg-violet-500/5 hover:text-violet-600 rounded-lg flex items-center gap-1 px-3"
                          onClick={() => setDepositGoalId(goal._id)}
                        >
                          <FaCoins className="text-[10px]" />
                          Add Funds
                        </Button>
                      )}
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/10">
                      Goal Achieved!
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
