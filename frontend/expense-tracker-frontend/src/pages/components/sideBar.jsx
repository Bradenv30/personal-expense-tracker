import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SidebarNav({ collapsed, onToggleCollapse }) {
  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-full bg-surface-white backdrop-blur-sm text-neutral shadow-2xl z-20 transition-transform duration-300 w-64 ${
          collapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="p-6 flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">SimplySpent</h2>
            <button
              onClick={onToggleCollapse}
              className="text-primary hover:text-primary/80 transition duration-200"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          <nav className="pt-6 border-t border-neutral-light space-y-4 mt-6">
          </nav>
        </div>
      </aside>

      {collapsed && (
        <button
          onClick={onToggleCollapse}
          className="fixed top-1/2 left-0 z-30 transform -translate-y-1/2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 active:scale-95 transition duration-200 text-light rounded-r-xl p-2 shadow-lg"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </>
  );
}
