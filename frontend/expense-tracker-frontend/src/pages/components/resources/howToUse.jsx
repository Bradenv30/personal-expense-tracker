export default function HowToUse({ onClose }) {
  return (
    <div className="fixed inset-0 bg-overlay backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-surface-white backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-[90%] max-w-3xl max-h-[95vh] ">
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text text-center mb-6">
            How to Use This Tool
          </h2>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral hover:text-primary text-xl font-bold focus:outline-none"
            aria-label="Close"
          >
            ×
          </button>
          <p className="text-neutral text-sm md:text-base leading-relaxed">
            At <span className="font-semibold">SimplySpent</span>, our goal is
            to make budgeting as simple as possible. This tool is designed to be
            lightweight and distraction-free — no paywalls and no unnecessary
            features. To get started:
          </p>
          <ul className="list-disc list-inside text-neutral space-y-3 text-sm md:text-base">
            <li>
              Start by adding a budget using the “Add Budget” button in the
              sidebar or at the top of your dashboard.
            </li>
            <li>
              If you’ve created multiple budgets, select which one to view using
              the budget dropdown in the budget section.
            </li>
            <li>To edit a budget, click the “Edit Budget” button.</li>
            <li>Add new expenses by clicking the “Add Expense” button.</li>
            <li>
              To edit an expense, click the “Edit” icon on the corresponding
              expense.
            </li>
            <li>
              Your budget chart and reports will update automatically as you add
              or update expenses.
            </li>
            <li>
              Use the filters to sort expenses by category, amount, name, or
              date.
              <br />
              <span className="italic">
                (Note: expenses without a selected date will not be affected by
                date filters — they will always appear at the bottom of the
                list.)
              </span>
            </li>
            <li>
              Click the “Reports” button to view a detailed breakdown of your
              spending and expenses.
            </li>
            <li>
              Use the Category Goals section to set spending goals for each
              expense type. Select a category and enter a spending limit for
              that category within your budget.
            </li>
            <li>
              To update your account credentials, click “Your Account” in the
              top right.
            </li>
          </ul>
          <p className="text-center font-semibold text-neutral mt-6">
            Happy budgeting!
          </p>
          <div className="flex justify-end pt-6">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-primary text-light font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
