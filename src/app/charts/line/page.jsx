"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";

// Date pentru grafic
const data = [
  { name: "Ian", visits: 4000, sales: 2400, revenue: 1600 },
  { name: "Feb", visits: 3000, sales: 1398, revenue: 2210 },
  { name: "Mar", visits: 9800, sales: 2000, revenue: 2290 },
  { name: "Apr", visits: 3908, sales: 2780, revenue: 3300 },
  { name: "Mai", visits: 4800, sales: 1890, revenue: 2500 },
  { name: "Iun", visits: 3800, sales: 2390, revenue: 1700 },
  { name: "Iul", visits: 4300, sales: 3490, revenue: 2100 },
  { name: "Aug", visits: 5200, sales: 3200, revenue: 2400 },
  { name: "Sep", visits: 4900, sales: 2800, revenue: 2200 },
  { name: "Oct", visits: 3600, sales: 2300, revenue: 1800 },
  { name: "Nov", visits: 5900, sales: 4000, revenue: 2700 },
  { name: "Dec", visits: 4200, sales: 3200, revenue: 2100 }
];

export default function LineChartPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">LINE CHART</h1>
          <p className="text-gray-400">Vizualizează evoluția datelor în timp</p>
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
              <p className="text-gray-400 text-sm">TOTAL VIZITE</p>
              <p className="text-white text-2xl font-bold">124,578</p>
            </div>
            <div className="bg-blue-600 p-3 rounded-lg">
              <Users size={24} className="text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">TOTAL VÂNZĂRI</p>
              <p className="text-white text-2xl font-bold">43,680</p>
            </div>
            <div className="bg-green-600 p-3 rounded-lg">
              <ShoppingCart size={24} className="text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">VENIT TOTAL</p>
              <p className="text-white text-2xl font-bold">98,520 MDL</p>
            </div>
            <div className="bg-purple-600 p-3 rounded-lg">
              <DollarSign size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Line Chart */}
      <div className="bg-dark-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-white mb-4">Evoluția Anuală</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
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
              <Legend wrapperStyle={{ color: '#F9FAFB' }} />
              <Line type="monotone" dataKey="visits" stroke="#3B82F6" activeDot={{ r: 8 }} name="Vizite" />
              <Line type="monotone" dataKey="sales" stroke="#10B981" name="Vânzări" />
              <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" name="Venituri" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-dark-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-white mb-4">Analiză Performanță</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-dark-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Tendințe</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Creștere de 15% în vizite față de anul trecut</li>
              <li>• Vârful de vânzări în luna Noiembrie</li>
              <li>• Corelație puternică între vizite și vânzări</li>
              <li>• Sezonalitate identificată în Q4</li>
            </ul>
          </div>
          
          <div className="bg-dark-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Recomandări</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Intensificarea campaniilor în perioadele de vârf</li>
              <li>• Optimizarea experienței utilizatorilor pentru conversii mai bune</li>
              <li>• Focusare pe strategii de retenție în perioadele de scădere</li>
              <li>• Adaptarea stocurilor în funcție de tendințele observate</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}