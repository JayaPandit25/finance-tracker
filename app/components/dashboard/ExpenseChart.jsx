"use client";

import { PieChart, Pie, Cell, Tooltip } from "recharts";

export default function ExpenseChart({ expenses }) {
  const data = expenses.reduce((acc, exp) => {
    const found = acc.find(
      (item) => item.name === exp.category
    );

    if (found) {
      found.value += Number(exp.amount);
    } else {
      acc.push({
        name: exp.category,
        value: Number(exp.amount),
      });
    }

    return acc;
  }, []);

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#00C49F",
  ];

  return (
    <div className="p-4 border rounded mt-6">
      <h2 className="text-lg font-semibold mb-4">
        Expense Breakdown 📊
      </h2>

      <PieChart width={300} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </div>
  );
}