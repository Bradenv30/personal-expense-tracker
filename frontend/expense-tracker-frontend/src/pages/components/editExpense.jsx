import { useState } from "react";
import { updateExpense, deleteExpense } from "../../api/expenses";

export default function EditExpense({ expense, onClose, setExpenses }) {
  const [name, setName] = useState(expense.name || "");
  const [amount, setAmount] = useState(expense.amount || "");
  const [date, setDate] = useState(
    expense.date ? new Date(expense.date).toISOString().slice(0, 10) : ""
  );
  const [description, setDescription] = useState(expense.description || "");
  const [type, setType] = useState(expense.type || "");
  const [loading, setLoading] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = {
      amount: parseFloat(amount),
      ...(name && { name }),
      ...(date && { date }),
      ...(description && { description }),
      ...(type && { type }),
    };

    try {
      setLoading(true);
      const updatedExpense = await updateExpense(expense.id, updated);
      setExpenses((prev) =>
        prev.map((item) => (item.id === expense.id ? updatedExpense : item))
      );
      setLoading(false);
      onClose();
    } catch (error) {
      console.error("Update failed", error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteExpense(expense.id);
      setExpenses((prev) => prev.filter((item) => item.id !== expense.id));
      setLoading(false);
      onClose();
    } catch (error) {
      console.error("Delete failed", error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-overlay backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-surface-white backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text text-center mb-6">
            Edit Expense
          </h2>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral mb-2">
              Expense Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral mb-2">
              Amount
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral mb-2">
              Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral mb-2">
              Category
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Subscription">Subscription</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Bills/Utilities">Bills/Utilities</option>
              <option value="Groceries/Necessities">
                Groceries/Necessities
              </option>
              <option value="Vacation">Vacation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral mb-2">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center pt-6">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl bg-error hover:bg-error/90 text-light text-sm font-semibold transition-colors duration-200"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-neutral-light hover:bg-neutral-light/70 text-neutral font-semibold transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-light font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Expense"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
