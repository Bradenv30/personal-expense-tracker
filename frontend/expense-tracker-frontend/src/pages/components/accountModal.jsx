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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md text-white">
        <h2 className="text-2xl font-bold mb-4">My Account</h2>

        {/* Change Credentials */}
        <form onSubmit={handleUpdate} className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-300">
              Change Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">
              Change Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white text-sm font-semibold transition flex justify-center items-center h-10"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <svg
                className="animate-spin h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              "Update Credentials"
            )}
          </button>
        </form>

        {/* Logout + Delete */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleLogout}
            className="text-sm text-indigo-400 hover:underline"
          >
            Log Out
          </button>

          {!confirmingDelete ? (
            <button
              onClick={() => setConfirmingDelete(true)}
              className="text-sm text-red-500 hover:underline"
            >
              Delete Account
            </button>
          ) : (
            <button
              onClick={handleDelete}
              className="text-sm text-red-600 font-semibold hover:underline"
            >
              Confirm Delete
            </button>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
