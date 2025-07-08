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
    <div className="fixed inset-0 bg-overlay backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-surface-white backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text text-center mb-6">Edit Budget</h2>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral mb-2">Budget Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral mb-2">Budget Amount</label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-neutral mb-2">
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
                  className="w-4 h-4 accent-success"
                />
                <span className="text-sm text-neutral">Active</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="budgetStatus"
                  value="inactive"
                  checked={isActive === false}
                  onChange={() => setIsActive(false)}
                  className="w-4 h-4 accent-error"
                />
                <span className="text-sm text-neutral">Inactive</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral mb-2">
              Start Date (optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              {startDate && (
                <button
                  type="button"
                  onClick={() => setStartDate("")}
                  className="text-sm text-error hover:text-error/80 font-semibold px-2"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral mb-2">
              End Date (optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              {endDate && (
                <button
                  type="button"
                  onClick={() => setEndDate("")}
                  className="text-sm text-error hover:text-error/80 font-semibold px-2"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl bg-neutral-light hover:bg-neutral-light/70 text-neutral font-semibold transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-light font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Budget"}
              </button>
            </div>

            <div className="flex justify-center">
              {!confirmingDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="text-sm text-error hover:text-error/80 underline font-semibold"
                  disabled={loading}
                >
                  Delete Budget
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl bg-error hover:bg-error/90 text-light text-sm font-semibold transition-colors duration-200"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Confirm Delete"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
