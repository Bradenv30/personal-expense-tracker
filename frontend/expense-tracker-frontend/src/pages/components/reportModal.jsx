import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ReportModal({ onClose, budget, expenses }) {
  const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const remaining = budget.amount - totalSpent;
  const expenseCount = expenses.length;

  const averageExpense = expenseCount > 0 ? totalSpent / expenseCount : 0;

  const percentUsed =
    budget.amount > 0 ? ((totalSpent / budget.amount) * 100).toFixed(1) : 0;

  const formatCurrency = (value) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: num % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const typeTotals = expenses.reduce((acc, curr) => {
    const type = curr.type || "Other";
    acc[type] = (acc[type] || 0) + parseFloat(curr.amount);
    return acc;
  }, {});

  const chartData = Object.entries(typeTotals)
    .map(([type, amount]) => ({ type, amount }))
    .sort((a, b) => b.amount - a.amount); // descending

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="absolute inset-0 z-40" />
      <div className="relative z-50 bg-white text-black p-8 rounded-xl shadow-xl w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
            📊 Budget Report — {budget.name || "Current Budget"}
          </h2>
          <button onClick={onClose} className="text-error hover:text-error/80 text-xl font-bold transition-colors duration-200">
            ✕
          </button>
        </div>

        {/* Budget Summary Grid */}
        <div className="grid grid-cols-2 gap-6 text-lg font-semibold">
          <div>
            <p>Budget Limit</p>
            <p className="font-normal">${formatCurrency(budget.amount)}</p>
          </div>
          <div>
            <p>Total Spent</p>
            <p className="font-normal">${formatCurrency(totalSpent)}</p>
          </div>
          <div>
            <p>Remaining</p>
            <p className="font-normal">${formatCurrency(remaining)}</p>
          </div>
          <div>
            <p>% of Budget Used</p>
            <p className="font-normal">{percentUsed}%</p>
          </div>
          <div>
            <p># of Expenses</p>
            <p className="font-normal">{expenseCount}</p>
          </div>
          <div>
            <p>Average Expense</p>
            <p className="font-normal">${formatCurrency(averageExpense)}</p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">Spending by Type</h3>
          {chartData.length === 0 ? (
            <p className="text-gray-500">No expenses to display.</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="type"
                    angle={-15}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${formatCurrency(value)}`} />
                  <Bar
                    dataKey="amount"
                    name="Amount"
                    fill="oklch(0.6178 0.1324 70.26)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
