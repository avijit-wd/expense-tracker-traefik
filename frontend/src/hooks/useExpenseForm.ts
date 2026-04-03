// ==============================
// useExpenseForm Hook
// Handles expense form logic for adding and editing expenses
// ==============================

import { useState } from "react";
import { addExpense } from "../api/expenses";
import { UseExpenseFormProps } from "../types";

export const useExpenseForm = ({ onClose, onExpenseAdded, initialExpense, onSave }: UseExpenseFormProps) => {
    // State for form data, pre-filling values if editing
    const [formData, setFormData] = useState({
        description: initialExpense?.description || "",
        category: initialExpense?.category || "",
        amount: initialExpense?.amount.toString() || "",
        date: initialExpense?.date || "",
    });

    const [formError, setFormError] = useState("");

    /**
     * Handles form field changes.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /**
     * Validates form input before submission.
     */
    const validateForm = () => {
        if (formData.description.length < 3) {
            return "Description must be at least 3 characters.";
        }
        if (!formData.category) {
            return "Please select a category.";
        }
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            return "Amount must be greater than zero.";
        }
        if (!formData.date) {
            return "Please select a date.";
        }

        const selectedDate = new Date(formData.date);
        const today = new Date();
        if (selectedDate > today) {
            return "Date cannot be in the future.";
        }

        return "";
    };

    /**
     * Handles form submission, either adding or updating an expense.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setFormError(validationError);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setFormError("You must be logged in.");
                return;
            }

            if (initialExpense) {
                // If editing, call `onSave` with updated data
                await onSave(initialExpense.id, {
                    description: formData.description,
                    category: formData.category,
                    amount: parseFloat(formData.amount),
                    date: formData.date,
                });
            } else {
                // If adding a new expense, use `addExpense`
                await addExpense(token, {
                    description: formData.description,
                    category: formData.category,
                    amount: parseFloat(formData.amount),
                    date: formData.date,
                });

                onExpenseAdded(); // Notify parent to refresh expenses
            }

            // Reset form & close modal
            setFormData({ description: "", category: "", amount: "", date: "" });
            setFormError("");
            onClose();
        } catch (err: any) {
            setFormError(err.message || "An error occurred while saving the expense.");
        }
    };

    return {
        formData,
        formError,
        handleChange,
        handleSubmit,
    };
};