"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, Users, AlertTriangle, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

function StatCard({ title, value, subtitle, icon, color }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-wide">{title}</p>
          <p className="text-white text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/dashboard/stats', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const tooltipStyle = {
    contentStyle: { backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F9FAFB' }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">PANOU DE CONTROL</h1>
        <p className="text-gray-400 mt-1">Stadion de mini-fotbal — situație generală</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="BANI ÎN CASĂ"
          value={loading ? '...' : `${(stats?.cashBalance ?? 0).toLocaleString()} lei`}
          subtitle={`Încasări: ${(stats?.totalIncome ?? 0).toLocaleString()} lei`}
          icon={<DollarSign size={20} className="text-white" />}
          color="bg-green-600"
        />
        <StatCard
          title="TOTAL DATORII"
          value={loading ? '...' : `${(stats?.totalDebt ?? 0).toLocaleString()} lei`}
          subtitle="Sume neachitate de echipe"
          icon={<AlertTriangle size={20} className="text-white" />}
          color="bg-red-600"
        />
        <StatCard
          title="ECHIPE ACTIVE"
          value={loading ? '...' : stats?.activeTeams ?? 0}
          subtitle={`Din ${stats?.totalTeams ?? 0} total înregistrate`}
          icon={<Users size={20} className="text-white" />}
          color="bg-blue-600"
        />
        <StatCard
          title="REZERVĂRI AZI"
          value={loading ? '...' : stats?.todayReservations ?? 0}
          subtitle="Ore rezervate astăzi"
          icon={<Calendar size={20} className="text-white" />}
          color="bg-indigo-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Încasări vs Cheltuieli (6 luni)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
              <YAxis tick={{ fill: '#9CA3AF' }} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Bar dataKey="income" name="Încasări" fill="#10B981" />
              <Bar dataKey="expense" name="Cheltuieli" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Profit Net (6 luni)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
              <YAxis tick={{ fill: '#9CA3AF' }} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Line type="monotone" dataKey="profit" name="Profit" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6' }} />
              <Line type="monotone" dataKey="income" name="Încasări" stroke="#10B981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg flex items-center gap-4">
          <div className="bg-green-600 p-3 rounded-lg"><TrendingUp size={24} className="text-white" /></div>
          <div>
            <p className="text-gray-400 text-sm">Total Încasări</p>
            <p className="text-white text-xl font-bold">{(stats?.totalIncome ?? 0).toLocaleString()} lei</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg flex items-center gap-4">
          <div className="bg-red-600 p-3 rounded-lg"><TrendingDown size={24} className="text-white" /></div>
          <div>
            <p className="text-gray-400 text-sm">Total Cheltuieli</p>
            <p className="text-white text-xl font-bold">{(stats?.totalExpense ?? 0).toLocaleString()} lei</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg flex items-center gap-4">
          <div className={`${(stats?.cashBalance ?? 0) >= 0 ? 'bg-green-600' : 'bg-red-600'} p-3 rounded-lg`}>
            <DollarSign size={24} className="text-white" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Balanță Netă</p>
            <p className={`text-xl font-bold ${(stats?.cashBalance ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {(stats?.cashBalance ?? 0).toLocaleString()} lei
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}