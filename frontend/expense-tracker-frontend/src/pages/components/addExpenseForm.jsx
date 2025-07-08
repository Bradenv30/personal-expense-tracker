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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md text-white">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-2xl font-bold text-white">Add Expense</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              placeholder="Optional"
              className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Amount</label>
            <input
              type="number"
              placeholder="Required"
              className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Date</label>
            <input
              type="date"
              placeholder="Optional"
              className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2"
            >
              <option value="">Select Type (optional)</option>
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
            <label className="text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              placeholder="Details or notes... (optional)"
              className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-4 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
