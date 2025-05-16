"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, TrendingUp } from "lucide-react";

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

export default function BarChartPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">BAR CHART</h1>
          <p className="text-gray-400">Vizualizează datele utilizând grafice cu bare</p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded flex items-center">
          <Download size={18} className="mr-2" />
          EXPORTĂ GRAFIC
        </button>
      </div>

      {/* Cards with statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">TOTAL VÂNZĂRI</p>
              <p className="text-white text-2xl font-bold">52,890</p>
            </div>
            <div className="bg-blue-600 p-3 rounded-lg">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">TOTAL VENITURI</p>
              <p className="text-white text-2xl font-bold">98,756 MDL</p>
            </div>
            <div className="bg-green-600 p-3 rounded-lg">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">TOTAL PROFIT</p>
              <p className="text-white text-2xl font-bold">43,521 MDL</p>
            </div>
            <div className="bg-purple-600 p-3 rounded-lg">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar Chart */}
      <div className="bg-dark-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-white mb-4">Evoluția Vânzărilor</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
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
              <Bar dataKey="sales" fill="#3B82F6" name="Vânzări" />
              <Bar dataKey="revenue" fill="#10B981" name="Venituri" />
              <Bar dataKey="profit" fill="#8B5CF6" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparative Analysis */}
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

        {/* Data Summary Table */}
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-white mb-4">Sumar Date</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-dark-700 rounded-lg">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-left text-gray-300">Luna</th>
                  <th className="py-3 px-4 text-right text-gray-300">Vânzări</th>
                  <th className="py-3 px-4 text-right text-gray-300">Venituri</th>
                  <th className="py-3 px-4 text-right text-gray-300">Profit</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 6).map((item) => (
                  <tr key={item.month} className="border-b border-gray-700 hover:bg-dark-600">
                    <td className="py-3 px-4 text-gray-300">{item.month}</td>
                    <td className="py-3 px-4 text-right text-gray-300">{item.sales.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-gray-300">{item.revenue.toLocaleString()} MDL</td>
                    <td className="py-3 px-4 text-right text-gray-300">{item.profit.toLocaleString()} MDL</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}