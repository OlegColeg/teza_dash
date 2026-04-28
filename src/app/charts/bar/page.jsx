"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, TrendingDown, ArrowUpRight } from "lucide-react";

const MONTHS = ["Ian","Feb","Mar","Apr","Mai","Iun","Iul","Aug","Sep","Oct","Nov","Dec"];

export default function BarChartPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ income: 0, expense: 0, profit: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch('/api/finances', { headers })
      .then(r => r.ok ? r.json() : [])
      .then(raw => {
        const arr = raw.data || raw || [];
        const year = new Date().getFullYear();
        const monthly = MONTHS.map((m, idx) => {
          const monthStr = String(idx + 1).padStart(2, '0');
          const rows = arr.filter(f => f.date?.startsWith(`${year}-${monthStr}`));
          const income = rows.filter(f => f.type === 'income').reduce((s, f) => s + (f.amount || 0), 0);
          const expense = rows.filter(f => f.type === 'expense').reduce((s, f) => s + (f.amount || 0), 0);
          return { month: m, venituri: +income.toFixed(0), cheltuieli: +expense.toFixed(0), profit: +(income - expense).toFixed(0) };
        });
        setData(monthly);
        const totIncome = arr.filter(f => f.type === 'income').reduce((s, f) => s + (f.amount || 0), 0);
        const totExpense = arr.filter(f => f.type === 'expense').reduce((s, f) => s + (f.amount || 0), 0);
        setTotals({ income: totIncome, expense: totExpense, profit: totIncome - totExpense });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Grafic Bare — Venituri vs Cheltuieli</h1>
        <p className="text-gray-400 text-sm mt-1">Date financiare reale ale stadionului pe luni, anul {new Date().getFullYear()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Venituri', value: totals.income, color: 'bg-green-600', icon: <TrendingUp size={20} className="text-white" /> },
          { label: 'Total Cheltuieli', value: totals.expense, color: 'bg-red-600', icon: <TrendingDown size={20} className="text-white" /> },
          { label: 'Profit Net', value: totals.profit, color: totals.profit >= 0 ? 'bg-teal-600' : 'bg-orange-600', icon: <DollarSign size={20} className="text-white" /> },
        ].map(card => (
          <div key={card.label} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">{card.label}</p>
                <p className="text-white text-2xl font-bold mt-1">{loading ? '...' : `${card.value.toLocaleString('ro-RO')} MDL`}</p>
              </div>
              <div className={`${card.color} p-3 rounded-xl`}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-base font-semibold text-white mb-4">Venituri vs Cheltuieli pe Luni</h2>
        {loading ? (
          <div className="h-80 flex items-center justify-center text-gray-400">Se încarcă datele...</div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} tickFormatter={v => `${v} MDL`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
                  labelStyle={{ color: '#F9FAFB', fontWeight: 600 }}
                  formatter={(v, name) => [`${v.toLocaleString('ro-RO')} MDL`, name]}
                />
                <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: 12 }} />
                <Bar dataKey="venituri" fill="#14B8A6" radius={[4,4,0,0]} />
                <Bar dataKey="cheltuieli" fill="#EF4444" radius={[4,4,0,0]} />
                <Bar dataKey="profit" fill="#8B5CF6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-base font-semibold text-white mb-4">Detalii pe Luni</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 text-gray-400 font-medium">Luna</th>
                <th className="text-right py-2 text-gray-400 font-medium">Venituri</th>
                <th className="text-right py-2 text-gray-400 font-medium">Cheltuieli</th>
                <th className="text-right py-2 text-gray-400 font-medium">Profit</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-750">
                  <td className="py-2 text-gray-300">{row.month}</td>
                  <td className="py-2 text-right text-green-400">{row.venituri.toLocaleString('ro-RO')} MDL</td>
                  <td className="py-2 text-right text-red-400">{row.cheltuieli.toLocaleString('ro-RO')} MDL</td>
                  <td className={`py-2 text-right font-medium ${row.profit >= 0 ? 'text-teal-400' : 'text-orange-400'}`}>{row.profit.toLocaleString('ro-RO')} MDL</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// Date pentru grafic
const data = [
  { month: "Jan", sales: 4000, revenue: 2400, profit: 1600 },
  { month: "Feb", sales: 3000, revenue: 1398, profit: 1602 },
  { month: "Mar", sales: 2000, revenue: 8000, profit: 6000 },
  { month: "Apr", sales: 2780, revenue: 3908, profit: 1128 },
  { month: "May", sales: 1890, revenue: 4800, profit: 2910 },
  { month: "Jun", sales: 2390, revenue: 3800, profit: 1410 },
  { month: "Iul", sales: 3490, revenue: 4300, profit: 810 },
  { month: "Aug", sales: 3790, revenue: 4500, profit: 710 },
  { month: "Sep", sales: 3290, revenue: 3300, profit: 10 },
  { month: "Oct", sales: 4190, revenue: 2400, profit: 790 },
  { month: "Nov", sales: 3590, revenue: 4100, profit: 510 },
  { month: "Dec", sales: 4090, revenue: 2100, profit: 990 }
];
