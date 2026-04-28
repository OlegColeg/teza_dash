"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#14B8A6","#3B82F6","#F59E0B","#EF4444","#8B5CF6","#EC4899","#10B981","#F97316"];

export default function PieChartPage() {
  const [categoryData, setCategoryData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [tab, setTab] = useState('categories');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    Promise.all([
      fetch('/api/finances', { headers }).then(r => r.ok ? r.json() : []),
      fetch('/api/teams', { headers }).then(r => r.ok ? r.json() : []),
      fetch('/api/reservations', { headers }).then(r => r.ok ? r.json() : []),
    ]).then(([fins, teamsRaw, resRaw]) => {
      const finArr = fins.data || fins || [];
      const teamsArr = teamsRaw.data || teamsRaw || [];
      const resArr = resRaw.data || resRaw || [];

      // Categorii venituri
      const incomeByCategory = {};
      finArr.filter(f => f.type === 'income').forEach(f => {
        const cat = f.category || 'Altele';
        incomeByCategory[cat] = (incomeByCategory[cat] || 0) + (f.amount || 0);
      });
      const cats = Object.entries(incomeByCategory)
        .map(([name, value]) => ({ name, value: +value.toFixed(0) }))
        .sort((a, b) => b.value - a.value);
      setCategoryData(cats);

      // Echipe după nr. rezervări
      const resByTeam = {};
      resArr.forEach(r => {
        const name = r.team?.name || r.teamId || 'Necunoscut';
        resByTeam[name] = (resByTeam[name] || 0) + 1;
      });
      const teams = Object.entries(resByTeam)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
      setTeamData(teams);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const activeData = tab === 'categories' ? categoryData : teamData;
  const total = activeData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Grafic Circular</h1>
        <p className="text-gray-400 text-sm mt-1">Distribuția veniturilor și activitatea echipelor</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'categories', label: 'Venituri pe Categorii' },
          { key: 'teams', label: 'Echipe după Rezervări' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-gray-800 rounded-xl p-10 text-center text-gray-400 border border-gray-700">Se încarcă datele...</div>
      ) : activeData.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-10 text-center text-gray-400 border border-gray-700">Nu există date suficiente</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-sm font-semibold text-gray-300 mb-4">
              {tab === 'categories' ? 'Distribuție Venituri' : 'Activitate Echipe'}
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {activeData.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
                    formatter={(v, name) => [tab === 'categories' ? `${v.toLocaleString('ro-RO')} MDL` : `${v} rezervări`, name]}
                  />
                  <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-sm font-semibold text-gray-300 mb-4">Detalii</h2>
            <div className="space-y-3">
              {activeData.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 truncate">{item.name}</p>
                    <div className="h-1.5 bg-gray-700 rounded-full mt-1">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${total > 0 ? (item.value / total * 100) : 0}%`, backgroundColor: COLORS[i % COLORS.length] }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-white">
                      {tab === 'categories' ? `${item.value.toLocaleString('ro-RO')} MDL` : `${item.value} rez.`}
                    </p>
                    <p className="text-xs text-gray-500">{total > 0 ? (item.value / total * 100).toFixed(1) : 0}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// Date pentru graficul pie
const pieData = [
  { name: "Desktop", value: 45, color: "#3B82F6" },
  { name: "Mobile", value: 30, color: "#10B981" },
  { name: "Tablet", value: 15, color: "#F59E0B" },
  { name: "Smart TV", value: 6, color: "#EF4444" },
  { name: "Altele", value: 4, color: "#8B5CF6" }
];

// Date pentru vânzări pe categorii
const categoryData = [
  { name: "Tehnologie", value: 40, amount: 125450 },
  { name: "Modă", value: 25, amount: 78230 },
  { name: "Casa & Grădină", value: 15, amount: 46890 },
  { name: "Sport", value: 12, amount: 36720 },
  { name: "Cărți", value: 8, amount: 24100 }
];

// Date pentru regiuni
const regionData = [
  { name: "Nord", value: 35, color: "#3B82F6" },
  { name: "Centru", value: 30, color: "#10B981" },
  { name: "Sud", value: 20, color: "#F59E0B" },
  { name: "Est", value: 10, color: "#EF4444" },
  { name: "Vest", value: 5, color: "#8B5CF6" }
];
