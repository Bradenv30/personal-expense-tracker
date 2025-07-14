export default function ResourcesModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-overlay backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-surface-white backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-[90%] max-w-3xl max-h-[95vh] overflow-y-auto">
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text text-center mb-6">
            Budgeting Resources
          </h2>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral hover:text-primary text-xl font-bold focus:outline-none"
            aria-label="Close"
          >
            ×
          </button>

          <p className="text-neutral text-sm md:text-base leading-relaxed">
            New to budgeting and not sure where to start? You're not alone —
            there are many opinions on how to budget, how much to save, and
            where to invest. At{" "}
            <span className="font-semibold">SimplySpent</span>, our goal is to
            make budgeting as simple and approachable as possible — whether
            you're just beginning or have years of experience.
            <br />
            <br />
            We recommend starting by calculating your{" "}
            <span className="font-semibold">after-tax income</span> so you know
            how much money you truly take home each paycheck (you can use the
            calculator linked below). From there, begin allocating money toward
            essential expenses like rent, food, schooling, transportation, and
            other necessities.
            <br />
            <br />
            Next, decide how much you'd like to set aside as untouchable
            savings, and how much you'd like to invest. It's always wise to
            maintain a safety net before investing anything leftover.
            <br />
            <br />
            To learn more about popular budgeting strategies and find one that
            fits your goals and lifestyle, check out the guides below:
          </p>

          <ul className="list-disc list-inside text-neutral space-y-3 text-sm md:text-base">
            <li>
              <a
                href="https://smartasset.com/taxes/income-taxes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                SmartAsset: After-Tax Income Calculator
              </a>
            </li>
            <li>
              <a
                href="https://www.financestrategists.com/financial-advisor/personal-finance/budgeting-methods/#conclusion"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Finance Strategists: Budgeting Methods Guide
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
