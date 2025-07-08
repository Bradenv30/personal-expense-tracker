export default function ExpenseList({
  expenses,
  allExpenses,
  setEditingExpense,
  sortName,
  setSortName,
  sortDate,
  setSortDate,
  sortType,
  setSortType,
  sortAmount,
  setSortAmount,
}) {
  const formatCurrency = (value) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: num % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(num);
  };
  return (
    <section className="h-full flex flex-col overflow-y-auto scrollbar-blue bg-pastelgray p-6 shadow-md text-white">
      <h2 className="text-black text-xl font-semibold mb-4 flex items-center gap-4">
        Expenses
        {allExpenses.length > 0 && (
          <>
            <select
              value={sortName}
              onChange={(e) => setSortName(e.target.value)}
              className="bg-vanillaice text-sm text-black px-2 py-1 rounded-md focus:outline-none"
            >
              <option value="">Sort By Name</option>
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
            </select>

            <select
              value={sortAmount}
              onChange={(e) => setSortAmount(e.target.value)}
              className="bg-vanillaice text-sm text-black px-2 py-1 rounded-md focus:outline-none"
            >
              <option value="">Sort By Amount</option>
              <option value="amount-lowest">Lowest - Highest</option>
              <option value="amount-highest">Highest - Lowest</option>
            </select>

            <select
              value={sortDate}
              onChange={(e) => setSortDate(e.target.value)}
              className="bg-vanillaice text-sm text-black px-2 py-1 rounded-md focus:outline-none"
            >
              <option value="">Sort By Date</option>
              <option value="date-newest">Newest - Oldest</option>
              <option value="date-oldest">Oldest - Newest</option>
            </select>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="bg-vanillaice text-sm text-black px-2 py-1 rounded-md focus:outline-none"
            >
              <option value="">Sort By Type</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Subscription">Subscription</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Bills/Utilities">Bills/Utilities</option>
              <option value="Groceries/Necessities">
                Groceries/Necessities
              </option>
              <option value="Travel">Travel</option>
              <option value="Other">Other</option>
            </select>
            {(sortName || sortAmount || sortDate || sortType) && (
              <button
                onClick={() => {
                  setSortName("");
                  setSortAmount("");
                  setSortDate("");
                  setSortType("");
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-2 py-1 rounded-md border border-indigo-700 transition"
              >
                Undo Filters
              </button>
            )}
          </>
        )}
      </h2>

      {expenses.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-400">
          No expenses!
        </div>
      ) : (
        <ul className="space-y-2">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="bg-vanillaice p-4 rounded-lg flex justify-between items-start"
            >
              {/* Left: Expense Name */}
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base font-semibold text-black">
                  {expense.name || "Unnamed Expense"}
                </p>
                {expense.type && (
                  <span className="text-base italic text-gray-600">
                    {expense.type}
                  </span>
                )}
              </div>

              {/* Right: Amount + Edit + Type */}
              <div className="text-right flex flex-col items-end space-y-1">
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-black">
                    ${formatCurrency(expense.amount)}
                  </p>
                  <button
                    onClick={() => setEditingExpense(expense)}
                    className="bg-lightorange text-white text-sm px-3 py-1 rounded-md hover:bg-orange-600 transition"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
