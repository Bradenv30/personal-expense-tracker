import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/image.svg";
import { userLogin, userRegister } from "../api/auth";

function Start() {
  const navigate = useNavigate();

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await userLogin({ username, password });
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await userRegister({ username, password });
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setShowLogin(false);
    setShowRegister(false);
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="text-white text-center p-8 space-y-4">
        <p className="text-xl font-extrabold">
          Track your spending. Simplify your budget. Stay in control.
        </p>
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={() => setShowLogin(true)}
            className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-3 rounded-full transition mt-6"
          >
            LOGIN
          </button>
          <button
            onClick={() => setShowRegister(true)}
            className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-3 rounded-full transition mt-4"
          >
            REGISTER
          </button>
        </div>
      </div>

      {(showLogin || showRegister) && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-pastelgray p-6 rounded-xl shadow-xl space-y-4 w-80">
            <h2 className="text-2xl font-bold text-midnightgreen">
              {showLogin ? "Login" : "Register"}
            </h2>
            <form
              onSubmit={showLogin ? handleLogin : handleRegister}
              className="space-y-3 "
            >
              <input
                type="text"
                placeholder="Username"
                className="text-midnightgreen w-full px-3 py-2 border rounded focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="text-midnightgreen w-full px-3 py-2 border rounded focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              {!showLogin && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="text-midnightgreen w-full px-3 py-2 border rounded"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={resetForms}
                  className="cursor-pointer text-sm text-gray-600 underline"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-midnightgreen text-white px-4 py-2 rounded hover : cursor-pointer bg-blue-700 flex items-center justify-center ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Loading...</span>
                    </div>
                  ) : showLogin ? (
                    "Login"
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Start;
