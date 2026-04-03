// ==============================
// Expense Data Model
// ==============================

/**
 * Represents a single expense entry.
 */
export interface Expense {
    id: string;          // Unique identifier for the expense
    description: string; // Description of the expense
    category: string;    // Expense category (e.g., Food, Transport, etc.)
    amount: number;      // Expense amount in currency format
    date: string;        // Date of the expense (ISO format)
}

// ==============================
// Form Field Props
// ==============================

/**
 * Props for the ExpenseFormFields component.
 * Handles form data state and change events.
 */
export interface ExpenseFormFieldsProps {
    formData: {
        description: string; // Description input value
        category: string;    // Selected category value
        amount: string;      // Amount input value (string for controlled input)
        date: string;        // Date input value (string for controlled input)
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

// ==============================
// Expense Form Hook Props
// ==============================

/**
 * Props for the useExpenseForm custom hook.
 * Handles form state, saving, and closing events.
 */
export interface UseExpenseFormProps {
    onExpenseAdded: () => void;  // Callback when a new expense is added
    onClose: () => void;         // Callback when the form is closed
    initialExpense?: Expense | null; // Optional initial expense data for editing
    onSave: (expenseId: string, updatedData: any) => void; // Callback for saving updates
}

// ==============================
// Expense Form Buttons Props
// ==============================

/**
 * Props for the buttons used in the ExpenseForm.
 */
export interface ExpenseFormButtonsProps {
    onCancel: () => void;       // Handler for cancel action
    onSubmit: (e: React.FormEvent) => void; // Handler for form submission
    buttonText: string;         // Text to display on the submit button
}
