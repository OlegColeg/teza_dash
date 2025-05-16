"use client";

import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Download, PieChart as PieIcon, Target, Users } from "lucide-react";

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

export default function PieChartPage() {
  const [selectedChart, setSelectedChart] = useState("device");

  // Funcție pentru customizarea label-urilor
  const renderLabel = (entry) => {
    return `${entry.name}: ${entry.value}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">PIE CHART</h1>
          <p className="text-gray-400">Vizualizează distribuția datelor utilizând grafice circulare</p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded flex items-center">
          <Download size={18} className="mr-2" />
          EXPORTĂ GRAFIC
        </button>
      </div>

      {/* Chart Selection Tabs */}
      <div className="bg-dark-800 p-4 rounded-lg">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedChart("device")}
            className={`px-4 py-2 rounded ${
              selectedChart === "device" ? "bg-teal-600 text-white" : "bg-dark-700 text-gray-300"
            }`}
          >
            Dispositiv Access
          </button>
          <button
            onClick={() => setSelectedChart("category")}
            className={`px-4 py-2 rounded ${
              selectedChart === "category" ? "bg-teal-600 text-white" : "bg-dark-700 text-gray-300"
            }`}
          >
            Categorii Produse
          </button>
          <button
            onClick={() => setSelectedChart("region")}
            className={`px-4 py-2 rounded ${
              selectedChart === "region" ? "bg-teal-600 text-white" : "bg-dark-700 text-gray-300"
            }`}
          >
            Distribuție Regională
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">TOTAL USERS</p>
              <p className="text-white text-2xl font-bold">15,678</p>
            </div>
            <div className="bg-blue-600 p-3 rounded-lg">
              <Users size={24} className="text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">CONVERSIONS</p>
              <p className="text-white text-2xl font-bold">82.5%</p>
            </div>
            <div className="bg-green-600 p-3 rounded-lg">
              <Target size={24} className="text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">TOP CATEGORY</p>
              <p className="text-white text-2xl font-bold">Tehnologie</p>
            </div>
            <div className="bg-purple-600 p-3 rounded-lg">
              <PieIcon size={24} className="text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">AVERAGE ORDER</p>
              <p className="text-white text-2xl font-bold">245 MDL</p>
            </div>
            <div className="bg-orange-600 p-3 rounded-lg">
              <Target size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-white mb-4">
            {selectedChart === "device" && "Distribuție Accesuri după Dispozitiv"}
            {selectedChart === "category" && "Vânzări după Categorii"}
            {selectedChart === "region" && "Distribuție Regională"}
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={
                    selectedChart === "device" ? pieData :
                    selectedChart === "category" ? categoryData :
                    regionData
                  }
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(selectedChart === "device" ? pieData :
                    selectedChart === "category" ? categoryData :
                    regionData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || pieData[index].color} />
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

        {/* Data Table */}
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-white mb-4">Detalii Date</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-dark-700 rounded-lg">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-left text-gray-300">Categorie</th>
                  <th className="py-3 px-4 text-right text-gray-300">Procent</th>
                  {selectedChart === "category" && (
                    <th className="py-3 px-4 text-right text-gray-300">Sumă (MDL)</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {(selectedChart === "device" ? pieData :
                  selectedChart === "category" ? categoryData :
                  regionData).map((item, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-dark-600">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: item.color || pieData[index].color }}
                        ></div>
                        <span className="text-gray-300">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300">{item.value}%</td>
                    {selectedChart === "category" && (
                      <td className="py-3 px-4 text-right text-gray-300">
                        {item.amount?.toLocaleString()} MDL
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Additional Chart - Bar Chart Comparison */}
      {selectedChart === "category" && (
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-white mb-4">Comparație Vânzări pe Categorii</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
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
                <Bar dataKey="amount" fill="#3B82F6" name="Vânzări (MDL)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="bg-dark-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-white mb-4">Insights & Analiză</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-dark-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Key Findings</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Desktop domină cu 45% din accesuri</li>
              <li>• Categoria Tehnologie generează cele mai mari venituri</li>
              <li>• Regiunea Nord are cea mai mare cotă de piață</li>
              <li>• Mobile-ul crește cu 15% față de luna trecută</li>
            </ul>
          </div>
          
          <div className="bg-dark-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Recommendations</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Optimizați experiența mobile</li>
              <li>• Investiți mai mult în categoria Tehnologie</li>
              <li>• Explorați piețele din Est și Vest</li>
              <li>• Dezvoltați strategia pentru tablet</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}