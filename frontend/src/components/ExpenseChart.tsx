// ==============================
// ExpenseChart Component
// Displays expenses grouped by category or date using a bar chart
// ==============================

import React, { useState } from "react";
import { Expense } from "../types";
import { CATEGORY_EMOJIS } from "../constants/categories";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ExpenseChartProps {
  expenses: Expense[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses }) => {
  const [groupBy, setGroupBy] = useState<"category" | "date">("category");

  /**
   * Groups expenses based on the selected grouping option (category or date).
   */
  const groupedData: Record<string, number> = expenses.reduce((acc, expense) => {
    const key = groupBy === "category" ? expense.category : expense.date;
    acc[key] = (acc[key] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  /**
   * Converts grouped data into an array format for Recharts.
   */
  const initialData = Object.keys(groupedData).map((key) => ({
    key,
    total: groupedData[key],
  }));

  // If grouping by date, sort the entries chronologically
  if (groupBy === "date") {
    initialData.sort((a, b) => new Date(a.key).getTime() - new Date(b.key).getTime());
  }

  // Convert data into Recharts format, replacing categories with emojis if applicable
  const dataKeyLabel = groupBy === "category" ? "category" : "date";
  const chartData = initialData.map((item) => ({
    [dataKeyLabel]: CATEGORY_EMOJIS[item.key] || item.key,
    total: item.total,
  }));

  return (
    <div className="my-6">
      <h2 className="text-2xl font-bold mb-4 text-amber-500">Expense Chart</h2>

      {/* Dropdown to switch grouping */}
      <div className="mb-4">
        <label htmlFor="groupBy" className="mr-2">Group by:</label>
        <select
          id="groupBy"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as "category" | "date")}
          className="text-white font-bold px-2 py-1 rounded border border-white"
        >
          <option value="category">Category</option>
          <option value="date">Date</option>
        </select>
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis 
            dataKey={dataKeyLabel} 
            stroke="#fff" 
            tick={groupBy === "date" ? { fontStyle: "italic" } : {}}
          />
          <YAxis 
            stroke="#fff" 
            tickFormatter={(value) => `$${value}`}
            tick={{ fontWeight: "bold" }}
          />
          <Tooltip
            formatter={(value: number) => `$${value}`}
            contentStyle={{ backgroundColor: "#333", color: "#fff" }}
            cursor={{ fill: "transparent" }}
          />
          <Legend wrapperStyle={{ color: "#fff" }} />
          <Bar dataKey="total" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;