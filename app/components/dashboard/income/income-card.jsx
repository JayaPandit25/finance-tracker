"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2 } from "lucide-react";
import {
  FaMoneyBillWave,
  FaLaptopCode,
  FaChartLine,
  FaGift,
  FaHouse,
  FaBuilding,
  FaBolt,
  FaRotate,
  FaDollarSign,
} from "react-icons/fa6";

const getSourceIcon = (source) => {
  const s = source?.toLowerCase() || "";
  if (s.includes("salary") || s.includes("job") || s.includes("paycheck")) return <FaMoneyBillWave className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />;
  if (s.includes("freelance") || s.includes("gig") || s.includes("contract") || s.includes("project")) return <FaLaptopCode className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" />;
  if (s.includes("invest") || s.includes("stock") || s.includes("crypto") || s.includes("dividend")) return <FaChartLine className="w-5 h-5 text-cyan-500 dark:text-cyan-400 shrink-0" />;
  if (s.includes("gift") || s.includes("present") || s.includes("birthday")) return <FaGift className="w-5 h-5 text-pink-500 dark:text-pink-400 shrink-0" />;
  if (s.includes("rent") || s.includes("real estate")) return <FaHouse className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0" />;
  if (s.includes("business") || s.includes("sale") || s.includes("revenue")) return <FaBuilding className="w-5 h-5 text-violet-500 dark:text-violet-400 shrink-0" />;
  if (s.includes("bonus") || s.includes("commission")) return <FaBolt className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0" />;
  if (s.includes("refund") || s.includes("cashback") || s.includes("rebate")) return <FaRotate className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" />;
  return <FaDollarSign className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" />;
};

const getSourceColor = (source) => {
  const s = source?.toLowerCase() || "";
  if (s.includes("salary") || s.includes("job") || s.includes("paycheck")) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
  if (s.includes("freelance") || s.includes("gig") || s.includes("project")) return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20";
  if (s.includes("invest") || s.includes("stock") || s.includes("crypto")) return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20";
  if (s.includes("gift")) return "bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20";
  if (s.includes("rent")) return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";
  if (s.includes("business") || s.includes("sale")) return "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20";
  if (s.includes("bonus") || s.includes("commission")) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
  return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20";
};

export default function IncomeCard({ income, onDelete, onEdit }) {
  const displayCategory = income.category || income.source || "General";

  return (
    <Card className="group overflow-hidden border border-border/60 hover:border-border shadow-sm hover:shadow-md hover:bg-card/90 transition-all duration-300 rounded-xl font-outfit">
      <CardContent className="flex justify-between items-center p-3.5 sm:p-4">

        <div className="flex items-center gap-3.5 min-w-0">
          {/* Icon Badge */}
          <span className="w-10 h-10 shrink-0 rounded-xl bg-background border border-border/60 flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform duration-300">
            {getSourceIcon(displayCategory)}
          </span>

          <div className="min-w-0">
            <h4 className="font-bold text-foreground truncate leading-snug">
              {income.source}
            </h4>

            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getSourceColor(displayCategory)}`}>
                {displayCategory}
              </span>

              {income.createdAt && (
                <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-0.5">
                  • {new Date(income.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>

            {income.note && (
              <p className="text-xs text-muted-foreground/80 mt-1.5 italic font-light line-clamp-1 border-l-2 border-muted/80 pl-2">
                "{income.note}"
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-4">
          <p className="text-base sm:text-lg font-black text-emerald-500 font-syne mr-1">
            ₹{Number(income.amount || 0).toLocaleString()}
          </p>

          <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(income)}
              className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              title="Edit record"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(income._id)}
              className="w-8 h-8 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Delete record"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}