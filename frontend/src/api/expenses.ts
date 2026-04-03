// ==============================
// Expenses API Calls
// Handles fetching, adding, updating, and deleting expenses
// ==============================

import axios from "axios";
import { API_BASE_URL } from "../config"; 
import { Expense } from "../types";

/**
 * Fetches the list of expenses from the backend.
 * @param token - The authentication token (JWT).
 * @returns An array of expenses.
 * @throws An error message if fetching fails.
 */
export const fetchExpenses = async (token: string): Promise<Expense[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/expenses`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include JWT for authentication
      },
    });
    return response.data; // Returns an array of expenses
  } catch (error: any) {
    throw error.response?.data?.detail || "Failed to fetch expenses";
  }
};

/**
 * Adds a new expense to the backend.
 * @param token - The authentication token (JWT).
 * @param expenseData - The expense details.
 * @returns The newly created expense object.
 * @throws An error message if adding fails.
 */
export const addExpense = async (token: string, expenseData: Omit<Expense, "id">): Promise<Expense> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/expenses`, expenseData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Returns the created expense object
  } catch (error: any) {
    throw error.response?.data?.detail || "Failed to add expense";
  }
};

/**
 * Updates an existing expense in the backend.
 * @param token - The authentication token (JWT).
 * @param expenseId - The ID of the expense to update.
 * @param expenseData - The updated expense details.
 * @returns The updated expense object.
 * @throws An error message if updating fails.
 */
export const updateExpense = async (
  token: string, 
  expenseId: string, 
  expenseData: Partial<Omit<Expense, "id">>
): Promise<Expense> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/expenses/${expenseId}`, expenseData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Returns the updated expense object
  } catch (error: any) {
    throw error.response?.data?.detail || "Failed to update expense";
  }
};

/**
 * Deletes an expense from the backend.
 * @param token - The authentication token (JWT).
 * @param expenseId - The ID of the expense to delete.
 * @throws An error message if deletion fails.
 */
export const deleteExpense = async (token: string, expenseId: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/expenses/${expenseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw error.response?.data?.detail || "Failed to delete expense";
  }
};