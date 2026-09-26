"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@mpgi.edu.in");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-900 to-slate-900 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-xl bg-brand-600 text-white flex items-center justify-center text-2xl font-bold mb-3">
            M
          </div>
          <h1 className="text-2xl font-bold text-slate-900">MPGI ERP Login</h1>
          <p className="text-sm text-slate-500 mt-1">Intelligent Institute Automation System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
          <p className="font-medium text-slate-800">Demo credentials:</p>
          <p>Admin: admin@mpgi.edu.in / admin123</p>
          <p>Principal: principal@mpec.mpgi.edu.in / principal123</p>
          <p>Student: student@mpgi.edu.in / student123</p>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/" className="text-brand-600 hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
