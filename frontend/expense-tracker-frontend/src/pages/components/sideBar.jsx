import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SidebarNav({ collapsed, onToggleCollapse }) {
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-xl z-20 transition-transform duration-300 w-64 ${
          collapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="p-6 flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Expense Tracker</h2>
            <button
              onClick={onToggleCollapse}
              className="text-indigo-400 hover:text-indigo-200 transition"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          <nav className="pt-6 border-t border-white/10 space-y-4 mt-6">
            {/* Optional nav links */}
          </nav>
        </div>
      </aside>

      {/* Floating Chevron Button (when collapsed) */}
      {collapsed && (
        <button
          onClick={onToggleCollapse}
          className="fixed top-1/2 left-0 z-30 transform -translate-y-1/2 translate-x-full bg-lightorange hover:orange-600 text-white rounded-r-lg p-2 shadow"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </>
  );
}
