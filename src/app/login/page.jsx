// src/app/login/page.jsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, LogIn, UserPlus, Eye, EyeOff, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState("login"); // "login" | "register"

  // Login state
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register state
  const [regForm, setRegForm] = useState({ username: "", password: "", confirm: "" });
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) {
      setLoginError("Completează toate câmpurile");
      return;
    }
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginForm.username, password: loginForm.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Credențiale incorecte");
        setLoginLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } catch {
      setLoginError("Eroare de rețea. Încearcă din nou.");
    }
    setLoginLoading(false);
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!regForm.username || !regForm.password || !regForm.confirm) {
      setRegError("Completează toate câmpurile");
      return;
    }
    if (regForm.username.length < 3) {
      setRegError("Username-ul trebuie să aibă minim 3 caractere");
      return;
    }
    if (regForm.password.length < 6) {
      setRegError("Parola trebuie să aibă minim 6 caractere");
      return;
    }
    if (regForm.password !== regForm.confirm) {
      setRegError("Parolele nu coincid");
      return;
    }
    setRegLoading(true);
    setRegError("");
    setRegSuccess("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: regForm.username, password: regForm.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRegError(data.error || "Eroare la înregistrare");
        setRegLoading(false);
        return;
      }
      setRegSuccess("Cont creat cu succes! Te poți autentifica acum.");
      setRegForm({ username: "", password: "", confirm: "" });
      setTimeout(() => {
        setTab("login");
        setRegSuccess("");
      }, 2000);
    } catch {
      setRegError("Eroare de rețea. Încearcă din nou.");
    }
    setRegLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500/10 border border-teal-500/30 rounded-2xl mb-4">
            <Shield size={28} className="text-teal-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Stadion Mini-Fotbal</h1>
          <p className="text-gray-500 mt-1 text-sm">Panou de Administrare</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => { setTab("login"); setLoginError(""); }}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${
                tab === "login"
                  ? "text-teal-400 border-b-2 border-teal-400 bg-teal-500/5"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <LogIn size={15} />
                Autentificare
              </span>
            </button>
            <button
              onClick={() => { setTab("register"); setRegError(""); setRegSuccess(""); }}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${
                tab === "register"
                  ? "text-teal-400 border-b-2 border-teal-400 bg-teal-500/5"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <UserPlus size={15} />
                Înregistrare
              </span>
            </button>
          </div>

          <div className="p-8">
            {/* LOGIN FORM */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-5">
                {loginError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                    {loginError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Utilizator
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={loginForm.username}
                      onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))}
                      className="w-full bg-gray-800/60 border border-gray-700/50 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all placeholder:text-gray-600"
                      placeholder="admin"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Parolă
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type={showLoginPass ? "text" : "password"}
                      value={loginForm.password}
                      onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                      className="w-full bg-gray-800/60 border border-gray-700/50 text-white rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all placeholder:text-gray-600"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPass(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showLoginPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                >
                  {loginLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
                      Se autentifică...
                    </>
                  ) : (
                    <>
                      <LogIn size={16} />
                      Intră în sistem
                    </>
                  )}
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {tab === "register" && (
              <form onSubmit={handleRegister} className="space-y-5">
                {regError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                    {regError}
                  </div>
                )}
                {regSuccess && (
                  <div className="bg-teal-500/10 border border-teal-500/30 text-teal-400 px-4 py-3 rounded-xl text-sm">
                    {regSuccess}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Utilizator nou
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={regForm.username}
                      onChange={e => setRegForm(f => ({ ...f, username: e.target.value }))}
                      className="w-full bg-gray-800/60 border border-gray-700/50 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all placeholder:text-gray-600"
                      placeholder="numele_tau"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Parolă
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type={showRegPass ? "text" : "password"}
                      value={regForm.password}
                      onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
                      className="w-full bg-gray-800/60 border border-gray-700/50 text-white rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all placeholder:text-gray-600"
                      placeholder="minim 6 caractere"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPass(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showRegPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Confirmă parola
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type={showRegPass ? "text" : "password"}
                      value={regForm.confirm}
                      onChange={e => setRegForm(f => ({ ...f, confirm: e.target.value }))}
                      className="w-full bg-gray-800/60 border border-gray-700/50 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all placeholder:text-gray-600"
                      placeholder="repetă parola"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                >
                  {regLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
                      Se creează contul...
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Creează cont
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          © 2026 Oală Oleg Stadium · Panou Administrare
        </p>
      </div>
    </div>
  );
}
