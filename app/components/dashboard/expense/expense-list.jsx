"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ReceiptText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUtensils,
  FaHouse,
  FaLightbulb,
  FaCar,
  FaGamepad,
  FaBagShopping,
  FaHeartPulse,
  FaBook,
  FaCreditCard,
  FaReceipt,
} from "react-icons/fa6";

const getCategoryIcon = (category) => {
  const c = category?.toLowerCase() || "";
  if (c.includes("food") || c.includes("din") || c.includes("restaurant")) return <FaUtensils className="w-5 h-5 text-amber-500 shrink-0" />;
  if (c.includes("rent") || c.includes("hous") || c.includes("home")) return <FaHouse className="w-5 h-5 text-blue-500 shrink-0" />;
  if (c.includes("util") || c.includes("bill") || c.includes("light") || c.includes("water") || c.includes("power")) return <FaLightbulb className="w-5 h-5 text-yellow-500 shrink-0" />;
  if (c.includes("travel") || c.includes("car") || c.includes("cab") || c.includes("fuel") || c.includes("transport")) return <FaCar className="w-5 h-5 text-teal-500 shrink-0" />;
  if (c.includes("entertain") || c.includes("game") || c.includes("show") || c.includes("movie") || c.includes("play")) return <FaGamepad className="w-5 h-5 text-purple-500 shrink-0" />;
  if (c.includes("shop") || c.includes("cloth") || c.includes("grocer")) return <FaBagShopping className="w-5 h-5 text-pink-500 shrink-0" />;
  if (c.includes("health") || c.includes("med") || c.includes("doctor")) return <FaHeartPulse className="w-5 h-5 text-rose-500 shrink-0" />;
  if (c.includes("educat") || c.includes("book") || c.includes("school") || c.includes("course")) return <FaBook className="w-5 h-5 text-blue-500 shrink-0" />;
  if (c.includes("sub") || c.includes("netflix") || c.includes("spotify") || c.includes("adobe")) return <FaCreditCard className="w-5 h-5 text-slate-500 shrink-0" />;
  return <FaReceipt className="w-5 h-5 text-slate-500 shrink-0" />;
};

const getCategoryColor = (category) => {
  const c = category?.toLowerCase() || "";
  if (c.includes("food") || c.includes("din") || c.includes("restaurant")) return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
  if (c.includes("rent") || c.includes("hous") || c.includes("home")) return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
  if (c.includes("util") || c.includes("bill") || c.includes("light")) return "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20";
  if (c.includes("travel") || c.includes("car") || c.includes("cab")) return "bg-teal-500/10 text-teal-500 border border-teal-500/20";
  if (c.includes("entertain") || c.includes("game") || c.includes("show")) return "bg-purple-500/10 text-purple-500 border border-purple-500/20";
  if (c.includes("shop") || c.includes("cloth") || c.includes("grocer")) return "bg-pink-500/10 text-pink-500 border border-pink-500/20";
  if (c.includes("health") || c.includes("med")) return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
  return "bg-slate-500/10 text-slate-500 border border-slate-500/20";
};

export default function ExpenseList({
  refreshKey = 0,
  onDelete,
}) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const token = getToken();
      if (!token) {
        setExpenses([]);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setExpenses(data.expenses || []);
      } else {
        setExpenses([]);
      }
    } catch (err) {
      console.log("Expense fetch error:", err);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [refreshKey]);

  return (
    <div className="space-y-3 font-outfit">

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-10 space-y-3 text-muted-foreground">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold">Retrieving your expenses...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && expenses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-border/60 rounded-2xl bg-muted/10 text-center">
          <div className="w-12 h-12 bg-muted/40 rounded-xl flex items-center justify-center text-muted-foreground mb-3">
            <ReceiptText className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-foreground">No expenses recorded</h4>
          <p className="text-xs text-muted-foreground max-w-[250px] mt-1 leading-relaxed">
            All your debit logs and cash leaks will show up here as soon as you record them.
          </p>
        </div>
      )}

      {/* Expense List */}
      {!loading && expenses.length > 0 && (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {expenses.map((expense, idx) => (
              <motion.div
                key={expense._id || idx}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.05, 0.4) }}
              >
                <Card className="group overflow-hidden border border-border/60 hover:border-border shadow-sm hover:shadow-md hover:bg-card/90 transition-all duration-300 rounded-xl">
                  <CardContent className="flex justify-between items-center p-3.5 sm:p-4">

                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Icon Badge */}
                      <span className="w-10 h-10 shrink-0 rounded-xl bg-background border border-border/60 flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform duration-300">
                        {getCategoryIcon(expense.category)}
                      </span>

                      <div className="min-w-0">
                        <h4 className="font-bold text-foreground truncate leading-snug">
                          {expense.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getCategoryColor(expense.category)}`}>
                            {expense.category || "General"}
                          </span>
                          
                          {expense.createdAt && (
                            <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-0.5">
                              • {new Date(expense.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>

                        {expense.note && (
                          <p className="text-xs text-muted-foreground/80 mt-1.5 italic font-light line-clamp-1 border-l-2 border-muted/80 pl-2">
                            "{expense.note}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <p className="text-base sm:text-lg font-black text-red-500 font-syne">
                        ₹{Number(expense.amount || 0).toLocaleString()}
                      </p>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(expense._id)}
                        className="w-8 h-8 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-70 group-hover:opacity-100"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}