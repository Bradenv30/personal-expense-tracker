import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { getAllExpenses } from "../api/expenses";
import { getAllBudgets } from "../api/budget";
import ExpenseList from "./components/expenseList";
import SummarySection from "./components/summary";
import TopBar from "./components/topBar";
import SidebarNav from "./components/sideBar";
import AddExpenseForm from "./components/addExpenseForm";
import EditExpense from "./components/editExpense";
import AddBudgetForm from "./components/addBudgetForm";
import BudgetBox from "./components/budgetBox";
import EditBudget from "./components/editBudget";
import AccountModal from "./components/accountModal";
import ReportModal from "./components/reportModal";
import SubBudgets from "./components/subBudgets";

function Dashboard() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [budget, setBudget] = useState(null);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [budgets, setBudgets] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [sortName, setSortName] = useState("");
  const [sortDate, setSortDate] = useState("");
  const [sortType, setSortType] = useState("");
  const [sortAmount, setSortAmount] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (!decoded?.username) throw new Error("Invalid token payload");
      setUserName(decoded.username);
    } catch (e) {
      localStorage.removeItem("token");
      navigate("/", { replace: true });
    } finally {
      setIsCheckingToken(false);
    }
  }, [navigate]);

  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => window.history.go(1);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllExpenses();
        setExpenses(data);

        const allBudgets = await getAllBudgets();
        setBudgets(allBudgets);

        if (allBudgets.length > 0) {
          const savedId = localStorage.getItem("selectedBudgetId");
          const match = allBudgets.find((b) => b.id === Number(savedId));
          setBudget(match || allBudgets[0]);
        }
      } catch (e) {
        console.log("Failed to fetch expense", e);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (budgets.length > 0) {
      const savedId = localStorage.getItem("selectedBudgetId");
      const match = budgets.find((b) => b.id === Number(savedId));
      setBudget(match || budgets[0]);
    }
  }, [budgets]);

  let filteredExpenses = budget
    ? expenses.filter((e) => Number(e.budget_id) === Number(budget.id))
    : [];

  if (sortType) {
    filteredExpenses = filteredExpenses.filter(
      (e) => e.type && e.type.toLowerCase() === sortType.toLowerCase()
    );
  }

  if (sortName === "name-asc") {
    filteredExpenses.sort((a, b) => a.name?.localeCompare(b.name));
  } else if (sortName === "name-desc") {
    filteredExpenses.sort((a, b) => b.name?.localeCompare(a.name));
  }

  if (sortDate === "date-newest") {
    filteredExpenses.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date) - new Date(a.date);
    });
  } else if (sortDate === "date-oldest") {
    filteredExpenses.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date) - new Date(b.date);
    });
  }

  if (sortAmount === "amount-lowest") {
    filteredExpenses.sort(
      (a, b) => parseFloat(a.amount) - parseFloat(b.amount)
    );
  } else if (sortAmount === "amount-highest") {
    filteredExpenses.sort(
      (a, b) => parseFloat(b.amount) - parseFloat(a.amount)
    );
  }

  const handleBudgetChange = (e) => {
    const selectedId = Number(e.target.value);
    const selected = budgets.find((b) => b.id === selectedId);
    if (selected) {
      setBudget(selected);
      localStorage.setItem("selectedBudgetId", selected.id);
    }
  };

  useEffect(() => {
    setSortName("");
    setSortDate("");
    setSortType("");
    setSortAmount("");
  }, [budget]);

  if (isCheckingToken) {
    return <div className="text-white p-8">Loading...</div>; // or null
  }

  return (
    <>
      <div className="flex h-screen bg-darkice overflow-hidden relative">
        <SidebarNav
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar
            userName={userName}
            onAddClick={() => {
              if (budget?.is_active) {
                setShowForm(true);
              } else {
                setErrorMessage(
                  "This budget is inactive. You cannot add expenses to it."
                );

                // Auto-clear after 3 seconds
                setTimeout(() => setErrorMessage(""), 3000);
              }
            }}
            onAddBudgetClick={() => setShowBudgetForm(true)}
            onAccountClick={() => setShowAccountModal(true)}
            onReportClick={() => setShowReportModal(true)}
          />
          {errorMessage && (
            <div className="bg-red-600 text-white px-4 py-2 text-sm text-center shadow">
              {errorMessage}
            </div>
          )}
          <main
            className={`flex flex-row flex-1 gap-5 p-4 overflow-hidden transition-all duration-300 ${
              collapsed ? "ml-0" : "ml-64"
            }`}
          >
            {/* Left Column - Budget Panel */}
            <div className="flex flex-col w-[520px] bg-pastelgray p-6 rounded-md">
              {budgets.length > 0 && (
                <div className="mb-1">
                  <label
                    htmlFor="budget-select"
                    className="block text-sm text-black mb-1 font-[Verdana]"
                  >
                    Viewing:
                  </label>
                  <select
                    id="budget-select"
                    value={budget?.id || ""}
                    onChange={handleBudgetChange}
                    className="w-full bg-vanillaice text-black text-sm px-3 py-2 rounded-lg font-[Verdana] shadow-sm focus:outline-none focus:ring-2 transition"
                  >
                    {budgets.map((b, index) => (
                      <option
                        key={b.id}
                        value={b.id}
                        className="bg-gray-800 text-white"
                      >
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {showBudgetForm && (
                <AddBudgetForm
                  onClose={() => setShowBudgetForm(false)}
                  setBudget={setBudget}
                  setBudgets={setBudgets}
                  budgets={budgets}
                />
              )}

              {editingBudget && budget && (
                <EditBudget
                  budget={budget}
                  onClose={() => setEditingBudget(false)}
                  setBudget={setBudget}
                  setBudgets={setBudgets}
                />
              )}

              <BudgetBox
                budget={budget}
                expenses={filteredExpenses}
                onEdit={() => setEditingBudget(true)}
              />
            </div>

            {/* Right Column - Scrollable Expenses */}
            <div className="flex-1 flex flex-col gap-3 h-full rounded-md overflow-hidden">
              {showForm && budget && budget.is_active && (
                <AddExpenseForm
                  onClose={() => setShowForm(false)}
                  setExpenses={setExpenses}
                  budgetID={budget}
                />
              )}

              {editingExpense && (
                <EditExpense
                  expense={editingExpense}
                  onClose={() => setEditingExpense(null)}
                  setExpenses={setExpenses}
                />
              )}

              {/*  Filter expenses by selected budget */}
              <div className="flex-1 min-h-[430px] overflow-y-auto">
                <ExpenseList
                  expenses={filteredExpenses}
                  allExpenses={expenses.filter(
                    (e) => Number(e.budget_id) === Number(budget?.id)
                  )}
                  setEditingExpense={setEditingExpense}
                  sortName={sortName}
                  setSortName={setSortName}
                  sortDate={sortDate}
                  setSortDate={setSortDate}
                  sortType={sortType}
                  setSortType={setSortType}
                  sortAmount={sortAmount}
                  setSortAmount={setSortAmount}
                />
              </div>

              <div className="bg-pastelgray rounded-md max-h-[300px] overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  <SubBudgets expenses={expenses} budget={budget} />
                </div>
              </div>

              {showAccountModal && (
                <AccountModal
                  onClose={() => setShowAccountModal(false)}
                  setUserName={setUserName}
                  setSuccessMessage={setSuccessMessage}
                  setUpdateError={setUpdateError}
                  userName={userName}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          budget={budget}
          expenses={filteredExpenses}
        />
      )}

      {/* Success message at bottom of screen */}
      {successMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-semibold transition-opacity duration-300">
            {successMessage}
          </div>
        </div>
      )}
      {updateError && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-semibold transition-opacity duration-300">
            {updateError}
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
