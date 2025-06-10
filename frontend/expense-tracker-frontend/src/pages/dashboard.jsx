import { useState, useEffect } from "react";
import { getAllExpenses } from "../api/expenses";
import ExpenseList from "./components/expenseList";
import SummarySection from "./components/summary";
import TopBar from "./components/topBar";
import SidebarNav from "./components/sideBar";
import AddExpenseForm from "./components/addExpenseForm";
import EditExpense from "./components/editExpense";

function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllExpenses();
        setExpenses(data);
      } catch (error) {
        console.log("Failed to fetch expense", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-950">
      <SidebarNav onAddClick={() => setShowForm(true)} />

      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-8 space-y-8">
          {showForm && (
            <AddExpenseForm
              onClose={() => setShowForm(false)}
              setExpenses={setExpenses}
            />
          )}

          {editingExpense && (
            <EditExpense
              expense={editingExpense}
              onClose={() => setEditingExpense(null)}
              setExpenses={setExpenses}
            />
          )}
          <SummarySection />
          <ExpenseList
            expenses={expenses}
            setEditingExpense={setEditingExpense}
          />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
