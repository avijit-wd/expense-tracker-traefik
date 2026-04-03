// ==============================
// ExpenseForm Component
// Handles adding and editing expenses
// ==============================

import ExpenseFormFields from "./ExpenseFormFields";
import ExpenseFormButtons from "./ExpenseFormButtons";
import { useExpenseForm } from "../hooks/useExpenseForm";
import { UseExpenseFormProps } from "../types";

const ExpenseForm: React.FC<UseExpenseFormProps> = ({ onClose, onExpenseAdded, onSave, initialExpense }) => {
  const isEditing = Boolean(initialExpense);
  const { formData, formError, handleChange, handleSubmit } = useExpenseForm({
    onClose,
    onExpenseAdded,
    initialExpense,
    onSave,
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        {/* Form Title */}
        <h2 className="text-2xl font-bold text-amber-500 mb-4">
          {isEditing ? "Edit Expense" : "Add New Expense"}
        </h2>

        {/* Error Message */}
        {formError && <p className="text-red-500 mb-3">{formError}</p>}

        {/* Expense Form */}
        <form onSubmit={handleSubmit}>
          {/* Input Fields */}
          <ExpenseFormFields formData={formData} handleChange={handleChange} />

          {/* Buttons */}
          <div className="mt-6">
            <ExpenseFormButtons
              onCancel={onClose}
              onSubmit={handleSubmit}
              buttonText={isEditing ? "✏️ Save Changes" : "➕ Add Expense"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;