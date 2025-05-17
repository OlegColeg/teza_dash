// src/app/page.jsx
"use client";

import React from "react";
import { BarChart2, Users, FileText, ShoppingCart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, TrendingUp } from "lucide-react";
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
export default function Home() {
  return (
    <div className="space-y-6">
      {/* Header with download button */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">DASHBOARD</h1>
          <p className="text-gray-400">Welcome to your dashboard</p>
        </div>
        <button className="bg-indigo-600 transition duration-500 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          DOWNLOAD REPORTS
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="TOTAL SALES" 
          value="12,361" 
          change="+14%" 
          description="Since last month" 
          icon={<ShoppingCart size={20} className="text-white" />}
          color="bg-teal-600"
        />
        <StatCard 
          title="MONTHLY REVENUE" 
          value="$43,246" 
          change="+21%" 
          description="Since last month" 
          icon={<BarChart2 size={20} className="text-white" />}
          color="bg-blue-600"
        />
        <StatCard 
          title="NEW CLIENTS" 
          value="156" 
          change="+5%" 
          description="Since last week" 
          icon={<Users size={20} className="text-white" />}
          color="bg-indigo-600"
        />
        <StatCard 
          title="PENDING ORDERS" 
          value="17" 
          change="-12%" 
          description="Since yesterday" 
          icon={<FileText size={20} className="text-white" />}
          color="bg-red-600"
        />
      </div>

      {/* Main content area - aici vor veni graficele, tabelele etc. */}
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-white mb-4">Analiza Comparativă - Vânzări vs Profit</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#9CA3AF' }}
                  tickLine={{ stroke: '#9CA3AF' }}
                />
                <YAxis 
                  tick={{ fill: '#9CA3AF' }}
                  tickLine={{ stroke: '#9CA3AF' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Legend wrapperStyle={{ color: '#F9FAFB' }} />
                <Bar dataKey="sales" fill="#3B82F6" />
                <Bar dataKey="profit" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-white mb-4">Sales by Category</h2>
          <div className="h-64 bg-dark-700 rounded flex items-center justify-center">
            <p className="text-gray-400">Chart will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-dark-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-dark-700 rounded-lg">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left text-gray-300">Transaction ID</th>
                <th className="py-3 px-4 text-left text-gray-300">Customer</th>
                <th className="py-3 px-4 text-left text-gray-300">Date</th>
                <th className="py-3 px-4 text-left text-gray-300">Amount</th>
                <th className="py-3 px-4 text-left text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              <TableRow id="#TX-2907" customer="Alex Ionescu" date="12 May 2025" amount="$125.00" status="Completed" />
              <TableRow id="#TX-2906" customer="Maria Popescu" date="11 May 2025" amount="$243.50" status="Pending" />
              <TableRow id="#TX-2905" customer="Ion Creangă" date="10 May 2025" amount="$74.99" status="Completed" />
              <TableRow id="#TX-2904" customer="Elena Dinu" date="09 May 2025" amount="$531.00" status="Failed" />
              <TableRow id="#TX-2903" customer="Vasile Mureșan" date="08 May 2025" amount="$92.75" status="Completed" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Componente ajutătoare pentru dashboard
function StatCard({ title, value, change, description, icon, color = "bg-blue-600" }) {
  const isPositive = change && change.startsWith('+');
  
  return (
    <div className="bg-dark-800 p-6 rounded-lg shadow">
      <div className="flex justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
        </div>
        <div className={`${color} h-12 w-12 rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
        <span className="text-gray-400 text-sm ml-1">{description}</span>
      </div>
    </div>
  );
}

function TableRow({ id, customer, date, amount, status }) {
  const statusColor = {
    'Completed': 'bg-green-600',
    'Pending': 'bg-yellow-600',
    'Failed': 'bg-red-600'
  };
  
  return (
    <tr className="border-b border-gray-700 hover:bg-dark-600">
      <td className="py-3 px-4 text-gray-300">{id}</td>
      <td className="py-3 px-4 text-gray-300">{customer}</td>
      <td className="py-3 px-4 text-gray-300">{date}</td>
      <td className="py-3 px-4 text-gray-300">{amount}</td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs ${statusColor[status]} text-white`}>
          {status}
        </span>
      </td>
    </tr>
  );
}