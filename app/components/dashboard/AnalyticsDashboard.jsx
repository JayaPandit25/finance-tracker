"use client";

import { useState, useMemo, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChartLine,
  FaChartPie,
  FaScaleBalanced,
  FaCoins,
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaChartSimple,
  FaCompass,
  FaRegLightbulb,
  FaCircleInfo,
  FaTv,
} from "react-icons/fa6";

const COLORS = [
  "#6366f1", // indigo
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
];

export default function AnalyticsDashboard({ expenses = [], incomes = [], budgetLimit = 0 }) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if we should automatically enable demo data for empty states
  const totalActualIncome = useMemo(() => incomes.reduce((sum, item) => sum + Number(item.amount || 0), 0), [incomes]);
  const totalActualExpense = useMemo(() => expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0), [expenses]);
  const hasNoData = totalActualIncome === 0 && totalActualExpense === 0;

  // Toggle demo state automatically if there is zero data
  const isDemoMode = showDemo || hasNoData;

  // 1. Monthly Data Aggregator (Area Chart & Composed Chart)
  const monthlyData = useMemo(() => {
    // Generate past 6 months
    const monthsList = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = d.toLocaleString("default", { month: "short" });
      const mYear = d.getFullYear();
      monthsList.push({
        name: mName,
        year: mYear,
        key: `${mName} ${mYear}`,
        income: 0,
        expense: 0,
      });
    }

    if (!isDemoMode) {
      // Process actual incomes
      incomes.forEach((inc) => {
        const d = inc.createdAt ? new Date(inc.createdAt) : new Date();
        const mName = d.toLocaleString("default", { month: "short" });
        const mYear = d.getFullYear();
        const key = `${mName} ${mYear}`;
        const found = monthsList.find((m) => m.key === key);
        if (found) {
          found.income += Number(inc.amount || 0);
        }
      });

      // Process actual expenses
      expenses.forEach((exp) => {
        const d = exp.createdAt ? new Date(exp.createdAt) : new Date();
        const mName = d.toLocaleString("default", { month: "short" });
        const mYear = d.getFullYear();
        const key = `${mName} ${mYear}`;
        const found = monthsList.find((m) => m.key === key);
        if (found) {
          found.expense += Number(exp.amount || 0);
        }
      });
    } else {
      // Interactive Demo Values
      const mockIncomes = [48000, 52000, 50000, 55000, 58000, 62000];
      const mockExpenses = [32000, 38000, 41000, 36000, 39000, 42000];
      monthsList.forEach((m, idx) => {
        m.income = mockIncomes[idx];
        m.expense = mockExpenses[idx];
      });
    }

    return monthsList.map((m) => {
      const netSavings = m.income - m.expense;
      const savingsRate = m.income > 0 ? Math.round((netSavings / m.income) * 100) : 0;
      return {
        name: m.name,
        Income: m.income,
        Expenses: m.expense,
        Savings: Math.max(0, netSavings),
        "Savings Rate (%)": Math.max(0, savingsRate),
      };
    });
  }, [incomes, expenses, isDemoMode]);

  // 2. Expense Category Aggregator (Donut Chart)
  const expenseCategoriesData = useMemo(() => {
    const categoryMap = {};

    if (!isDemoMode && expenses.length > 0) {
      expenses.forEach((exp) => {
        const cat = exp.category || "General";
        categoryMap[cat] = (categoryMap[cat] || 0) + Number(exp.amount || 0);
      });
    } else {
      // Mock categories
      return [
        { name: "Rent & Housing", value: 15000 },
        { name: "Food & Dining", value: 9500 },
        { name: "Entertainment", value: 4500 },
        { name: "Utilities", value: 3800 },
        { name: "Shopping", value: 5200 },
        { name: "Travel & Fuel", value: 4000 },
      ];
    }

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));
  }, [expenses, isDemoMode]);

  const totalExpenseSum = useMemo(() => {
    return expenseCategoriesData.reduce((sum, item) => sum + item.value, 0);
  }, [expenseCategoriesData]);

  // 3. Income Sources Aggregator (Radial Bar Chart)
  const incomeSourcesData = useMemo(() => {
    const sourceMap = {};

    if (!isDemoMode && incomes.length > 0) {
      incomes.forEach((inc) => {
        const src = inc.source || inc.category || "General";
        sourceMap[src] = (sourceMap[src] || 0) + Number(inc.amount || 0);
      });
    } else {
      // Mock incomes
      return [
        { name: "Primary Salary", value: 45000, fill: "#6366f1" },
        { name: "Freelance", value: 10000, fill: "#10b981" },
        { name: "Investments", value: 5000, fill: "#f59e0b" },
        { name: "Bonus", value: 2000, fill: "#ec4899" },
      ];
    }

    return Object.entries(sourceMap).map(([name, value], index) => ({
      name,
      value,
      fill: COLORS[index % COLORS.length],
    }));
  }, [incomes, isDemoMode]);

  // 4. Budget vs. Actual Spend Aggregator (Radar Chart)
  const budgetVsActualData = useMemo(() => {
    // Proportions for budget distribution
    const categories = [
      { name: "Housing", pct: 0.35, key: "rent" },
      { name: "Food & Groceries", pct: 0.25, key: "food" },
      { name: "Utilities", pct: 0.1, key: "utilities" },
      { name: "Shopping", pct: 0.1, key: "shopping" },
      { name: "Entertainment", pct: 0.1, key: "entertainment" },
      { name: "Miscellaneous", pct: 0.1, key: "misc" },
    ];

    const activeBudget = budgetLimit > 0 ? budgetLimit : 35000;

    return categories.map((cat) => {
      const budgetVal = Math.round(activeBudget * cat.pct);
      let actualVal = 0;

      if (!isDemoMode && expenses.length > 0) {
        // Match actual category expenses (case insensitive partial match)
        expenses.forEach((exp) => {
          const expCat = (exp.category || "").toLowerCase();
          if (
            expCat.includes(cat.key) ||
            (cat.key === "misc" &&
              !["rent", "housing", "food", "dining", "groceries", "utilities", "shopping", "entertainment"].some((k) =>
                expCat.includes(k)
              ))
          ) {
            actualVal += Number(exp.amount || 0);
          }
        });
      } else {
        // Mock actual spend
        const mockSpend = {
          Housing: budgetVal,
          "Food & Groceries": budgetVal + 1500,
          Utilities: budgetVal - 500,
          Shopping: budgetVal + 2000,
          Entertainment: budgetVal - 800,
          Miscellaneous: budgetVal + 300,
        };
        actualVal = mockSpend[cat.name] || 0;
      }

      return {
        subject: cat.name,
        Budget: budgetVal,
        Actual: actualVal,
        fullMark: Math.max(budgetVal, actualVal) + 2000,
      };
    });
  }, [expenses, budgetLimit, isDemoMode]);

  if (!mounted) {
    return (
      <div className="h-96 w-full flex items-center justify-center bg-muted/20 rounded-3xl animate-pulse">
        <span className="text-muted-foreground font-medium">Initializing premium charts...</span>
      </div>
    );
  }

  // Custom tooltips to keep high-end consistent styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-md border border-border/80 shadow-xl rounded-xl p-4 text-xs font-semibold space-y-1.5 min-w-[140px]">
          <p className="text-muted-foreground uppercase tracking-wider font-extrabold pb-1 border-b border-border/50">
            {label}
          </p>
          {payload.map((pld, index) => (
            <p key={index} className="flex justify-between items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pld.color || pld.payload.fill }} />
                <span className="text-muted-foreground">{pld.name}:</span>
              </span>
              <span className="font-extrabold text-foreground">₹{Number(pld.value).toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Chart Headers & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-muted/20 border border-border/40 p-4 rounded-3xl backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
              <span className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg">
                <FaChartLine className="text-sm" />
              </span>
              Financial Insights & Analytics
            </h2>
            {isDemoMode && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <FaCircleInfo className="text-[10px]" />
                Demo Sandbox
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Deep visual analysis of income, expenses, categories, budget tracking and saving efficiency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasNoData ? (
            <div className="text-xs text-amber-500/90 bg-amber-500/5 px-3 py-1.5 rounded-2xl border border-amber-500/10 font-semibold flex items-center gap-1.5 max-w-[280px]">
              <FaCircleInfo />
              No entries found. Simulating data to show chart layout.
            </div>
          ) : (
            <button
              onClick={() => setShowDemo(!showDemo)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                showDemo
                  ? "bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/25"
                  : "bg-background text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {showDemo ? "Exit Sandbox" : "Demo Sandbox"}
            </button>
          )}
        </div>
      </div>

      {/* Grid of 5 Premium Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        
        {/* CHART 1: Area Cash Flow (4 Columns on Large Screens) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-4 bg-card border border-border/50 rounded-3xl p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Monthly Cash Flow Trend
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Income vs Expenses trend over the past 6 months
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Income
              </span>
              <span className="flex items-center gap-1.5 text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                Expenses
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val >= 1000 ? val / 1000 + "k" : val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="Income"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Area
                  type="monotone"
                  dataKey="Expenses"
                  stroke="#ef4444"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* CHART 2: Donut Expense Breakdown (2 Columns on Large Screens) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-2 bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex flex-col justify-between"
        >
          <div className="space-y-0.5">
            <h3 className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-wider">
              <FaChartPie className="text-violet-500" />
              Expense Breakdown
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Distribution across categories
            </p>
          </div>

          <div className="relative h-44 my-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseCategoriesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {expenseCategoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString()}`, "Amount"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Spent</span>
              <span className="text-base font-black text-foreground">₹{totalExpenseSum.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-muted-foreground max-h-24 overflow-y-auto pr-1">
            {expenseCategoriesData.map((item, idx) => {
              const percentage = totalExpenseSum > 0 ? Math.round((item.value / totalExpenseSum) * 100) : 0;
              return (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="truncate max-w-[80px]" title={item.name}>
                    {item.name}
                  </span>
                  <span className="text-foreground shrink-0">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* CHART 3: Savings Progress & Rate (3 Columns) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-3 bg-card border border-border/50 rounded-3xl p-6 shadow-sm space-y-4"
        >
          <div className="space-y-0.5">
            <h3 className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-wider">
              <FaCoins className="text-amber-500" />
              Savings Trend & Efficiency
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Net savings compared with monthly savings rate (%)
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyData} margin={{ top: 10, right: -15, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val >= 1000 ? val / 1000 + "k" : val}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  yAxisId="left"
                  dataKey="Savings"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={45}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="Savings Rate (%)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 3, strokeWidth: 0, fill: "#10b981" }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* CHART 4: Budget vs Actual (3 Columns) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-3 bg-card border border-border/50 rounded-3xl p-6 shadow-sm space-y-4"
        >
          <div className="space-y-0.5">
            <h3 className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-wider">
              <FaScaleBalanced className="text-emerald-500" />
              Budget vs. Actual Spend
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Category allocation limit vs actual spending behavior
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={budgetVsActualData}>
                <PolarGrid stroke="hsl(var(--border) / 0.4)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: 700 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, "auto"]}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                  axisLine={false}
                />
                <Radar
                  name="Budget Limit"
                  dataKey="Budget"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                />
                <Radar
                  name="Actual Spent"
                  dataKey="Actual"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.2}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "11px", fontWeight: 700 }} />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString()}`]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "11px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* CHART 5: Income Source breakdown (6 Columns / Full Width Horizontal layout) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-6 bg-card border border-border/50 rounded-3xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="md:col-span-1 flex flex-col justify-between py-1">
            <div className="space-y-1.5">
              <h3 className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-wider">
                <FaArrowTrendUp className="text-emerald-500" />
                Income Source Breakdown
              </h3>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Comparison of different revenue pipelines. A diverse set of income streams builds robust financial resilience.
              </p>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-border/30">
              <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
                <span>Top Stream:</span>
                <span className="text-foreground font-extrabold uppercase">
                  {incomeSourcesData[0]?.name || "N/A"}
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: "75%" }} />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={incomeSourcesData}
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border) / 0.3)" />
                <XAxis
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  fontWeight={700}
                  tickLine={false}
                  axisLine={false}
                  width={90}
                />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString()}`]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "11px",
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[0, 6, 6, 0]}
                  barSize={16}
                >
                  {incomeSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
