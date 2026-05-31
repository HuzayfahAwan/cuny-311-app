// src/components/AdminLogin.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { FiLock, FiUser, FiEye, FiEyeOff, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import type { AuthInfo } from "../types";

const API = "http://localhost:3001";

interface AdminLoginProps {
  onLoginSuccess: (auth: AuthInfo) => void;
  onGoHome: () => void;
}

export default function AdminLogin({ onLoginSuccess, onGoHome }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      onLoginSuccess({
        token: data.token,
        username: data.admin.username,
        displayName: data.admin.displayName,
      });
    } catch {
      setError("Cannot connect to server. Make sure the API is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-white"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59,130,246,0.18) 0%, transparent 60%), #020617",
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 w-full max-w-md animate-fade-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <img
            src="/University_Name_Correct_Logo_Usage3.png"
            alt="CUNY"
            className="h-14 w-auto mx-auto mb-5"
          />
          <h1 className="text-3xl font-extrabold text-white mb-2">Admin Sign In</h1>
          <p className="text-slate-400 text-sm">
            Access the CUNY 311 management portal
          </p>
        </div>

        {/* Card */}
        <div className="card p-8 shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  className="input-dark pl-11"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="input-dark pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300 animate-fade-in">
                <FiAlertCircle className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base shadow-lg shadow-blue-500/20 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <FiLock />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        {/* Default credentials hint */}
        <div className="mt-5 rounded-xl border border-white/10 bg-slate-900/40 px-5 py-3.5 text-xs text-slate-500">
          <p className="font-semibold text-slate-400 mb-1">Development credentials</p>
          <div className="flex gap-6">
            <span>
              <span className="text-slate-500">user:</span>{" "}
              <code className="text-slate-300">admin</code>
            </span>
            <span>
              <span className="text-slate-500">pass:</span>{" "}
              <code className="text-slate-300">cuny311</code>
            </span>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <button
            onClick={onGoHome}
            className="btn-ghost text-sm text-slate-500 hover:text-slate-300"
          >
            <FiArrowLeft />
            Back to portal
          </button>
        </div>
      </div>
    </div>
  );
}
