import backgroundImage from "../assets/background.png";
import { useNavigate } from "react-router-dom";

function Start() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="text-black text-center p-8 space-y-3">
        <h1 className="text-6xl font-extrabold">Expense Tracker</h1>
        <p className="text-5x1">
          Track your spending. Simplify your budget. Stay in control.
        </p>
        <p
          className="text-base underline cursor-pointer hover:text-gray-700 transition"
          onClick={() => navigate("/dashboard")}
        >
          Click here to get started
        </p>
      </div>
    </div>
  );
}

export default Start;
