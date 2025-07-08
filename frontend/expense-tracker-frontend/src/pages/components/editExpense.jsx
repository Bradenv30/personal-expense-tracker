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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md text-white">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-2xl font-bold text-white">Edit Expense</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Amount</label>
            <input
              type="number"
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
              className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details or notes..."
            />
          </div>

          <div className="flex justify-between pt-4">
            {!confirmingDelete ? (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="text-sm text-red-400 hover:underline"
                disabled={loading}
              >
                Delete
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDelete}
                className="text-sm text-red-500 font-semibold hover:underline"
                disabled={loading}
              >
                Confirm Delete
              </button>
            )}

            <div className="flex gap-2">
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
          </div>
        </form>
      </div>
    </div>
  );
}
