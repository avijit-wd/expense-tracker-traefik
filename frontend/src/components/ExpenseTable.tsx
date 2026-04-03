// ==============================
// ExpenseTable Component
// Displays a list of expenses in a table format
// ==============================

import React from "react";
import { Expense } from "../types";
import { CATEGORY_EMOJIS } from "../constants/categories";

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, onDelete, onEdit }) => {
  return (
    <table className="w-full border-collapse">
      {/* Table Caption */}
      <caption className="text-2xl font-bold mb-4 text-amber-500 text-left">
        Expense Overview
      </caption>

      {/* Table Header */}
      <thead>
        <tr className="bg-gray-700 text-amber-500">
          <th className="border border-gray-600 p-3 text-left">Description</th>
          <th className="border border-gray-600 p-3 text-left">Category</th>
          <th className="border border-gray-600 p-3 text-right">Amount</th>
          <th className="border border-gray-600 p-3 text-center">Date</th>
          <th className="border border-gray-600 p-3 text-center">Actions</th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody>
        {expenses.length > 0 ? (
          expenses.map((expense, index) => (
            <tr
              key={expense.id}
              className={`transition-colors hover:bg-amber-500 ${
                index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
              }`}
            >
              {/* Description Column */}
              <td className="border border-gray-600 p-3">
                {expense.description}
              </td>

              {/* Category Column */}
              <td className="border border-gray-600 p-3">
                {CATEGORY_EMOJIS[expense.category] || expense.category}
              </td>

              {/* Amount Column */}
              <td className="border border-gray-600 p-3 text-right font-bold">
                ${expense.amount.toFixed(2)}
              </td>

              {/* Date Column */}
              <td className="border border-gray-600 p-3 text-center italic">
                {expense.date}
              </td>

              {/* Actions Column */}
              <td className="border border-gray-600 p-3 flex gap-2 justify-center">
                <button
                  className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition"
                  onClick={() => onEdit(expense)}
                >
                  ✏ Edit

                </button>
                <button
                  className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition"
                  onClick={() => onDelete(expense.id)}
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          // Fallback message when no expenses exist
          <tr>
            <td colSpan={5} className="text-center p-4 text-gray-400">
              No expenses recorded yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ExpenseTable;