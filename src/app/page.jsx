"use client";

import React from "react";
import { BarChart2, Users, FileText, ShoppingCart } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Date simplificate
const chartData = [
  { month: "Jan", sales: 4000, profit: 1600, revenue: 2400 },
  { month: "Feb", sales: 3000, profit: 1602, revenue: 1398 },
  { month: "Mar", sales: 2000, profit: 6000, revenue: 8000 },
  { month: "Apr", sales: 2780, profit: 1128, revenue: 3908 },
  { month: "May", sales: 1890, profit: 2910, revenue: 4800 },
  { month: "Jun", sales: 2390, profit: 1410, revenue: 3800 }
];

const transactions = [
  { id: "#TX-2907", customer: "Alex Ionescu", date: "12 May 2025", amount: "$125.00", status: "Completed" },
  { id: "#TX-2906", customer: "Maria Popescu", date: "11 May 2025", amount: "$243.50", status: "Pending" },
  { id: "#TX-2905", customer: "Ion Creangă", date: "10 May 2025", amount: "$74.99", status: "Completed" },
  { id: "#TX-2904", customer: "Elena Dinu", date: "09 May 2025", amount: "$531.00", status: "Failed" }
];

// Componenta pentru cardurile de statistici
function StatCard({ title, value, change, icon, bgColor }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-white text-2xl font-bold mt-1">{value}</p>
          <p className="text-gray-400 text-sm mt-2">
            <span className={change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
              {change}
            </span>
            {' '}Since last month
          </p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">DASHBOARD</h1>
            <p className="text-gray-400 mt-1">Welcome to your dashboard</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <ShoppingCart size={16} />
            DOWNLOAD REPORTS
          </button>
        </div>

        {/* Carduri statistici */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="TOTAL SALES" 
            value="12,361" 
            change="+14%" 
            icon={<ShoppingCart size={20} className="text-white" />}
            bgColor="bg-teal-600"
          />
          <StatCard 
            title="MONTHLY REVENUE" 
            value="$43,246" 
            change="+21%" 
            icon={<BarChart2 size={20} className="text-white" />}
            bgColor="bg-blue-600"
          />
          <StatCard 
            title="NEW CLIENTS" 
            value="156" 
            change="+5%" 
            icon={<Users size={20} className="text-white" />}
            bgColor="bg-indigo-600"
          />
          <StatCard 
            title="PENDING ORDERS" 
            value="17" 
            change="-12%" 
            icon={<FileText size={20} className="text-white" />}
            bgColor="bg-red-600"
          />
        </div>

        {/* Grafice */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Grafic cu bare */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Vânzări vs Profit</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
                <YAxis tick={{ fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="sales" fill="#3B82F6" />
                <Bar dataKey="profit" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Grafic cu linii */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Evoluția Anuală</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
                <YAxis tick={{ fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabel tranzacții */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-left text-gray-300">ID</th>
                  <th className="py-3 px-4 text-left text-gray-300">Customer</th>
                  <th className="py-3 px-4 text-left text-gray-300">Date</th>
                  <th className="py-3 px-4 text-left text-gray-300">Amount</th>
                  <th className="py-3 px-4 text-left text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="py-3 px-4 text-gray-300">{transaction.id}</td>
                    <td className="py-3 px-4 text-gray-300">{transaction.customer}</td>
                    <td className="py-3 px-4 text-gray-300">{transaction.date}</td>
                    <td className="py-3 px-4 text-gray-300">{transaction.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs text-white ${
                        transaction.status === 'Completed' ? 'bg-green-600' :
                        transaction.status === 'Pending' ? 'bg-yellow-600' : 'bg-red-600'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
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