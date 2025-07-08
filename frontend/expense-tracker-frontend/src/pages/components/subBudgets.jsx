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

  // If hidden, only render the toggle button
  if (!showGoals) {
    return (
      <div className="p-4">
        <button
          onClick={() => setShowGoals(true)}
          className="text-sm font-semibold text-dartmouth hover:underline"
        >
          + Show Category Goals
        </button>
      </div>
    );
  }

  // Full box when expanded
  return (
    <div className="p-4 flex flex-col bg-pastelgray rounded shadow h-[350px]">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-semibold mr-4">Category Goals</h2>

        <div className="flex gap-2 flex-wrap items-center">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-md bg-vanillaice text-black text-sm shadow-sm focus:outline-none"
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
            className="px-3 py-2 rounded-md bg-white text-sm border shadow-sm focus:outline-none"
          />

          <button
            onClick={handleAddGoal}
            className="bg-dartmouth text-white px-4 py-2 rounded-md text-sm font-semibold shadow hover:bg-green-700 transition"
          >
            Add
          </button>
        </div>

        <button
          onClick={() => setShowGoals(false)}
          className="text-sm font-semibold text-red-600 hover:underline ml-auto"
        >
          Hide
        </button>
      </div>

      <div className="pr-1 flex-1">
        {goals.length === 0 ? (
          <p className="text-gray-500">No goals added yet.</p>
        ) : (
          <ul className="space-y-2">
            {goals.map((goal) => {
              const spent = getTotalForType(goal.type);
              return (
                <li
                  key={goal.id}
                  className="bg-white rounded-md p-4 shadow-sm text-black"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold whitespace-nowrap">
                      {goal.type}: Limit – ${goal.goal}
                    </p>
                    <p className="text-sm text-black whitespace-nowrap text-right w-36">
                      ${spent.toFixed(2)} / ${goal.goal}
                    </p>
                    <button
                      onClick={() => handleRemoveGoal(goal.id)}
                      className="text-red-600 text-lg font-bold px-2 hover:text-red-800 transition"
                      aria-label={`Remove ${goal.type} goal`}
                    >
                      ×
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
