import { useState, useEffect } from "react";
import {
  getCategoryGoals,
  createCategoryGoal,
  deleteCategoryGoal,
} from "../../api/expenses";

export default function SubBudgets({ expenses, budget }) {
  const [goals, setGoals] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [showGoals, setShowGoals] = useState(true);

  const types = [...new Set(expenses.map((e) => e.type).filter(Boolean))];

  useEffect(() => {
    if (budget?.id) {
      getCategoryGoals(budget.id)
        .then((data) => setGoals(data))
        .catch((err) => console.error("Error fetching goals:", err));
    }
  }, [budget?.id]);

  const handleAddGoal = async () => {
    if (!selectedType || !goalAmount || !budget?.id) return;

    const existing = goals.find((g) => g.type === selectedType);
    if (existing) return;

    try {
      const newGoal = await createCategoryGoal({
        type: selectedType,
        goal: parseFloat(goalAmount),
        budget_id: budget.id,
      });

      setGoals((prev) => [...prev, newGoal]);
      setSelectedType("");
      setGoalAmount("");
    } catch (err) {
      console.error("Error creating goal:", err);
    }
  };

  const handleRemoveGoal = async (goalId) => {
    try {
      await deleteCategoryGoal(goalId);
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };

  const getTotalForType = (type) =>
    expenses
      .filter((e) => e.type === type)
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  if (!showGoals) {
    return (
      <div>
        <button
          onClick={() => setShowGoals(true)}
          className="text-sm font-semibold text-secondary hover:underline"
        >
          + Show Category Goals
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[350px]">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-semibold mr-4 bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">Category Goals</h2>

        <div className="flex gap-2 flex-wrap items-center">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-md bg-surface-light border border-neutral-light text-neutral text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select Type</option>
            {types
              .filter((type) => !goals.some((g) => g.type === type))
              .map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
          </select>

          <input
            type="number"
            placeholder="Enter goal"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            className="px-3 py-2 rounded-md bg-surface-light text-sm border border-neutral-light text-neutral shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />

          <button
            onClick={handleAddGoal}
            className="bg-gradient-to-r from-success to-success-light text-light px-4 py-2 rounded-xl text-sm font-semibold shadow hover:from-success/90 hover:to-success-light/90 transition-all duration-200"
          >
            Add
          </button>
        </div>

        <button
          onClick={() => setShowGoals(false)}
          className="text-sm font-semibold text-error hover:underline ml-auto"
        >
          Hide
        </button>
      </div>

      <div className="flex-1">
        {goals.length === 0 ? (
          <p className="text-neutral">No goals added yet.</p>
        ) : (
          <div className="space-y-0">
            {goals.map((goal, index) => {
              const spent = getTotalForType(goal.type);
              return (
                <div
                  key={goal.id}
                  className={`py-4 text-neutral ${
                    index < goals.length - 1 ? "border-b border-neutral-light" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold whitespace-nowrap">
                      {goal.type}: Limit – ${goal.goal}
                    </p>
                    <p className="text-sm text-neutral whitespace-nowrap text-right w-36">
                      ${spent.toFixed(2)} / ${goal.goal}
                    </p>
                    <button
                      onClick={() => handleRemoveGoal(goal.id)}
                      className="text-error text-lg font-bold px-2 hover:text-error/80 transition"
                      aria-label={`Remove ${goal.type} goal`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
