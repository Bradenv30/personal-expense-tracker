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
    <section className="h-full flex flex-col overflow-y-auto scrollbar-blue bg-surface-white backdrop-blur-sm p-6 shadow-2xl rounded-2xl">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-4 bg-secondary/80 text-transparent bg-clip-text">
        Expenses
        {allExpenses.length > 0 && (
          <>
            <select
              value={sortName}
              onChange={(e) => setSortName(e.target.value)}
              className="bg-surface-light border border-neutral-light text-sm text-neutral px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Sort By Name</option>
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
            </select>

            <select
              value={sortAmount}
              onChange={(e) => setSortAmount(e.target.value)}
              className="bg-surface-light border border-neutral-light text-sm text-neutral px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Sort By Amount</option>
              <option value="amount-lowest">Lowest - Highest</option>
              <option value="amount-highest">Highest - Lowest</option>
            </select>

            <select
              value={sortDate}
              onChange={(e) => setSortDate(e.target.value)}
              className="bg-surface-light border border-neutral-light text-sm text-neutral px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Sort By Date</option>
              <option value="date-newest">Newest - Oldest</option>
              <option value="date-oldest">Oldest - Newest</option>
            </select>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="bg-surface-light border border-neutral-light text-sm text-neutral px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                className="bg-secondary/80 hover:bg-secondary active:scale-95 transform transition duration-200 text-light text-sm px-3 py-2 rounded-xl border border-secondary shadow-lg"
              >
                Clear Filters
              </button>
            )}
          </>
        )}
      </h2>

      {expenses.length === 0 ? (
        <div className="h-full flex items-center justify-center text-neutral">
          No expenses yet! Add your first expense above.
        </div>
      ) : (
        <ul className="space-y-2">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="bg-surface-white border border-neutral-light p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 flex justify-between items-start"
            >
              {/* Left: Expense Name */}
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base font-semibold text-neutral">
                  {expense.name || "Unnamed Expense"}
                </p>
                {expense.type && (
                  <span className="text-sm italic text-neutral px-2 py-1 bg-neutral-light rounded-full">
                    {expense.type}
                  </span>
                )}
              </div>

              {/* Right: Amount + Edit + Type */}
              <div className="text-right flex flex-col items-end space-y-1">
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-neutral">
                    ${formatCurrency(expense.amount)}
                  </p>
                  <button
                    onClick={() => setEditingExpense(expense)}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 active:scale-95 transform transition duration-200 text-white text-sm px-3 py-2 rounded-xl shadow-lg"
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
