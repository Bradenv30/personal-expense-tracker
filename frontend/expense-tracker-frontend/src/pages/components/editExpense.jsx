import { useState } from "react";
import { updateExpense, deleteExpense } from "../../api/expenses";

export default function EditExpense({ expense, onClose, setExpenses }) {
  // Local form state prefilled with existing data
  const [name, setName] = useState(expense.name || "");
  const [amount, setAmount] = useState(expense.amount || "");
  const [date, setDate] = useState(expense.date || "");
  const [description, setDescription] = useState(expense.description || "");
  const [type, setType] = useState(expense.type || "");
  const [loading, setLoading] = useState(false);

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
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4">Edit Expense</h2>

          <input
            type="text"
            placeholder="Name"
            className="w-full border p-2 rounded mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            className="w-full border p-2 rounded mb-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <input
            type="date"
            className="w-full border p-2 rounded mb-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="w-full border p-2 rounded mb-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          >
            <option value="">Select Type</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Subscription">Subscription</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bills/Utilities">Bills/Utilities</option>
            <option value="Groceries/Necessities">Groceries/Necessities</option>
            <option value="Vacation">Vacation</option>
            <option value="Other">Other</option>
          </select>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              Delete
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
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
