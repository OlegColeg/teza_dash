"use client";

import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

const MONTHS = ["Ian","Feb","Mar","Apr","Mai","Iun","Iul","Aug","Sep","Oct","Nov","Dec"];

export default function LineChartPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bestMonth, setBestMonth] = useState(null);
  const [trend, setTrend] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    Promise.all([
      fetch('/api/finances', { headers }).then(r => r.ok ? r.json() : {}),
      fetch('/api/reservations', { headers }).then(r => r.ok ? r.json() : []),
    ]).then(([fins, resRaw]) => {
      const finArr = fins.transactions || fins.data || (Array.isArray(fins) ? fins : []);
      const resArr = resRaw.data || resRaw || [];
      const year = new Date().getFullYear();
      const monthly = MONTHS.map((m, idx) => {
        const monthStr = String(idx + 1).padStart(2, '0');
        const rows = finArr.filter(f => f.date?.startsWith(`${year}-${monthStr}`));
        const income = rows.filter(f => f.type === 'income').reduce((s, f) => s + (f.amount || 0), 0);
        const expense = rows.filter(f => f.type === 'expense').reduce((s, f) => s + (f.amount || 0), 0);
        const rezervari = resArr.filter(r => r.date?.startsWith(`${year}-${monthStr}`)).length;
        return { month: m, venituri: +income.toFixed(0), cheltuieli: +expense.toFixed(0), profit: +(income - expense).toFixed(0), rezervari };
      });
      setData(monthly);
      const best = monthly.reduce((b, d) => d.profit > b.profit ? d : b, monthly[0]);
      setBestMonth(best);
      const last3 = monthly.slice(-3).map(d => d.profit);
      if (last3.length >= 2) setTrend(last3[last3.length-1] - last3[0]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Grafic Liniar — Evoluție Financiară</h1>
        <p className="text-gray-400 text-sm mt-1">Tendințe venituri, cheltuieli și profit în timp real</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Luna cu cel mai mare profit</p>
          <p className="text-white text-xl font-bold mt-1">{loading ? '...' : bestMonth ? `${bestMonth.month} — ${bestMonth.profit.toLocaleString('ro-RO')} MDL` : 'N/A'}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Tendință ultimele 3 luni</p>
          <div className="flex items-center gap-2 mt-1">
            {trend >= 0 ? <TrendingUp size={20} className="text-teal-400" /> : <TrendingDown size={20} className="text-red-400" />}
            <p className={`text-xl font-bold ${trend >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
              {loading ? '...' : `${trend >= 0 ? '+' : ''}${trend.toLocaleString('ro-RO')} MDL`}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-base font-semibold text-white mb-4">Evoluție lunară {new Date().getFullYear()}</h2>
        {loading ? (
          <div className="h-80 flex items-center justify-center text-gray-400">Se încarcă datele...</div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} tickFormatter={v => `${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
                  formatter={(v, name) => name === 'rezervari' ? [`${v} rez.`, name] : [`${v.toLocaleString('ro-RO')} MDL`, name]}
                />
                <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: 12 }} />
                <Line type="monotone" dataKey="venituri" stroke="#14B8A6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="cheltuieli" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="profit" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="rezervari" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} yAxisId={0} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
