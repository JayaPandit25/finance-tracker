"use client";

import { useEffect, useState } from "react";
import IncomeCard from "./income-card";
import { DollarSign, Landmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function IncomeList({ refreshKey = 0, onEdit, onDelete }) {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  async function fetchIncomes() {
    try {
      setLoading(true);

      const token = getToken();
      if (!token) {
        setIncomes([]);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/income", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setIncomes(data.incomes || []);
      } else {
        setIncomes([]);
      }
    } catch (err) {
      console.log("Error fetching incomes:", err);
      setIncomes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIncomes();
  }, [refreshKey]);

  return (
    <div className="space-y-3 font-outfit">

      {/* LOADING STATE */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-10 space-y-3 text-muted-foreground">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold">Retrieving your income streams...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && incomes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-border/60 rounded-2xl bg-muted/10 text-center">
          <div className="w-12 h-12 bg-muted/40 rounded-xl flex items-center justify-center text-muted-foreground mb-3">
            <Landmark className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-foreground">No income recorded yet</h4>
          <p className="text-xs text-muted-foreground max-w-[250px] mt-1 leading-relaxed">
            Your salary payments, project bonuses, and dividend entries will be logged here.
          </p>
        </div>
      )}

      {/* LIST */}
      {!loading && incomes.length > 0 && (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {incomes.map((income, idx) => (
              <motion.div
                key={income._id || idx}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.05, 0.4) }}
              >
                <IncomeCard
                  income={income}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}