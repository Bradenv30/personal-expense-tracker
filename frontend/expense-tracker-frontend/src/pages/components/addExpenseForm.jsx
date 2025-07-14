import { useState } from "react";
import { createExpense } from "../../api/expenses";

export default function AddExpenseForm({ onClose, setExpenses, budgetID }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalType = type || "Other";

    const newExpense = {
      budget_id: budgetID.id,
      amount: parseFloat(amount),
      ...(name && { name }),
      ...(date && { date }),
      ...(description && { description }),
      type: finalType,
    };

    try {
      setLoading(true);
      const addedExpense = await createExpense(newExpense);
      setExpenses((prev) => [addedExpense, ...prev]);
      setLoading(false);
      onClose();
    } catch (error) {
      console.log("Error creating expense", error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-overlay backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-surface-white backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text text-center mb-6">
            Add New Expense
          </h2>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral mb-2">
              Expense Name (optional)
            </label>
            <input
              type="text"
              placeholder="Coffee, Gas, etc."
              className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral mb-2">
              Amount (required)
            </label>
            <input
              type="number"
              placeholder="25.99"
              className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral mb-2">
              Date (optional)
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
              Category (optional)
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
              Description (optional)
            </label>
            <textarea
              placeholder="Additional details or notes..."
              className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-neutral-light hover:bg-neutral-light/70 text-neutral font-semibold transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-primary text-light font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
