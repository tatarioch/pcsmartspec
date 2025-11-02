"use client";
import Link from "next/link";
import { useState } from "react";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      if (!email) throw new Error("Email is required");
      // TODO: Integrate with backend endpoint to send reset link
      await new Promise((r) => setTimeout(r, 600));
      setStatus("If an account exists for this email, a reset link has been sent.");
    } catch (err: any) {
      setStatus(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">Forgot password</h1>
          <p className="text-slate-500 mt-2 text-sm">Enter your email to receive a reset link.</p>
        </div>

        <div className="rounded-2xl bg-white/90 backdrop-blur-sm p-6 shadow-sm border border-slate-200/60">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm text-slate-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 placeholder-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none transition-all duration-200"
              />
            </div>

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
              {loading ? "Sending..." : "Send reset link"}
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
