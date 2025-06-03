import ExpenseList from "./components/expenseList";
import SummarySection from "./components/summary";
import TopBar from "./components/topBar";
import SidebarNav from "./components/sideBar";

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <SidebarNav />

      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-8 space-y-8">
          <SummarySection />
          <ExpenseList />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
