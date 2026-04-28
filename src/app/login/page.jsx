// src/app/login/page.jsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    if (!form.username || !form.password) { setError("Completează toate câmpurile"); return; }
    setLoading(true); setError("");

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (!res.ok) { setError(data.error || 'Credențiale incorecte'); setLoading(false); return; }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
    } catch { setError('Eroare de rețea. Încearcă din nou.'); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-full mb-4">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">ADMINISTRATOR</h1>
          <p className="text-gray-400 mt-2">Stadion de Mini-Fotbal</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          <h2 className="text-white text-xl font-semibold mb-6 text-center">Autentificare</h2>

          {error && (
            <div className="bg-red-900/40 border border-red-700 text-red-300 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm block mb-1">Utilizator</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="admin"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 text-sm block mb-1">Parolă</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded font-semibold flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <LogIn size={18} />
              {loading ? 'Se autentifică...' : 'Intră în sistem'}
            </button>
          </form>

          <div className="mt-6 bg-gray-700/50 rounded p-3 text-xs text-gray-400">
            <p className="font-medium text-gray-300 mb-1">Credențiale implicite:</p>
            <p>Utilizator: <span className="text-teal-400">admin</span></p>
            <p>Parolă: <span className="text-teal-400">admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
