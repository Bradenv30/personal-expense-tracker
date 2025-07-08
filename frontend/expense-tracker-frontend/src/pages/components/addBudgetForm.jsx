import { useState } from "react";
import { createBudget, getAllBudgets } from "../../api/budget";

export default function AddBudgetForm({
  onClose,
  setBudget,
  setBudgets,
  budgets,
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usedNames = new Set(
      budgets.map((b) => b.name).filter((n) => n?.startsWith("Budget "))
    );

    let defaultName = "";
    if (!name.trim()) {
      let counter = 1;
      while (usedNames.has(`Budget ${counter}`)) {
        counter++;
      }
      defaultName = `Budget ${counter}`;
    }

    const newBudget = {
      amount: parseFloat(amount),
      name: name.trim() || defaultName,
      is_active: isActive,
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
    };

    try {
      setLoading(true);
      const addedBudget = await createBudget(newBudget);
      const updatedBudgets = await getAllBudgets();
      setBudgets(updatedBudgets);
      const fullBudget = updatedBudgets.find((b) => b.id === addedBudget.id);
      if (fullBudget) {
        setBudget(fullBudget);
        localStorage.setItem("selectedBudgetId", fullBudget.id);
      }
      setLoading(false);
      onClose();
    } catch (error) {
      console.log("Error creating budget", error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md text-white">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-2xl font-bold text-white">Add Budget</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Name (optional)
            </label>
            <input
              type="text"
              className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Amount (required)
            </label>
            <input
              type="number"
              className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-base font-medium text-white mb-2">
              Budget Status
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="budgetStatus"
                  value="active"
                  checked={isActive === true}
                  onChange={() => setIsActive(true)}
                  className="w-5 h-5 accent-indigo-500"
                />
                <span className="text-base text-white">Active</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="budgetStatus"
                  value="inactive"
                  checked={isActive === false}
                  onChange={() => setIsActive(false)}
                  className="w-5 h-5 accent-red-500"
                />
                <span className="text-base text-white">Inactive</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Start Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              End Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
