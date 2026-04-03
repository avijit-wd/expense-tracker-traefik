// ==============================
// Dashboard Page
// ==============================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Expense } from "../types";
import { useExpenses } from "../hooks/useExpenses";
import ExpenseTable from "../components/ExpenseTable";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseChart from "../components/ExpenseChart";

function Dashboard() {
  const navigate = useNavigate();
  const { expenses, error, handleDelete, handleEditExpense, loadExpenses } = useExpenses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Redirect to auth page if no token is found
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
  }, [navigate]);

  /**
   * Handles user logout.
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  /**
   * Opens the modal for editing an expense.
   */
  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-6">
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-amber-500">Dashboard</h1>
        <hr className="border-t-2 border-amber-500 mb-6" />

        {/* New Expense Button */}
        <div className="flex justify-end mb-4">
          <button
            className="bg-amber-500 text-black px-4 py-2 rounded hover:bg-amber-600 transition"
            onClick={() => {
              setEditingExpense(null); // Clear editing state
              setIsModalOpen(true);
            }}
          >
            ➕ New Expense
          </button>
        </div>

        {/* Display error message if any */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Expense Chart Component */}
        <ExpenseChart expenses={expenses} />

        {/* Expense Table Component */}
        <ExpenseTable expenses={expenses} onDelete={handleDelete} onEdit={handleEditClick} />

        {/* Expense Form Modal */}
        {isModalOpen && (
          <ExpenseForm 
            onClose={() => setIsModalOpen(false)}
            onExpenseAdded={loadExpenses}
            initialExpense={editingExpense} // Pre-fill the form with existing data
            onSave={handleEditExpense}
          />
        )}

        {/* Logout Button */}
        <div className="mt-6 flex justify-start">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            👋 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;