"use client";

import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Download, Globe, TrendingUp, Map } from "lucide-react";

// Date pentru distribuția regională globală
const regionsData = [
  { name: "Europa", value: 35, color: "#3B82F6" },
  { name: "America de Nord", value: 25, color: "#10B981" },
  { name: "Asia", value: 20, color: "#F59E0B" },
  { name: "America de Sud", value: 10, color: "#EF4444" },
  { name: "Africa", value: 7, color: "#8B5CF6" },
  { name: "Australia", value: 3, color: "#EC4899" }
];

// Date pentru țările cu cele mai multe vânzări
const countriesData = [
  { country: "SUA", sales: 1245, growth: "+12%" },
  { country: "Germania", sales: 984, growth: "+8%" },
  { country: "Japonia", sales: 745, growth: "+15%" },
  { country: "UK", sales: 682, growth: "+5%" },
  { country: "Franța", sales: 580, growth: "+7%" }
];

export default function GeographyChartPage() {
  const [viewMode, setViewMode] = useState("all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">GEOGRAPHY CHART</h1>
          <p className="text-gray-400">Vizualizează distribuția globală a datelor</p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded flex items-center">
          <Download size={18} className="mr-2" />
          EXPORTĂ DATE
        </button>
      </div>

      {/* View Selector */}
      <div className="bg-dark-800 p-4 rounded-lg">
        <div className="flex space-x-4">
          <button
            onClick={() => setViewMode("all")}
            className={`px-4 py-2 rounded ${
              viewMode === "all" ? "bg-teal-600 text-white" : "bg-dark-700 text-gray-300"
            }`}
          >
            Vizualizare Globală
          </button>
          <button
            onClick={() => setViewMode("europe")}
            className={`px-4 py-2 rounded ${
              viewMode === "europe" ? "bg-teal-600 text-white" : "bg-dark-700 text-gray-300"
            }`}
          >
            Focus Europa
          </button>
          <button
            onClick={() => setViewMode("asia")}
            className={`px-4 py-2 rounded ${
              viewMode === "asia" ? "bg-teal-600 text-white" : "bg-dark-700 text-gray-300"
            }`}
          >
            Focus Asia
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">ȚĂRI ACTIVE</p>
              <p className="text-white text-2xl font-bold">78</p>
            </div>
            <div className="bg-blue-600 p-3 rounded-lg">
              <Globe size={24} className="text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">REGIUNEA DE TOP</p>
              <p className="text-white text-2xl font-bold">Europa</p>
            </div>
            <div className="bg-green-600 p-3 rounded-lg">
              <Map size={24} className="text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">CREȘTERE GLOBALĂ</p>
              <p className="text-white text-2xl font-bold">+8.5%</p>
            </div>
            <div className="bg-purple-600 p-3 rounded-lg">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Map and Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* World Map */}
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-white mb-4">Hartă Distribuție Globală</h2>
          <div className="h-80 bg-dark-700 rounded flex items-center justify-center">
            <div className="text-center">
              <Map size={64} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300">
                {viewMode === "all" ? "Vizualizare Globală" : 
                 viewMode === "europe" ? "Focalizare pe Europa" : "Focalizare pe Asia"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Click pe regiuni pentru detalii suplimentare
              </p>
            </div>
          </div>
        </div>

        {/* Distribution Pie Chart */}
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-white mb-4">Distribuție Regională</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {regionsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Legend wrapperStyle={{ color: '#F9FAFB' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Countries Table */}
      <div className="bg-dark-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-white mb-4">Top Țări după Vânzări</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-dark-700 rounded-lg">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left text-gray-300">Țară</th>
                <th className="py-3 px-4 text-right text-gray-300">Vânzări</th>
                <th className="py-3 px-4 text-right text-gray-300">Creștere</th>
              </tr>
            </thead>
            <tbody>
              {countriesData.map((item, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-dark-600">
                  <td className="py-3 px-4 text-gray-300">{item.country}</td>
                  <td className="py-3 px-4 text-right text-gray-300">{item.sales}</td>
                  <td className="py-3 px-4 text-right text-green-500">{item.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}