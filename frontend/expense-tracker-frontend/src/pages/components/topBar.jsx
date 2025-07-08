import { useState } from "react";

export default function TopBar({
  userName = "Guest",
  onAddClick,
  onAddBudgetClick,
  onAccountClick,
  onReportClick,
}) {
  const [avatarColor, setAvatarColor] = useState("#4F46E5");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const firstInitial = userName.charAt(0).toUpperCase();

  const handleColorChange = (color) => {
    setAvatarColor(color);
    setShowColorPicker(false);
  };

  const colorOptions = [
    "#4F46E5", // Indigo
    "#10B981", // Green
    "#EF4444", // Red
    "#F59E0B", // Amber
    "#3B82F6", // Blue
    "#8B5CF6", // Violet
  ];

  return (
    <header className="bg-midnightgreen shadow p-6">
      <div className="flex items-center justify-between w-full">
        {/* Left: Dashboard Title + Buttons */}
        <div className="flex items-center">
          <h1 className="text-3xl font-extrabold text-white">
            {userName}'s Dashboard
          </h1>

          {/* Add Buttons next to title with spacing */}
          <div className="flex items-center space-x-6 ml-8">
            <button
              onClick={onAddBudgetClick}
              className="bg-lightorange hover:bg-orange-600 text-white text-xl px-5 py-2.5 rounded-xl font-semibold shadow transition"
            >
              + Add Budget
            </button>
            <button
              onClick={onAddClick}
              className="bg-lightorange hover:bg-orange-600 text-white text-xl px-5 py-2.5 rounded-xl font-semibold shadow transition"
            >
              + Add Expense
            </button>

            <button
              onClick={onReportClick}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-5 py-2.5 rounded-xl font-semibold shadow transition"
            >
              Reports
            </button>
          </div>
        </div>

        {/* Right: Avatar + My Account */}
        <div className="flex items-center space-x-3 relative">
          <button
            onClick={onAccountClick}
            className="text-white underline text-base hover:text-indigo-300 transition"
          >
            My Account
          </button>

          {/* Avatar Circle */}
          <div className="relative">
            <div
              onClick={() => setShowColorPicker(!showColorPicker)}
              style={{ backgroundColor: avatarColor }}
              className="w-9 h-9 rounded-full cursor-pointer flex items-center justify-center text-white font-semibold shadow"
            >
              {firstInitial}
            </div>

            {showColorPicker && (
              <div className="absolute right-0 mt-2 bg-white p-2 rounded shadow z-50 flex gap-2">
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
