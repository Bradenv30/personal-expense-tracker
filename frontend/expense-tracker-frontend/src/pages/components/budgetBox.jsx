import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function BudgetBox({ budget, expenses = [], onEdit }) {
  if (!budget) {
    return (
      <div className="h-[400px] w-full text-neutral flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
            No Budget Yet
          </h2>
          <p className="text-base text-neutral">
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
    <div className="w-full h-[600px] p-6 flex flex-col">
      <div className="flex flex-col space-y-6">
        <div className="mb-7">
          <h2 className="text-3xl font-extrabold truncate bg-secondary/80 text-transparent bg-clip-text">
            {budget.name || "Current Budget"}
          </h2>
          <p className="text-neutral text-base mt-3">
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
          </p>
          <p className="text-neutral text-base mt-1">
            Status:{" "}
            <span
              className={
                budget.is_active
                  ? "text-success font-semibold"
                  : "text-error font-semibold"
              }
            >
              {budget.is_active ? "Active" : "Inactive"}
            </span>
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div style={{ width: "280px", height: "250px" }}>
            <CircularProgressbar
              value={animatedPercentage}
              text={`$${formatCurrency(totalSpent)} / $${formatCurrency(
                budget.amount
              )}`}
              styles={buildStyles({
                textColor: "oklch(0.6825 0.0234 46.87)",
                pathColor:
                  usedPercentage > 100
                    ? "oklch(0.6000 0.2000 20.00)"
                    : "oklch(0.7665 0.1387 91.06)",
                trailColor: "oklch(0.9137 0.0273 223.24)",
                textSize: "6px",
              })}
              className="font-bold"
            />
          </div>
        </div>

        <div className="pt-13 flex flex-col items-center space-y-2">
          <p className="text-2xl pb-1 font-semibold text-neutral text-center">
            Budget Limit: ${formatCurrency(budget.amount)}
          </p>
          <button
            className="px-6 py-3 text-sm bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            onClick={onEdit}
          >
            Edit Budget
          </button>
        </div>
      </div>
    </div>
  );
}
