"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function validate(): string | null {
    if (!password || !confirm) return "Both fields are required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password !== confirm) return "Passwords do not match";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      // Simulate request
      await new Promise((r) => setTimeout(r, 700));
      setStatus("Your password has been reset successfully.");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">Reset password</h1>
          <p className="text-slate-500 mt-2 text-sm">Enter a new password and confirm it.</p>
        </div>

        <div className="rounded-2xl bg-white/90 backdrop-blur-sm p-6 shadow-sm border border-slate-200/60">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm text-slate-700 mb-2">
                New password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-11 text-slate-700 placeholder-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 my-auto h-8 w-8 inline-flex items-center justify-center text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm text-slate-700 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-11 text-slate-700 placeholder-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute inset-y-0 right-3 my-auto h-8 w-8 inline-flex items-center justify-center text-slate-500 hover:text-slate-700"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {status && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {status}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 py-3.5 text-white text-sm font-medium shadow-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? "Saving..." : "Reset password"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            <Link href="/" className="text-slate-600 hover:text-slate-800">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
