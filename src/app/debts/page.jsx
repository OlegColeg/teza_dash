// src/app/debts/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { AlertTriangle, Check, X, DollarSign } from "lucide-react";

export default function DebtsPage() {
  const [data, setData] = useState({ debtors: [], totalDebt: 0 });
  const [loading, setLoading] = useState(true);
  const [payModal, setPayModal] = useState(null); // team object
  const [payForm, setPayForm] = useState({ amount: "", date: new Date().toISOString().split('T')[0], description: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  }

  function load() {
    setLoading(true);
    fetch('/api/debts', { headers: getHeaders() })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openPay(team) {
    setPayModal(team);
    setPayForm({ amount: team.debt, date: new Date().toISOString().split('T')[0], description: `Achitare datorie - ${team.name}` });
    setError("");
  }

  async function handlePay() {
    if (!payForm.amount || !payForm.date) { setError("Suma și data sunt obligatorii"); return; }
    if (Number(payForm.amount) <= 0) { setError("Suma trebuie să fie pozitivă"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch('/api/debts/pay', {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ teamId: payModal.id, amount: Number(payForm.amount), date: payForm.date, description: payForm.description })
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || 'Eroare'); setSaving(false); return; }
      setPayModal(null);
      load();
    } catch { setError('Eroare de rețea'); }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">EVIDENȚA DATORIILOR</h1>
        <p className="text-gray-400">Echipe cu restanțe neachitate</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg flex items-center gap-4">
          <div className="bg-red-600 p-3 rounded-lg"><AlertTriangle size={24} className="text-white" /></div>
          <div>
            <p className="text-gray-400 text-sm">TOTAL DATORII</p>
            <p className="text-red-400 text-2xl font-bold">{(data.totalDebt || 0).toLocaleString()} lei</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg flex items-center gap-4">
          <div className="bg-orange-600 p-3 rounded-lg"><AlertTriangle size={24} className="text-white" /></div>
          <div>
            <p className="text-gray-400 text-sm">ECHIPE CU DATORII</p>
            <p className="text-orange-400 text-2xl font-bold">{data.debtors?.length || 0}</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-lg"><DollarSign size={24} className="text-white" /></div>
          <div>
            <p className="text-gray-400 text-sm">MEDIE PE ECHIPĂ</p>
            <p className="text-blue-400 text-2xl font-bold">
              {data.debtors?.length > 0 ? Math.round(data.totalDebt / data.debtors.length).toLocaleString() : 0} lei
            </p>
          </div>
        </div>
      </div>

      {/* Debtors table */}
      <div className="bg-gray-800 rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-3 px-4 text-left text-gray-300 text-sm">Echipă</th>
              <th className="py-3 px-4 text-left text-gray-300 text-sm">Telefon</th>
              <th className="py-3 px-4 text-right text-gray-300 text-sm">Datorie</th>
              <th className="py-3 px-4 text-center text-gray-300 text-sm">Acțiune</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="py-8 text-center text-gray-400">Se încarcă...</td></tr>
            ) : !data.debtors?.length ? (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Check size={40} className="text-green-400" />
                    <p className="text-green-400 font-medium">Nicio datorie! Toate echipele sunt la zi.</p>
                  </div>
                </td>
              </tr>
            ) : data.debtors.map(team => (
              <tr key={team.id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="py-4 px-4">
                  <p className="text-white font-medium">{team.name}</p>
                </td>
                <td className="py-4 px-4 text-gray-300">{team.phone || '-'}</td>
                <td className="py-4 px-4 text-right">
                  <span className="text-red-400 font-bold text-lg">{team.debt.toLocaleString()} lei</span>
                </td>
                <td className="py-4 px-4 text-center">
                  <button onClick={() => openPay(team)}
                    className="bg-green-700 hover:bg-green-600 text-white px-4 py-1.5 rounded text-sm flex items-center gap-1 mx-auto">
                    <DollarSign size={14} /> Înregistrează Plată
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pay Modal */}
      {payModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-lg font-bold">Înregistrează Plată</h2>
              <button onClick={() => setPayModal(null)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="bg-red-900/30 border border-red-800 rounded p-3 mb-4">
              <p className="text-gray-300 text-sm">Echipa: <span className="text-white font-bold">{payModal.name}</span></p>
              <p className="text-gray-300 text-sm">Datorie totală: <span className="text-red-400 font-bold">{payModal.debt.toLocaleString()} lei</span></p>
            </div>
            {error && <p className="text-red-400 text-sm mb-3 bg-red-900/30 p-2 rounded">{error}</p>}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm block mb-1">Sumă achitată (lei) *</label>
                  <input type="number" value={payForm.amount} onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-400"
                    min="0" max={payModal.debt} />
                </div>
                <div>
                  <label className="text-gray-300 text-sm block mb-1">Data plății *</label>
                  <input type="date" value={payForm.date} onChange={e => setPayForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-400" />
                </div>
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-1">Descriere</label>
                <input type="text" value={payForm.description} onChange={e => setPayForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-400" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handlePay} disabled={saving}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center gap-2 disabled:opacity-50">
                <Check size={16} />{saving ? 'Se procesează...' : 'Confirmă Plata'}
              </button>
              <button onClick={() => setPayModal(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded">Anulează</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
