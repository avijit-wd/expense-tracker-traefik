// ==============================
// ExpenseFormFields Component
// Handles form input fields for expenses
// ==============================

import React from "react";
import { CATEGORIES, CATEGORY_EMOJIS } from "../constants/categories";

interface ExpenseFormFieldsProps {
  formData: {
    description: string;
    category: string;
    amount: string;
    date: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const ExpenseFormFields: React.FC<ExpenseFormFieldsProps> = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      {/* Description Input */}
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded bg-gray-700 text-white"
      />

      {/* Category Dropdown */}
      <select
        name="category"
        value={formData.category} 
        onChange={handleChange}
        required
        className="w-full p-2 border rounded bg-gray-700 text-white"
      >
        <option value="">Select Category</option>
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {CATEGORY_EMOJIS[category] || category}
          </option>
        ))}
      </select>

      {/* Amount Input */}
      <input
        type="number"
        name="amount"
        placeholder="Amount [$]"
        value={formData.amount}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded bg-gray-700 text-white"
      />

      {/* Date Picker */}
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded bg-gray-700 text-white"
      />
    </div>
  );
};

export default ExpenseFormFields;