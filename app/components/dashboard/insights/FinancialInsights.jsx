"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  FaLightbulb,
  FaTriangleExclamation,
  FaPiggyBank,
  FaChartPie,
  FaCircleInfo,
  FaCoins,
} from "react-icons/fa6";

export default function FinancialInsights({ totalIncome, totalExpense, balance, savingsRate, expenses }) {
  const insights = useMemo(() => {
    const list = [];

    // 1. Savings Rate Insight
    if (totalIncome > 0) {
      if (savingsRate >= 30) {
        list.push({
          type: "success",
          title: "Super Saver Status",
          description: `Excellent! Your savings rate of ${savingsRate}% is outstanding. You are building wealth rapidly and creating deep financial peace.`,
          icon: <FaPiggyBank />,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/20",
        });
      } else if (savingsRate >= 15) {
        list.push({
          type: "info",
          title: "Healthy Saving Habits",
          description: `You are saving ${savingsRate}% of your income. That's a good buffer! Consider investing your extra savings to earn passive returns.`,
          icon: <FaCoins />,
          color: "text-blue-500",
          bg: "bg-blue-500/10 dark:bg-blue-500/15 border-blue-500/20",
        });
      } else if (savingsRate > 0) {
        list.push({
          type: "warning",
          title: "Increase Your Buffer",
          description: `Your savings rate is ${savingsRate}%. Financial advisors recommend saving at least 15-20% of your income. Try identifying minor subscription cuts or dining-out adjustments.`,
          icon: <FaTriangleExclamation className="text-amber-500" />,
          color: "text-amber-500",
          bg: "bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/20",
        });
      } else {
        list.push({
          type: "danger",
          title: "Cash Flow Warning",
          description: `You spent ₹${Math.abs(balance).toLocaleString()} more than you earned. This indicates negative cash flow. Please review your non-essential expenses to prevent debt accumulation.`,
          icon: <FaTriangleExclamation className="text-red-500 animate-pulse" />,
          color: "text-red-500",
          bg: "bg-red-500/10 dark:bg-red-500/15 border-red-500/20",
        });
      }
    } else if (totalExpense > 0) {
      list.push({
        type: "danger",
        title: "No Registered Income",
        description: `You have expenses of ₹${totalExpense.toLocaleString()} recorded but no income for this period. Registering your income helps track your accurate financial state.`,
        icon: <FaCircleInfo />,
        color: "text-red-500",
        bg: "bg-red-500/10 dark:bg-red-500/15 border-red-500/20",
      });
    }

    // 2. Expense Category Concentration Insight
    if (expenses && expenses.length > 0) {
      // Group expenses by category
      const categoriesMap = {};
      expenses.forEach((item) => {
        const cat = item.category || "General";
        categoriesMap[cat] = (categoriesMap[cat] || 0) + Number(item.amount || 0);
      });

      // Find top category
      let topCategory = "";
      let topAmount = 0;
      Object.entries(categoriesMap).forEach(([cat, amt]) => {
        if (amt > topAmount) {
          topAmount = amt;
          topCategory = cat;
        }
      });

      if (topAmount > 0 && totalExpense > 0) {
        const catPercentage = Math.round((topAmount / totalExpense) * 100);
        if (catPercentage >= 35) {
          list.push({
            type: "warning",
            title: `High Spending in ${topCategory}`,
            description: `Your highest expense category is "${topCategory}" representing ${catPercentage}% (₹${topAmount.toLocaleString()}) of your total expenses. Minimizing discretionary spending here will have the fastest impact on your savings rate!`,
            icon: <FaChartPie />,
            color: "text-violet-500",
            bg: "bg-violet-500/10 dark:bg-violet-500/15 border-violet-500/20",
          });
        }
      }
    }

    // 3. Emergency Fund Recommendation
    if (totalExpense > 0) {
      const emergencyTarget = totalExpense * 6;
      list.push({
        type: "info",
        title: "Emergency Fund Blueprint",
        description: `Based on your monthly outflow, a standard 6-month safety net is ₹${emergencyTarget.toLocaleString()}. Save this in an easily accessible liquid account for sudden events.`,
        icon: <FaLightbulb className="text-blue-500" />,
        color: "text-blue-500",
        bg: "bg-blue-500/10 dark:bg-blue-500/15 border-blue-500/20",
      });
    }

    // 4. Default proactive tip if empty
    if (list.length === 0) {
      list.push({
        type: "info",
        title: "A Clean Slate",
        description: "Welcome! Add some income and expense entries above, and this panel will automatically calculate smart insights and advice to build wealth.",
        icon: <FaLightbulb />,
        color: "text-violet-500",
        bg: "bg-violet-500/10 dark:bg-violet-500/15 border-violet-500/20",
      });
    }

    return list;
  }, [totalIncome, totalExpense, balance, savingsRate, expenses]);

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Financial Insights</h2>
        <p className="text-sm text-muted-foreground">
          Real-time dynamic analysis of your personal finances
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {insights.map((insight, idx) => (
          <motion.div
            key={insight.title + idx}
            variants={itemVariants}
            className={`relative rounded-2xl border p-5 space-y-2 overflow-hidden ${insight.bg} transition-shadow duration-200 hover:shadow-sm`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center border text-sm ${insight.bg} ${insight.color}`}>
                {insight.icon}
              </span>
              <h3 className="font-extrabold text-sm tracking-tight text-foreground">
                {insight.title}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              {insight.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
