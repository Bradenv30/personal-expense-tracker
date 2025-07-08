import { useState, useEffect } from "react";
import { updateBudget, deleteBudget, getAllBudgets } from "../../api/budget";

export default function EditBudget({ budget, onClose, setBudget, setBudgets }) {
  const formatDateInput = (value) => {
    if (!value) return "";
    if (value.includes("T")) {
      return value.split("T")[0];
    } else if (value.includes("-")) {
      const parts = value.split("-");
      if (parts.length === 3 && parts[0].length === 4) {
        return value;
      }
    }
    return "";
  };

  const [name, setName] = useState(budget.name || "");
  const [amount, setAmount] = useState(budget.amount || "");
  const [isActive, setIsActive] = useState(budget.is_active ?? true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    setStartDate(formatDateInput(budget.start_date));
    setEndDate(formatDateInput(budget.end_date));
  }, [budget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = {
      amount: parseFloat(amount),
      ...(name && { name }),
      is_active: isActive,
      start_date: startDate === "" ? null : startDate,
      end_date: endDate === "" ? null : endDate,
    };

    try {
      setLoading(true);
      await updateBudget(budget.id, updated);
      const updatedBudgets = await getAllBudgets();
      setBudgets(updatedBudgets);
      const fresh = updatedBudgets.find((b) => b.id === budget.id);
      setBudget(fresh || null);
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
      await deleteBudget(budget.id);
      setBudgets((prev) => {
        const updated = prev.filter((item) => item.id !== budget.id);
        setBudget(updated.length > 0 ? updated[0] : null);
        return updated;
      });
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
          <h2 className="text-2xl font-bold text-white">Edit Budget</h2>

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
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              {startDate && (
                <button
                  type="button"
                  onClick={() => setStartDate("")}
                  className="text-sm text-red-400 hover:underline"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              End Date
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              {endDate && (
                <button
                  type="button"
                  onClick={() => setEndDate("")}
                  className="text-sm text-red-400 hover:underline"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            {!confirmingDelete ? (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="text-sm text-red-500 hover:underline"
                disabled={loading}
              >
                Delete
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDelete}
                className="text-sm text-red-600 font-semibold hover:underline"
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
