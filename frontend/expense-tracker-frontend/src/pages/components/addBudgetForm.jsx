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
    <div className="fixed inset-0 bg-overlay backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-surface-white backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text text-center mb-6">Create New Budget</h2>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral mb-2">
              Budget Name (optional)
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Budget"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral mb-2">
              Budget Amount (required)
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
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
            <input
              type="date"
              className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral mb-2">
              End Date (optional)
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-light font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
