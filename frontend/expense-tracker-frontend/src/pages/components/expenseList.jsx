export default function ExpenseList({ expenses, setEditingExpense }) {
  return (
    <section className="bg-gray-800 p-6 rounded-2xl shadow-md text-white">
      <h2 className="text-xl font-semibold mb-4">Expenses</h2>

      {expenses.length === 0 ? (
        <p>No expenses!</p>
      ) : (
        <ul className="space-y-2">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{expense.name || "Unnamed"}</p>
                <p className="text-sm opacity-75">{expense.date}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${expense.amount}</p>
                <p className="text-xs italic opacity-50">{expense.type}</p>
                <button
                  onClick={() => setEditingExpense(expense)}
                  className="text-sm text-indigo-400 hover:text-indigo-200 underline mt-2 block"
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
