export default function SidebarNav() {
  return (
    <aside className="w-64 bg-gray-900 text-white p-6 shadow-xl space-y-6">
      <h2 className="text-2xl font-semibold text-center">Expense Tracker</h2>

      <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 px-4 rounded-xl text-lg font-medium shadow transition">
        + Add Expense
      </button>

      <nav className="pt-6 border-t border-white/10 space-y-4">
        {/* Add any possible here */}
      </nav>
    </aside>
  );
}
