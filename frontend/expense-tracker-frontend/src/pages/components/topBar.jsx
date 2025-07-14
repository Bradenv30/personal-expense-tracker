import { useState } from "react";

export default function TopBar({
  userName = "Guest",
  onAddClick,
  onAddBudgetClick,
  onAccountClick,
  onReportClick,
  isReportsDisabled = false,
}) {
  const [avatarColor, setAvatarColor] = useState("#6366F1");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const firstInitial = userName.charAt(0).toUpperCase();

  const handleColorChange = (color) => {
    setAvatarColor(color);
    setShowColorPicker(false);
  };

  const colorOptions = [
    "#6366F1", // Primary
    "#10B981", // Success
    "#EF4444", // Error
    "#F59E0B", // Warning
    "#84CC16", // Accent
    "#8B5CF6", // Purple
  ];

  return (
    <header className="bg-surface-white backdrop-blur-sm shadow-2xl p-6">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <h1 className="text-3xl font-extrabold bg-secondary/80 text-transparent bg-clip-text">
            {userName}'s Dashboard
          </h1>

          <div className="flex items-center space-x-6 ml-12">
            <button
              onClick={onAddBudgetClick}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 active:scale-95 transform transition duration-200 text-white text-lg px-5 py-2.5 rounded-xl font-semibold shadow-lg"
            >
              + Add Budget
            </button>
            <button
              onClick={onAddClick}
              className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 active:scale-95 transform transition duration-200 text-white text-lg px-5 py-2.5 rounded-xl font-semibold shadow-lg"
            >
              + Add Expense
            </button>

            <button
              onClick={onReportClick}
              disabled={isReportsDisabled}
              className={`text-lg px-5 py-2.5 rounded-xl font-semibold shadow-lg transition duration-200 ${
                isReportsDisabled
                  ? "bg-neutral-light/50 text-neutral/50 cursor-not-allowed"
                  : "bg-secondary/80 hover:bg-secondary/60 active:scale-95 transform text-white"
              }`}
            >
              Budget Report
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3 relative">
          <button
            onClick={onAccountClick}
            className="text-neutral underline text-base hover:text-primary transition duration-200"
          >
            My Account
          </button>

          <div className="relative">
            <div
              onClick={() => setShowColorPicker(!showColorPicker)}
              style={{ backgroundColor: avatarColor }}
              className="w-9 h-9 rounded-full cursor-pointer flex items-center justify-center text-white font-semibold shadow"
            >
              {firstInitial}
            </div>

            {showColorPicker && (
              <div className="absolute right-0 mt-2 bg-surface-white p-2 rounded shadow z-50 flex gap-2">
                {colorOptions.map((color) => (
                  <div
                    key={color}
                    onClick={() => {
                      setAvatarColor(color);
                      setShowColorPicker(false);
                    }}
                    className="w-6 h-6 rounded-full cursor-pointer border hover:scale-110 transition"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
