// src/app/raport/page.jsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line,
} from "recharts";

const CATEGORIES_INCOME = [
  { value: "chirie_teren", label: "Chirie Teren" },
  { value: "achitare_datorie", label: "Achitare Datorie" },
  { value: "altele", label: "Altele" },
];
const CATEGORIES_EXPENSE = [
  { value: "salariu", label: "Salariu Personal" },
  { value: "electricitate", label: "Electricitate" },
  { value: "mentenanta", label: "Mentenanță Gazon" },
  { value: "curatenie", label: "Curățenie" },
  { value: "reparatii", label: "Reparații" },
  { value: "achizitii", label: "Achiziții / Cumpărături" },
  { value: "imprumut", label: "Împrumut" },
  { value: "altele", label: "Altele" },
];
function catLabel(cat) {
  return [...CATEGORIES_INCOME, ...CATEGORIES_EXPENSE].find(c => c.value === cat)?.label || cat;
}
function fmtMoney(n) {
  return (Number(n) || 0).toLocaleString("ro-MD", { minimumFractionDigits: 2 });
}
function fmtDate(s) {
  if (!s) return "—";
  try { return new Date(s + (s.length === 10 ? "T00:00:00" : "")).toLocaleDateString("ro-MD", { day: "2-digit", month: "2-digit", year: "numeric" }); } catch { return s; }
}

const PIE_COLORS = ["#14b8a6","#3b82f6","#f59e0b","#ef4444","#8b5cf6","#10b981","#f97316","#6366f1"];

