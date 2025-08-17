import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "adil" && password === "ameer") {
      alert("Login successful!");
      setError("");
      navigate("/admin-dashboard"); // Redirect to admin dashboard
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-96 border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          🔐 Admin Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-white/10 border border-white/30 text-white placeholder-gray-300 px-4 py-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/10 border border-white/30 text-white placeholder-gray-300 px-4 py-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        />

        {error && (
          <p className="text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-lg text-sm mb-4">
            {error}
          </p>
        )}

        <div className="flex justify-between gap-3">
          <button
            className="flex-1 px-4 py-2 rounded-lg bg-gray-500/20 text-white border border-white/30 hover:bg-gray-500/30 transition-colors"
            onClick={() => navigate("/")} // Redirect to home page
          >
            Cancel
          </button>

          <button
            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
