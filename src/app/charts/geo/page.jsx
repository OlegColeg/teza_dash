"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { Users, DollarSign, Activity } from "lucide-react";

const COLORS = ["#14B8A6","#3B82F6","#F59E0B","#EF4444","#8B5CF6","#EC4899","#10B981","#F97316"];

export default function GeographyChartPage() {
  const [teamStats, setTeamStats] = useState([]);
  const [incomeStats, setIncomeStats] = useState([]);
  const [tab, setTab] = useState('teams');
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ teams: 0, reservations: 0, income: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    Promise.all([
      fetch('/api/teams', { headers }).then(r => r.ok ? r.json() : []),
      fetch('/api/reservations', { headers }).then(r => r.ok ? r.json() : []),
      fetch('/api/finances', { headers }).then(r => r.ok ? r.json() : {}),
    ]).then(([teamsRaw, resRaw, finsRaw]) => {
      const teamsArr = teamsRaw.data || teamsRaw || [];
      const resArr = resRaw.data || resRaw || [];
      const finsArr = finsRaw.transactions || finsRaw.data || (Array.isArray(finsRaw) ? finsRaw : []);

      // Teams ranked by reservations + income
      const teamMap = {};
      teamsArr.forEach(t => {
        teamMap[t.id] = { name: t.name || t.id, reservations: 0, income: 0 };
      });
      resArr.forEach(r => {
        const key = r.teamId || r.team?.id;
        if (!teamMap[key]) teamMap[key] = { name: r.team?.name || key, reservations: 0, income: 0 };
        teamMap[key].reservations += 1;
        teamMap[key].income += r.totalPrice || r.price || 0;
      });
      const stats = Object.values(teamMap)
        .sort((a, b) => b.reservations - a.reservations)
        .slice(0, 10);
      setTeamStats(stats);

      // Income by category
      const catMap = {};
      finsArr.filter(f => f.type === 'income').forEach(f => {
        const k = f.category || 'Altele';
        catMap[k] = (catMap[k] || 0) + (f.amount || 0);
      });
      const incStats = Object.entries(catMap)
        .map(([name, total]) => ({ name, total: +total.toFixed(0) }))
        .sort((a, b) => b.total - a.total);
      setIncomeStats(incStats);

      const totalIncome = finsArr.filter(f => f.type === 'income').reduce((s, f) => s + (f.amount || 0), 0);
      setTotals({ teams: teamsArr.length, reservations: resArr.length, income: +totalIncome.toFixed(0) });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const activeData = tab === 'teams'
    ? teamStats.map(t => ({ name: t.name, valoare: t.reservations, label: 'rezervări' }))
    : incomeStats.map(i => ({ name: i.name, valoare: i.total, label: 'MDL' }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Grafic Distribuție</h1>
        <p className="text-gray-400 text-sm mt-1">Activitatea echipelor și sursele de venit ale stadionului</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Users size={18}/>, label: 'Total Echipe', value: totals.teams },
          { icon: <Activity size={18}/>, label: 'Total Rezervări', value: totals.reservations },
          { icon: <DollarSign size={18}/>, label: 'Total Venituri', value: `${totals.income.toLocaleString('ro-RO')} MDL` },
        ].map((card, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center gap-3">
            <div className="text-teal-400">{card.icon}</div>
            <div>
              <p className="text-xs text-gray-400">{card.label}</p>
              <p className="text-lg font-bold text-white">{loading ? '...' : card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {[
          { key: 'teams', label: 'Top Echipe (Rezervări)' },
          { key: 'income', label: 'Surse de Venit' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        {loading ? (
          <div className="h-80 flex items-center justify-center text-gray-400">Se încarcă datele...</div>
        ) : activeData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-gray-400">Nu există date suficiente</div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                <XAxis type="number" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 11 }} width={75} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
                  formatter={(v, name, props) => [
                    tab === 'teams' ? `${v} rezervări` : `${v.toLocaleString('ro-RO')} MDL`,
                    tab === 'teams' ? 'Rezervări' : 'Venit'
                  ]}
                />
                <Bar dataKey="valoare" radius={[0, 4, 4, 0]}>
                  {activeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
