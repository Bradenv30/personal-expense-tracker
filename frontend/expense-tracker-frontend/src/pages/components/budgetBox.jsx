import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function BudgetBox({ budget, expenses = [], onEdit }) {
  if (!budget) {
    return (
      <div className="h-[400px] w-full bg-pastelgray text-white flex items-center justify-center rounded-lg shadow-inner">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">No Budget Yet</h2>
          <p className="text-base text-gray-300">
            Add a budget to begin tracking your expenses.
          </p>
        </div>
      </div>
    );
  }

  const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const usedPercentage = budget.amount ? (totalSpent / budget.amount) * 100 : 0;
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  const formatCurrency = (value) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: num % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  useEffect(() => {
    let frame;
    const duration = 100;
    const start = performance.now();

    function animate(time) {
      const progress = Math.min((time - start) / duration, 1);
      setAnimatedPercentage(progress * usedPercentage);
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [usedPercentage]);

  console.log("start_date:", budget.start_date);
  console.log("end_date:", budget.end_date);

  const formatDate = (str) => {
    if (!str) return "N/A";
    const [year, month, day] = str.split("-");
    return `${Number(month)}/${Number(day)}/${year}`;
  };

  return (
    <div className="w-full h-[600px] bg-pastelgray p-6 flex flex-col text-white">
      <div className="flex flex-col space-y-6">
        {/* Top section */}
        <div className="mb-10">
          <h2 className="text-black text-3xl font-extrabold truncate">
            {budget.name || "Current Budget"}
          </h2>
          {budget.start_date && budget.end_date ? (
            <>
              Budget Date Range: {formatDate(budget.start_date)} –{" "}
              {formatDate(budget.end_date)}
            </>
          ) : budget.start_date ? (
            <>Budget Date Range: Starts {formatDate(budget.start_date)}</>
          ) : budget.end_date ? (
            <>Budget Date Range: Ends {formatDate(budget.end_date)}</>
          ) : (
            <>Budget Date Range: N/A</>
          )}
          <p className="text-black text-base mt-1">
            Status:{" "}
            <span
              className={budget.is_active ? "text-green-400" : "text-red-400"}
            >
              {budget.is_active ? "Active" : "Inactive"}
            </span>
          </p>
        </div>

        {/* Middle section: Chart + limit */}
        <div className="flex flex-col items-center space-y-4">
          <div style={{ width: "280px", height: "250px" }}>
            <CircularProgressbar
              value={animatedPercentage}
              text={`$${formatCurrency(totalSpent)} / $${formatCurrency(
                budget.amount
              )}`}
              styles={buildStyles({
                textColor: "#000000",
                pathColor: usedPercentage > 100 ? "#dc2626" : "#b77505",
                trailColor: "#d0e7f0",
                textSize: "6px",
              })}
              className="font-bold"
            />
          </div>
        </div>

        {/* Bottom section: Button */}
        <div className="pt-4 flex flex-col items-center space-y-2 pt-18">
          <p className="text-2xl pb-1 font-semibold text-black text-center">
            Budget Limit: ${formatCurrency(budget.amount)}
          </p>
          <button
            className="px-6 py-3 text-sm bg-lightorange hover:bg-orange-600 text-white rounded-md font-semibold shadow transition"
            onClick={onEdit}
          >
            Edit Budget
          </button>
        </div>
      </div>
    </div>
  );
}
