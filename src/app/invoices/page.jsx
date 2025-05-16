"use client";

import React, { useState } from "react";
import { Search, Download, FileText, AlertCircle } from "lucide-react";

// Date inițiale predefinite
const initialInvoices = [
  { id: "INV-2023-001", client: "Marin Constantin", email: "marin.constantin@exemplu.md", amount: 1250.75, date: "10 Apr 2025", status: "Plătită" },
  { id: "INV-2023-002", client: "Elena Rusu", email: "elena.rusu@exemplu.md", amount: 850.00, date: "15 Apr 2025", status: "În așteptare" },
  { id: "INV-2023-003", client: "Andrei Mihai", email: "andrei.mihai@exemplu.md", amount: 3450.25, date: "20 Apr 2025", status: "În așteptare" },
  { id: "INV-2023-004", client: "Cristina Popescu", email: "cristina.popescu@exemplu.md", amount: 560.50, date: "25 Apr 2025", status: "Întârziată" },
  { id: "INV-2023-005", client: "Vasile Lungu", email: "vasile.lungu@exemplu.md", amount: 1120.00, date: "01 Mai 2025", status: "Plătită" },
];

export default function InvoicesPage() {
  const [invoices] = useState(initialInvoices);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrare simplificată
  const filteredInvoices = invoices.filter(invoice => 
    invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcul statistici
  const stats = {
    total: { count: invoices.length, amount: invoices.reduce((sum, inv) => sum + inv.amount, 0) },
    paid: { 
      count: invoices.filter(inv => inv.status === "Plătită").length,
      amount: invoices.filter(inv => inv.status === "Plătită").reduce((sum, inv) => sum + inv.amount, 0)
    },
    pending: {
      count: invoices.filter(inv => inv.status === "În așteptare").length,
      amount: invoices.filter(inv => inv.status === "În așteptare").reduce((sum, inv) => sum + inv.amount, 0)
    },
    overdue: {
      count: invoices.filter(inv => inv.status === "Întârziată").length,
      amount: invoices.filter(inv => inv.status === "Întârziată").reduce((sum, inv) => sum + inv.amount, 0)
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">FACTURI</h1>
          <p className="text-gray-400">Gestionează facturile și soldurile</p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded flex items-center">
          <Download size={18} className="mr-2" />EXPORTĂ FACTURI
        </button>
      </div>

      {/* Carduri sumar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Total */}
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <p className="text-gray-400 text-sm">TOTAL FACTURI</p>
          <p className="text-white text-2xl font-bold mt-2">{stats.total.amount.toFixed(2)} MDL</p>
          <div className="mt-4">
            <div className="h-2 bg-blue-600 rounded-full"></div>
            <p className="text-gray-400 text-sm mt-2">{stats.total.count} facturi în total</p>
          </div>
        </div>
        
        {/* Card Plătite */}
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <p className="text-gray-400 text-sm">FACTURAT (PLĂTIT)</p>
          <p className="text-white text-2xl font-bold mt-2">{stats.paid.amount.toFixed(2)} MDL</p>
          <div className="mt-4">
            <div className="h-2 bg-green-600 rounded-full"></div>
            <p className="text-gray-400 text-sm mt-2">{stats.paid.count} facturi plătite</p>
          </div>
        </div>
        
        {/* Card În așteptare */}
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <p className="text-gray-400 text-sm">ÎN AȘTEPTARE</p>
          <p className="text-white text-2xl font-bold mt-2">{stats.pending.amount.toFixed(2)} MDL</p>
          <div className="mt-4">
            <div className="h-2 bg-yellow-600 rounded-full"></div>
            <p className="text-gray-400 text-sm mt-2">{stats.pending.count} facturi în așteptare</p>
          </div>
        </div>
        
        {/* Card Restanțe */}
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <p className="text-gray-400 text-sm">RESTANȚE</p>
          <p className="text-white text-2xl font-bold mt-2">{stats.overdue.amount.toFixed(2)} MDL</p>
          <div className="mt-4">
            <div className="h-2 bg-red-600 rounded-full"></div>
            <p className="text-gray-400 text-sm mt-2">{stats.overdue.count} facturi restante</p>
          </div>
        </div>
      </div>

      {/* Căutare */}
      <div className="bg-dark-800 p-4 rounded-lg">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Caută facturi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-700 text-gray-300 rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* Tabel facturi */}
      <div className="bg-dark-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-white mb-4">Lista facturilor</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-dark-700 rounded-lg">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left text-gray-300">Număr factură</th>
                <th className="py-3 px-4 text-left text-gray-300">Client</th>
                <th className="py-3 px-4 text-left text-gray-300">Email</th>
                <th className="py-3 px-4 text-left text-gray-300">Sumă</th>
                <th className="py-3 px-4 text-left text-gray-300">Data</th>
                <th className="py-3 px-4 text-left text-gray-300">Status</th>
                <th className="py-3 px-4 text-center text-gray-300">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map(invoice => (
                  <tr key={invoice.id} className="border-b border-gray-700 hover:bg-dark-600">
                    <td className="py-3 px-4 text-gray-300">{invoice.id}</td>
                    <td className="py-3 px-4 text-gray-300">{invoice.client}</td>
                    <td className="py-3 px-4 text-gray-300">{invoice.email}</td>
                    <td className="py-3 px-4 text-gray-300">{invoice.amount.toFixed(2)} MDL</td>
                    <td className="py-3 px-4 text-gray-300">{invoice.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs text-white ${
                        invoice.status === "Plătită" ? "bg-green-600" : 
                        invoice.status === "În așteptare" ? "bg-yellow-600" : 
                        "bg-red-600"
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-blue-400 hover:text-blue-300 mx-1"><FileText size={18} /></button>
                      <button className="text-green-400 hover:text-green-300 mx-1"><Download size={18} /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-4 px-4 text-center text-gray-400">
                    Nu s-au găsit facturi care să corespundă căutării.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notificări */}
      <div className="bg-dark-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-white mb-4">Notificări facturi</h2>
        <div className="space-y-4">
          {/* Notificare 1 */}
          <div className="flex items-start p-4 bg-dark-700 rounded-lg">
            <FileText size={20} className="text-blue-400 mr-4" />
            <div>
              <h3 className="text-white font-medium">Factură nouă creată</h3>
              <p className="text-gray-400 text-sm">O nouă factură cu ID-ul INV-2023-006 a fost creată pentru clientul Mihai Cojocaru.</p>
              <p className="text-gray-500 text-xs mt-1">15 mai 2025</p>
            </div>
          </div>
          
          {/* Notificare 2 */}
          <div className="flex items-start p-4 bg-dark-700 rounded-lg">
            <AlertCircle size={20} className="text-red-400 mr-4" />
            <div>
              <h3 className="text-white font-medium">Factură întârziată</h3>
              <p className="text-gray-400 text-sm">Factura INV-2023-004 pentru Cristina Popescu este restantă cu 5 zile.</p>
              <p className="text-gray-500 text-xs mt-1">10 mai 2025</p>
            </div>
          </div>
          
          {/* Notificare 3 */}
          <div className="flex items-start p-4 bg-dark-700 rounded-lg">
            <FileText size={20} className="text-green-400 mr-4" />
            <div>
              <h3 className="text-white font-medium">Factură plătită</h3>
              <p className="text-gray-400 text-sm">Factura INV-2023-001 pentru Marin Constantin a fost marcată ca plătită.</p>
              <p className="text-gray-500 text-xs mt-1">10 mai 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}