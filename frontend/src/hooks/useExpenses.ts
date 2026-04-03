// ==============================
// useExpenses Hook
// Handles fetching, deleting, and updating expenses
// ==============================

import { useState, useEffect } from "react";
import { fetchExpenses, deleteExpense, updateExpense } from "../api/expenses";
import { Expense } from "../types";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState("");

  /**
   * Fetches the list of expenses from the API.
   * This function is exposed so it can be called manually when needed.
   */
  const loadExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in.");
        return;
      }

      const data = await fetchExpenses(token);
      setExpenses(data);
    } catch (err: any) {
      setError(err.message || "Failed to load expenses.");
    }
  };

  // Fetch expenses on component mount
  useEffect(() => {
    loadExpenses();
  }, []);

  /**
   * Deletes an expense by ID and refreshes the expense list.
   */
  const handleDelete = async (expenseId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in.");
        return;
      }

      await deleteExpense(token, expenseId);
      await loadExpenses(); // Refresh the list after deletion
    } catch (err: any) {
      setError(err.message || "Failed to delete expense.");
    }
  };

  /**
   * Updates an existing expense and refreshes the expense list.
   */
  const handleEditExpense = async (expenseId: string, updatedData: Partial<Expense>) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in.");
        return;
      }

      await updateExpense(token, expenseId, updatedData);
      await loadExpenses(); // Refresh the list after editing
    } catch (err: any) {
      setError(err.message || "Failed to update expense.");
    }
  };

  return { expenses, error, handleDelete, loadExpenses, handleEditExpense };
};