export default function RaportPage() {
  const [loading, setLoading] = useState(true);
  const [finances, setFinances] = useState({ transactions: [], summary: { income: 0, expense: 0, balance: 0 } });
  const [teams, setTeams] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loansSummary, setLoansSummary] = useState({ totalAmount: 0, totalRestituit: 0, totalRamas: 0 });
  const [physicalCash, setPhysicalCash] = useState(null);
  const [totalDebt, setTotalDebt] = useState(0);
  const [generatedAt] = useState(new Date());

  function getHeaders() {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
    return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  }

  useEffect(() => {
    const BILLS_LIST = [1000, 500, 200, 100, 50, 20, 10, 5, 1];
    const COINS_LIST = [10, 5, 2, 1];
    Promise.all([
      fetch("/api/finances", { headers: getHeaders() }).then(r => r.json()),
      fetch("/api/teams", { headers: getHeaders() }).then(r => r.json()),
      fetch("/api/loans", { headers: getHeaders() }).then(r => r.json()),
      fetch("/api/finances/cash-calculator", { headers: getHeaders() }).then(r => r.json()),
      fetch("/api/debts", { headers: getHeaders() }).then(r => r.json()),
    ]).then(([fin, tm, ln, calc, debt]) => {
      setFinances(fin);
      setTeams(Array.isArray(tm) ? tm : []);
      setLoans(ln.loans || []);
      setLoansSummary(ln.summary || { totalAmount: 0, totalRestituit: 0, totalRamas: 0 });
      const b = calc.bills || {};
      const c = calc.coins || {};
      const total = BILLS_LIST.reduce((s, bill) => s + bill * (Number(b[bill]) || 0), 0)
                  + COINS_LIST.reduce((s, coin) => s + coin * (Number(c[coin]) || 0), 0);
      setPhysicalCash(total);
      setTotalDebt(debt.totalDebt || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // ── derived data ────────────────────────────────────────────────────────────
  const transactions = finances.transactions || [];
  const income = transactions.filter(t => t.type === "income").sort((a, b) => b.date?.localeCompare(a.date));
  const expense = transactions.filter(t => t.type === "expense").sort((a, b) => b.date?.localeCompare(a.date));
  const all = [...transactions].sort((a, b) => b.date?.localeCompare(a.date));

  // monthly grouped data
  const monthMap = {};
  transactions.forEach(t => {
    const m = (t.date || "").slice(0, 7); // YYYY-MM
    if (!m) return;
    if (!monthMap[m]) monthMap[m] = { month: m, income: 0, expense: 0 };
    if (t.type === "income") monthMap[m].income += t.amount;
    else monthMap[m].expense += t.amount;
  });
  const monthlyData = Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month)).map(m => ({
    ...m,
    label: new Date(m.month + "-01").toLocaleDateString("ro-MD", { month: "short", year: "2-digit" }),
  }));

  // income by category
  const incCatMap = {};
  income.forEach(t => {
    const key = catLabel(t.category);
    incCatMap[key] = (incCatMap[key] || 0) + t.amount;
  });
  const incCatData = Object.entries(incCatMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // expense by category
  const expCatMap = {};
  expense.forEach(t => {
    const key = catLabel(t.category);
    expCatMap[key] = (expCatMap[key] || 0) + t.amount;
  });
  const expCatData = Object.entries(expCatMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // top teams by income
  const teamsIncome = [...teams].sort((a, b) => (b.totalIncome || 0) - (a.totalIncome || 0)).slice(0, 10);

  const adjustedExpected = finances.summary.balance - loansSummary.totalRamas;
  const diff = physicalCash !== null ? physicalCash - adjustedExpected : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-lg">Se pregătește raportul complet...</p>
          <p className="text-sm mt-2 text-gray-500">Se încarcă toate datele din baza de date</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Print CSS — injected inline so it works without a separate stylesheet */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; font-size: 11px; }
          .no-print { display: none !important; }
          .print-page { break-after: page; }
          .print-avoid-break { break-inside: avoid; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ccc; padding: 4px 6px; }
          th { background: #f3f4f6 !important; color: black !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .sidebar, nav, header, footer { display: none !important; }
          .raport-root { margin: 0 !important; padding: 0 !important; }
        }
        @page { size: A4; margin: 15mm; }
      `}</style>

      <div className="raport-root space-y-8 max-w-5xl mx-auto pb-16">

        {/* ── TOP TOOLBAR (no-print) ─────────────────────────────────────────── */}
        <div className="no-print flex flex-wrap items-center justify-between gap-4 bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div>
            <h1 className="text-xl font-bold text-white">📄 Raport Financiar Complet</h1>
            <p className="text-gray-400 text-sm">Stadion Oală Oleg — {generatedAt.toLocaleDateString("ro-MD", { day: "2-digit", month: "long", year: "numeric" })}</p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-sm transition-colors shadow-lg"
          >
            🖨️ Exportă PDF / Printează
          </button>
        </div>

        {/* ── REPORT HEADER (visible in print) ──────────────────────────────── */}
        <div className="print-avoid-break text-center border-b-2 border-gray-600 pb-6">
          <h1 className="text-3xl font-bold text-white print:text-black">RAPORT FINANCIAR</h1>
          <h2 className="text-xl text-teal-400 print:text-gray-700 mt-1">Stadion Oală Oleg</h2>
          <p className="text-gray-400 print:text-gray-600 mt-2 text-sm">
            Generat la: {generatedAt.toLocaleDateString("ro-MD", { day: "2-digit", month: "long", year: "numeric" })} ora {generatedAt.toLocaleTimeString("ro-MD", { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="text-gray-500 print:text-gray-500 text-xs mt-1">
            Raport complet: {all.length} tranzacții · {teams.length} echipe · {loans.length} împrumuturi
          </p>
        </div>

        {/* ── 1. SUMAR GENERAL ──────────────────────────────────────────────── */}
        <section className="print-avoid-break">
          <h2 className="text-lg font-bold text-teal-400 print:text-black border-b border-gray-700 print:border-gray-400 pb-2 mb-4">1. SUMAR GENERAL</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Încasări", value: fmtMoney(finances.summary.income) + " lei", color: "text-green-400" },
              { label: "Total Cheltuieli", value: fmtMoney(finances.summary.expense) + " lei", color: "text-red-400" },
              { label: "Balanță Contabilă", value: fmtMoney(finances.summary.balance) + " lei", color: finances.summary.balance >= 0 ? "text-teal-400" : "text-red-400" },
              { label: "Bani Fizici în Casă", value: physicalCash !== null ? fmtMoney(physicalCash) + " lei" : "—", color: "text-teal-300" },
              { label: "Împrumuturi Neachitate", value: fmtMoney(loansSummary.totalRamas) + " lei", color: "text-amber-400" },
              { label: "Datorii Echipe", value: fmtMoney(totalDebt) + " lei", color: "text-orange-400" },
            ].map(item => (
              <div key={item.label} className="bg-gray-800 print:bg-gray-100 rounded-lg p-4 border border-gray-700 print:border-gray-300">
                <p className="text-gray-400 print:text-gray-600 text-xs uppercase tracking-wide mb-1">{item.label}</p>
                <p className={`text-xl font-bold ${item.color} print:text-black`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Verification row */}
          {physicalCash !== null && (
            <div className={`mt-4 rounded-lg p-4 border ${Math.abs(diff) < 1 ? "bg-green-900/25 border-green-700 print:border-green-500" : diff > 0 ? "bg-blue-900/25 border-blue-700" : "bg-red-900/25 border-red-700"}`}>
              <p className={`font-bold ${Math.abs(diff) < 1 ? "text-green-300" : diff > 0 ? "text-blue-300" : "text-red-300"} print:text-black`}>
                {Math.abs(diff) < 1
                  ? "✅ VERIFICARE OK — Banii fizici corespund cu evidența"
                  : diff > 0
                    ? `🔵 Fizic ai cu ${fmtMoney(diff)} lei MAI MULT decât trebuie`
                    : `❌ Fizic LIPSESC ${fmtMoney(Math.abs(diff))} lei față de evidență`}
              </p>
              <p className="text-gray-400 print:text-gray-600 text-sm mt-1">
                Fizic ({fmtMoney(physicalCash)} lei) vs. Așteptat ({fmtMoney(finances.summary.balance)} − {fmtMoney(loansSummary.totalRamas)} = {fmtMoney(adjustedExpected)} lei)
              </p>
            </div>
          )}
        </section>

        {/* ── 2. EVOLUȚIE LUNARĂ (chart + table) ───────────────────────────── */}
        <section className="print-avoid-break print-page">
          <h2 className="text-lg font-bold text-teal-400 print:text-black border-b border-gray-700 print:border-gray-400 pb-2 mb-4">2. EVOLUȚIE LUNARĂ</h2>
          {monthlyData.length > 0 ? (
            <>
              <div style={{ height: 260 }} className="mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                    <Tooltip formatter={v => [`${fmtMoney(v)} lei`]} contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#d1d5db" }} />
                    <Legend wrapperStyle={{ color: "#9ca3af" }} />
                    <Bar dataKey="income" name="Încasări" fill="#14b8a6" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="expense" name="Cheltuieli" fill="#ef4444" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <table className="w-full text-sm bg-gray-800 print:bg-white rounded-lg overflow-hidden border border-gray-700 print:border-gray-300">
                <thead>
                  <tr className="bg-gray-750 print:bg-gray-200">
                    <th className="text-left px-4 py-2 text-gray-300 print:text-black font-semibold">Lună</th>
                    <th className="text-right px-4 py-2 text-green-400 print:text-black font-semibold">Încasări (lei)</th>
                    <th className="text-right px-4 py-2 text-red-400 print:text-black font-semibold">Cheltuieli (lei)</th>
                    <th className="text-right px-4 py-2 text-teal-400 print:text-black font-semibold">Balanță (lei)</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((m, i) => {
                    const bal = m.income - m.expense;
                    return (
                      <tr key={m.month} className={`border-t border-gray-700 print:border-gray-300 ${i % 2 === 0 ? "" : "bg-gray-750/40"}`}>
                        <td className="px-4 py-2 text-gray-200 print:text-black">{m.label}</td>
                        <td className="px-4 py-2 text-right font-mono text-green-400 print:text-black">{fmtMoney(m.income)}</td>
                        <td className="px-4 py-2 text-right font-mono text-red-400 print:text-black">{fmtMoney(m.expense)}</td>
                        <td className={`px-4 py-2 text-right font-mono font-bold ${bal >= 0 ? "text-teal-400" : "text-red-400"} print:text-black`}>{fmtMoney(bal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-600 print:border-gray-400 font-bold">
                    <td className="px-4 py-2 text-gray-300 print:text-black">TOTAL</td>
                    <td className="px-4 py-2 text-right font-mono text-green-400 print:text-black">{fmtMoney(finances.summary.income)}</td>
                    <td className="px-4 py-2 text-right font-mono text-red-400 print:text-black">{fmtMoney(finances.summary.expense)}</td>
                    <td className={`px-4 py-2 text-right font-mono ${finances.summary.balance >= 0 ? "text-teal-400" : "text-red-400"} print:text-black`}>{fmtMoney(finances.summary.balance)}</td>
                  </tr>
                </tfoot>
              </table>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Nu există date lunare.</p>
          )}
        </section>

        {/* ── 3. STRUCTURA VENITURI & CHELTUIELI (pie charts) ──────────────── */}
        <section className="print-avoid-break print-page">
          <h2 className="text-lg font-bold text-teal-400 print:text-black border-b border-gray-700 print:border-gray-400 pb-2 mb-4">3. STRUCTURA VENITURI ȘI CHELTUIELI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Income pie */}
            <div>
              <h3 className="text-sm font-semibold text-green-400 print:text-black mb-3">Venituri pe Categorii</h3>
              {incCatData.length > 0 ? (
                <>
                  <div style={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={incCatData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                          {incCatData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={v => [`${fmtMoney(v)} lei`]} contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} itemStyle={{ color: "#d1d5db" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <table className="w-full text-xs mt-2 bg-gray-800 print:bg-white rounded border border-gray-700 print:border-gray-300">
                    <thead><tr className="bg-gray-750 print:bg-gray-200"><th className="text-left px-3 py-1.5 text-gray-300 print:text-black">Categorie</th><th className="text-right px-3 py-1.5 text-gray-300 print:text-black">Sumă (lei)</th><th className="text-right px-3 py-1.5 text-gray-300 print:text-black">%</th></tr></thead>
                    <tbody>
                      {incCatData.map((r, i) => <tr key={r.name} className={`border-t border-gray-700 print:border-gray-300 ${i % 2 ? "bg-gray-750/40" : ""}`}><td className="px-3 py-1.5 text-gray-200 print:text-black">{r.name}</td><td className="px-3 py-1.5 text-right font-mono text-green-400 print:text-black">{fmtMoney(r.value)}</td><td className="px-3 py-1.5 text-right text-gray-400 print:text-black">{finances.summary.income > 0 ? ((r.value / finances.summary.income) * 100).toFixed(1) : 0}%</td></tr>)}
                    </tbody>
                  </table>
                </>
              ) : <p className="text-gray-500 text-sm">Fără date.</p>}
            </div>
            {/* Expense pie */}
            <div>
              <h3 className="text-sm font-semibold text-red-400 print:text-black mb-3">Cheltuieli pe Categorii</h3>
              {expCatData.length > 0 ? (
                <>
                  <div style={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={expCatData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                          {expCatData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={v => [`${fmtMoney(v)} lei`]} contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} itemStyle={{ color: "#d1d5db" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <table className="w-full text-xs mt-2 bg-gray-800 print:bg-white rounded border border-gray-700 print:border-gray-300">
                    <thead><tr className="bg-gray-750 print:bg-gray-200"><th className="text-left px-3 py-1.5 text-gray-300 print:text-black">Categorie</th><th className="text-right px-3 py-1.5 text-gray-300 print:text-black">Sumă (lei)</th><th className="text-right px-3 py-1.5 text-gray-300 print:text-black">%</th></tr></thead>
                    <tbody>
                      {expCatData.map((r, i) => <tr key={r.name} className={`border-t border-gray-700 print:border-gray-300 ${i % 2 ? "bg-gray-750/40" : ""}`}><td className="px-3 py-1.5 text-gray-200 print:text-black">{r.name}</td><td className="px-3 py-1.5 text-right font-mono text-red-400 print:text-black">{fmtMoney(r.value)}</td><td className="px-3 py-1.5 text-right text-gray-400 print:text-black">{finances.summary.expense > 0 ? ((r.value / finances.summary.expense) * 100).toFixed(1) : 0}%</td></tr>)}
                    </tbody>
                  </table>
                </>
              ) : <p className="text-gray-500 text-sm">Fără date.</p>}
            </div>
          </div>
        </section>

        {/* ── 4. TABEL COMPLET TRANZACȚII ───────────────────────────────────── */}
        <section className="print-page">
          <h2 className="text-lg font-bold text-teal-400 print:text-black border-b border-gray-700 print:border-gray-400 pb-2 mb-4">4. TABEL COMPLET TRANZACȚII ({all.length})</h2>
          {all.length === 0 ? <p className="text-gray-500 text-sm">Nicio tranzacție.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs bg-gray-800 print:bg-white rounded-lg border border-gray-700 print:border-gray-300">
                <thead>
                  <tr className="bg-gray-750 print:bg-gray-200 border-b border-gray-700 print:border-gray-300">
                    <th className="text-left px-3 py-2 text-gray-300 print:text-black font-semibold">#</th>
                    <th className="text-left px-3 py-2 text-gray-300 print:text-black font-semibold">Data</th>
                    <th className="text-left px-3 py-2 text-gray-300 print:text-black font-semibold">Tip</th>
                    <th className="text-left px-3 py-2 text-gray-300 print:text-black font-semibold">Categorie</th>
                    <th className="text-left px-3 py-2 text-gray-300 print:text-black font-semibold">Client / Descriere</th>
                    <th className="text-left px-3 py-2 text-gray-300 print:text-black font-semibold">Note</th>
                    <th className="text-right px-3 py-2 text-gray-300 print:text-black font-semibold">Sumă (lei)</th>
                  </tr>
                </thead>
                <tbody>
                  {all.map((t, i) => (
                    <tr key={t.id} className={`border-t border-gray-700/60 print:border-gray-300 ${i % 2 === 0 ? "" : "bg-gray-750/30 print:bg-gray-50"}`}>
                      <td className="px-3 py-1.5 text-gray-500 print:text-gray-400">{i + 1}</td>
                      <td className="px-3 py-1.5 text-gray-300 print:text-black whitespace-nowrap">{fmtDate(t.date)}</td>
                      <td className="px-3 py-1.5 whitespace-nowrap">
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${t.type === "income" ? "bg-green-900/60 text-green-300 print:text-green-800" : "bg-red-900/60 text-red-300 print:text-red-800"}`}>
                          {t.type === "income" ? "Încasare" : "Cheltuială"}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-gray-300 print:text-black">{catLabel(t.category)}</td>
                      <td className="px-3 py-1.5 text-gray-200 print:text-black max-w-xs">{t.client || t.description || "—"}</td>
                      <td className="px-3 py-1.5 text-gray-400 print:text-gray-600 max-w-xs truncate">{t.notes || "—"}</td>
                      <td className={`px-3 py-1.5 text-right font-mono font-bold ${t.type === "income" ? "text-green-400 print:text-green-800" : "text-red-400 print:text-red-800"}`}>
                        {t.type === "income" ? "+" : "−"}{fmtMoney(t.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-600 print:border-gray-400 font-bold">
                    <td colSpan={6} className="px-3 py-2 text-gray-300 print:text-black">TOTAL</td>
                    <td className="px-3 py-2 text-right font-mono text-teal-400 print:text-black">{fmtMoney(finances.summary.income)} / −{fmtMoney(finances.summary.expense)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </section>

        {/* ── 5. ECHIPE ─────────────────────────────────────────────────────── */}
        <section className="print-avoid-break print-page">
          <h2 className="text-lg font-bold text-teal-400 print:text-black border-b border-gray-700 print:border-gray-400 pb-2 mb-4">5. ECHIPE ({teams.length})</h2>

          {teams.length > 0 && (
            <div style={{ height: 220 }} className="mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamsIncome} layout="vertical" margin={{ top: 0, right: 40, left: 80, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "#d1d5db", fontSize: 10 }} width={80} />
                  <Tooltip formatter={v => [`${fmtMoney(v)} lei`]} contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} itemStyle={{ color: "#d1d5db" }} />
                  <Bar dataKey="totalIncome" name="Total Încasat" fill="#14b8a6" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {teams.length === 0 ? <p className="text-gray-500 text-sm">Nicio echipă.</p> : (
            <table className="w-full text-sm bg-gray-800 print:bg-white rounded-lg border border-gray-700 print:border-gray-300">
              <thead>
                <tr className="bg-gray-750 print:bg-gray-200 border-b border-gray-700 print:border-gray-300">
                  <th className="text-left px-4 py-2 text-gray-300 print:text-black font-semibold">#</th>
                  <th className="text-left px-4 py-2 text-gray-300 print:text-black font-semibold">Echipă</th>
                  <th className="text-left px-4 py-2 text-gray-300 print:text-black font-semibold">Telefon</th>
                  <th className="text-right px-4 py-2 text-gray-300 print:text-black font-semibold">Meciuri</th>
                  <th className="text-right px-4 py-2 text-gray-300 print:text-black font-semibold">Total Încasat (lei)</th>
                </tr>
              </thead>
              <tbody>
                {[...teams].sort((a, b) => (b.totalIncome || 0) - (a.totalIncome || 0)).map((t, i) => (
                  <tr key={t.id} className={`border-t border-gray-700/60 print:border-gray-300 ${i % 2 ? "bg-gray-750/30 print:bg-gray-50" : ""}`}>
                    <td className="px-4 py-2 text-gray-500 print:text-gray-500">{i + 1}</td>
                    <td className="px-4 py-2 text-gray-100 print:text-black font-medium">{t.name}</td>
                    <td className="px-4 py-2 text-gray-400 print:text-gray-600">{t.phone || "—"}</td>
                    <td className="px-4 py-2 text-right text-gray-300 print:text-black">{t.gameCount || 0}</td>
                    <td className="px-4 py-2 text-right font-mono font-bold text-teal-400 print:text-black">{fmtMoney(t.totalIncome || 0)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-600 print:border-gray-400 font-bold">
                  <td colSpan={3} className="px-4 py-2 text-gray-300 print:text-black">TOTAL</td>
                  <td className="px-4 py-2 text-right text-gray-300 print:text-black">{teams.reduce((s, t) => s + (t.gameCount || 0), 0)}</td>
                  <td className="px-4 py-2 text-right font-mono text-teal-400 print:text-black">{fmtMoney(teams.reduce((s, t) => s + (t.totalIncome || 0), 0))}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </section>

        {/* ── 6. DATORII / ÎMPRUMUTURI ──────────────────────────────────────── */}
        <section className="print-avoid-break print-page">
          <h2 className="text-lg font-bold text-amber-400 print:text-black border-b border-gray-700 print:border-gray-400 pb-2 mb-4">6. DATORII / ÎMPRUMUTURI ({loans.length})</h2>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Total împrumutat", value: fmtMoney(loansSummary.totalAmount) + " lei", color: "text-amber-400" },
              { label: "Total restituit", value: fmtMoney(loansSummary.totalRestituit) + " lei", color: "text-green-400" },
              { label: "Rămâne de restituit", value: fmtMoney(loansSummary.totalRamas) + " lei", color: "text-red-400" },
            ].map(item => (
              <div key={item.label} className="bg-gray-800 print:bg-gray-100 rounded-lg p-3 border border-gray-700 print:border-gray-300 text-center">
                <p className="text-gray-400 print:text-gray-600 text-xs mb-1">{item.label}</p>
                <p className={`font-bold text-lg ${item.color} print:text-black`}>{item.value}</p>
              </div>
            ))}
          </div>

          {loans.length === 0 ? <p className="text-gray-500 text-sm">Niciun împrumut înregistrat.</p> : (
            <table className="w-full text-sm bg-gray-800 print:bg-white rounded-lg border border-gray-700 print:border-gray-300">
              <thead>
                <tr className="bg-gray-750 print:bg-gray-200 border-b border-gray-700 print:border-gray-300">
                  <th className="text-left px-3 py-2 text-amber-400 print:text-black font-semibold">#</th>
                  <th className="text-left px-3 py-2 text-amber-400 print:text-black font-semibold">Denumire</th>
                  <th className="text-left px-3 py-2 text-amber-400 print:text-black font-semibold">Data</th>
                  <th className="text-right px-3 py-2 text-amber-400 print:text-black font-semibold">Sumă (lei)</th>
                  <th className="text-left px-3 py-2 text-amber-400 print:text-black font-semibold">Obiecții</th>
                  <th className="text-right px-3 py-2 text-amber-400 print:text-black font-semibold">Restituit (lei)</th>
                  <th className="text-right px-3 py-2 text-amber-400 print:text-black font-semibold">Mai Trebuie (lei)</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan, i) => {
                  const ramas = Math.max(0, loan.amount - loan.restituit);
                  return (
                    <tr key={loan.id} className={`border-t border-gray-700/60 print:border-gray-300 ${i % 2 ? "bg-gray-750/30 print:bg-gray-50" : ""}`}>
                      <td className="px-3 py-2 text-gray-500 print:text-gray-500">{i + 1}</td>
                      <td className="px-3 py-2 text-gray-100 print:text-black font-medium">{loan.denumire}</td>
                      <td className="px-3 py-2 text-gray-300 print:text-black whitespace-nowrap">{fmtDate(loan.date)}</td>
                      <td className="px-3 py-2 text-right font-mono text-amber-300 print:text-black">{fmtMoney(loan.amount)}</td>
                      <td className="px-3 py-2 text-gray-400 print:text-gray-600 text-xs max-w-xs">{loan.notes || "—"}</td>
                      <td className="px-3 py-2 text-right font-mono text-green-400 print:text-black">{loan.restituit > 0 ? fmtMoney(loan.restituit) : "—"}</td>
                      <td className="px-3 py-2 text-right font-mono font-bold">
                        {ramas > 0 ? <span className="text-red-400 print:text-red-800">{fmtMoney(ramas)}</span> : <span className="text-green-500 print:text-green-700 text-xs">✓ Achitat</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-amber-700/50 print:border-gray-400 font-bold">
                  <td colSpan={3} className="px-3 py-2 text-amber-300 print:text-black">TOTAL</td>
                  <td className="px-3 py-2 text-right font-mono text-amber-300 print:text-black">{fmtMoney(loansSummary.totalAmount)}</td>
                  <td />
                  <td className="px-3 py-2 text-right font-mono text-green-400 print:text-black">{fmtMoney(loansSummary.totalRestituit)}</td>
                  <td className="px-3 py-2 text-right font-mono text-red-400 print:text-black">{fmtMoney(loansSummary.totalRamas)}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </section>

        {/* ── 7. GRAFIC LINIAR VENITURI ─────────────────────────────────────── */}
        {monthlyData.length > 0 && (
          <section className="print-avoid-break print-page">
            <h2 className="text-lg font-bold text-teal-400 print:text-black border-b border-gray-700 print:border-gray-400 pb-2 mb-4">7. GRAFIC LINIAR — TENDINȚĂ VENITURI</h2>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                  <Tooltip formatter={v => [`${fmtMoney(v)} lei`]} contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#d1d5db" }} />
                  <Legend wrapperStyle={{ color: "#9ca3af" }} />
                  <Line type="monotone" dataKey="income" name="Încasări" stroke="#14b8a6" strokeWidth={2} dot={{ fill: "#14b8a6", r: 3 }} />
                  <Line type="monotone" dataKey="expense" name="Cheltuieli" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* ── FOOTER ────────────────────────────────────────────────────────── */}
        <div className="border-t border-gray-700 print:border-gray-400 pt-6 text-center text-gray-500 print:text-gray-600 text-xs">
          <p>Stadion Oală Oleg — Raport generat automat la {generatedAt.toLocaleDateString("ro-MD")} {generatedAt.toLocaleTimeString("ro-MD", { hour: "2-digit", minute: "2-digit" })}</p>
          <p className="mt-1">Teza Dashboard — Sistem de management administrativ</p>
        </div>

      </div>
    </>
  );
}
