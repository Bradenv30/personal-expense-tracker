import { useState, useEffect } from "react";
import { updateAccount, deleteAccount } from "../../api/auth";
import { jwtDecode } from "jwt-decode";

export default function AccountModal({
  onClose,
  setUserName,
  setSuccessMessage,
  setUpdateError,
  userName,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (userName) {
      setUsername(userName);
    }
  }, [userName]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const payload = {};
      if (username.trim()) payload.username = username.trim();
      if (password.trim()) payload.password = password.trim();

      if (Object.keys(payload).length === 0) return;

      if (password && password !== confirmPassword) {
        setUpdateError("Passwords do not match.");
        setTimeout(() => setUpdateError(""), 3000);
        setIsUpdating(false);
        return;
      }

      const res = await updateAccount(payload);
      if (res.token) {
        localStorage.setItem("token", res.token);
        const decoded = jwtDecode(res.token);
        setUserName(decoded.username);
      }
      setSuccessMessage("Account successfully updated!");
      setTimeout(() => setSuccessMessage(""), 2000);
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Update failed:", err);
      setUpdateError("Account update failed. Username already exists");
      setTimeout(() => setUpdateError(""), 2000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccount();
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (e) {
      console.error("Failed to delete account", e);
      setUpdateError("Account deletion failed.");
      setTimeout(() => setUpdateError(""), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedBudgetId");
    window.location.href = "/";
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text text-center mb-6">My Account</h2>

        {/* Change Credentials */}
        <form onSubmit={handleUpdate} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-neutral mb-2">
              Change Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral mb-2">
              Change Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-primary hover:bg-primary-dark active:scale-95 transform transition duration-200 text-white font-bold py-3 rounded-full shadow-lg flex justify-center items-center ${
              isUpdating ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Updating...</span>
              </div>
            ) : (
              "Update Account"
            )}
          </button>
        </form>

        {/* Logout + Delete */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleLogout}
            className="text-sm text-secondary hover:text-secondary-light transition duration-200 underline"
          >
            Log Out
          </button>

          {!confirmingDelete ? (
            <button
              onClick={() => setConfirmingDelete(true)}
              className="text-sm text-error hover:text-red-700 transition duration-200 underline"
            >
              Delete Account
            </button>
          ) : (
            <button
              onClick={handleDelete}
              className="text-sm text-error font-semibold hover:text-red-700 transition duration-200 underline"
            >
              Confirm Delete
            </button>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="text-sm text-neutral hover:text-neutral-light transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
