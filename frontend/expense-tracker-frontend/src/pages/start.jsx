import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import simplySpent from "../assets/SimplySpentLogo.svg";
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
    <div className="min-h-screen flex items-center justify-center bg-amber-50 bg-cover bg-center bg-fixed w-full overflow-hidden">
      <img
        src={simplySpent}
        alt="SimplySpent Logo"
        className="absolute -top-24 left-12 w-[28rem] h-[28rem] md:w-[32rem] md:h-[32rem] opacity-90"
      />

      {/* main landing card - keeps things contained and clean, responsive width for card */}

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full md:w-[50%] lg:w-[500px] mx-4">
        {/* welcome screen - show when no auth form is active */}
        {!showLogin && !showRegister && (
          <div className="text-center space-y-6">
            <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
              Track your spending. Simplify your budget. Stay in control.
            </p>

            <div className="flex flex-col space-y-3">
              <button
                onClick={() => setShowLogin(true)}
                className="w-full bg-primary hover:bg-primary-dark active:scale-95 hover:scale-105 transform transition duration-200 text-white font-bold py-3 rounded-full shadow-lg"
              >
                LOGIN
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="w-full bg-primary hover:bg-primary-dark active:scale-95 hover:scale-105 transform transition duration-200 text-white font-bold py-3 rounded-full shadow-lg"
              >
                REGISTER
              </button>
            </div>
          </div>
        )}

        {/* login/register form - show when auth form is active */}
        {(showLogin || showRegister) && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text text-center mb-3">
              {showLogin ? "Welcome Back" : "Join SimplySpent"}
            </h2>
            <form
              onSubmit={showLogin ? handleLogin : handleRegister}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              {/* only show confirm password for registration */}
              {!showLogin && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {/* form actions - cancel vs submit */}
              <div className="flex flex-col justify-between items-center">
                <button
                  type="submit"
                  className={`w-full bg-primary hover:bg-primary-dark active:scale-95 transform transition duration-200 text-white font-bold py-3 rounded-full shadow-lg flex items-center justify-center ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {/* spinner animation when loading */}
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
                <button
                  type="button"
                  onClick={resetForms}
                  className="cursor-pointer text-sm text-gray-600 mt-2 hover:text-blue-800 hover:underline"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Start;
