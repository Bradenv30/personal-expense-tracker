import { useState } from "react";
import { createExpense } from "../../api/expenses";

export default function AddExpenseForm({ onClose, setExpenses }) {
  //state for each table field
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newExpense = {
      //used spread operator like this to avoid sending empty strings to DB
      //and causing a silent crash
      amount: parseFloat(amount),
      ...(name && { name }),
      ...(date && { date }),
      ...(description && { description }),
      ...(type && { type }),
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
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
          {/* Form Inputs */}
          <input
            type="text"
            placeholder="Name (optional)"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount (required)"
            className="w-full border p-2 rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <input
            type="date"
            placeholder="Date (optional)"
            className="w-full border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <textarea
            type="text"
            placeholder="Description (optional)"
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Type (optional)</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Subscription">Subscription</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bills/Utilities">Bills/Utilities</option>
            <option value="Groceries/Necessities">Groceries/Necessities</option>
            <option value="Vacation">Vacation</option>
            <option value="Other">Other</option>
          </select>

          <div className="mt-4 flex justify-end gap-2">
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
        </form>
      </div>
    </div>
  );
}
