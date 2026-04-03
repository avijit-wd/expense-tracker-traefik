// ==============================
// ExpenseFormButtons Component
// Handles form submission and cancel actions
// ==============================

import React from "react";
import { ExpenseFormButtonsProps } from "../types";

const ExpenseFormButtons: React.FC<ExpenseFormButtonsProps> = ({ onCancel, onSubmit, buttonText }) => {
  return (
    <div className="flex justify-between">
      {/* Cancel Button */}
      <button
        type="button"
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        onClick={onCancel}
      >
        ❌ Cancel
      </button>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-amber-500 text-black px-4 py-2 rounded hover:bg-amber-600 transition"
        onClick={onSubmit}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ExpenseFormButtons;