// src/app/dashboard/team/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { Search, UserPlus, Edit, Trash2, X, Check } from "lucide-react";

export default function ManageTeam() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTeam, setEditTeam] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  }

  function loadTeams() {
    setLoading(true);
    fetch('/api/teams', { headers: getHeaders() })
      .then(r => r.json())
      .then(data => { setTeams(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { loadTeams(); }, []);

  const filtered = teams.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.phone && t.phone.includes(search))
  );

  function openAdd() {
    setEditTeam(null);
    setForm({ name: "", phone: "" });
    setError("");
    setShowModal(true);
  }

  function openEdit(team) {
    setEditTeam(team);
    setForm({ name: team.name, phone: team.phone });
    setError("");
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name.trim()) { setError("Numele echipei este obligatoriu"); return; }
    setSaving(true);
    setError("");
    try {
      const url = editTeam ? `/api/teams/${editTeam.id}` : '/api/teams';
      const method = editTeam ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Eroare la salvare'); setSaving(false); return; }
      setShowModal(false);
      loadTeams();
    } catch { setError('Eroare de rețea'); }
    setSaving(false);
  }

  async function handleDelete(team) {
    if (!confirm(`Ștergi echipa "${team.name}"?`)) return;
    const res = await fetch(`/api/teams/${team.id}`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) loadTeams();
  }

  const totalDebt = teams.reduce((s, t) => s + Math.abs(Math.min(t.balance, 0)), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white">GESTIONARE ECHIPE</h1>
          <p className="text-gray-400">Echipe de fotbal înregistrate la stadion</p>
        </div>
        <button onClick={openAdd} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded flex items-center gap-2">
          <UserPlus size={18} /> ADAUGĂ ECHIPĂ
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-gray-400 text-xs uppercase">Total Echipe</p>
          <p className="text-white text-2xl font-bold">{teams.length}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-gray-400 text-xs uppercase">Cu Datorii</p>
          <p className="text-red-400 text-2xl font-bold">{teams.filter(t => t.balance < 0).length}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-gray-400 text-xs uppercase">Fără Datorii</p>
          <p className="text-green-400 text-2xl font-bold">{teams.filter(t => t.balance >= 0).length}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-gray-400 text-xs uppercase">Total Datorii</p>
          <p className="text-red-400 text-2xl font-bold">{totalDebt.toLocaleString()} lei</p>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="relative w-full md:w-96">
          <input type="text" placeholder="Caută echipă..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-700 text-gray-300 rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400" />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-3 px-4 text-left text-gray-300 text-sm">Echipă</th>
              <th className="py-3 px-4 text-left text-gray-300 text-sm">Telefon</th>
              <th className="py-3 px-4 text-left text-gray-300 text-sm">Balanță</th>
              <th className="py-3 px-4 text-left text-gray-300 text-sm">Înregistrat</th>
              <th className="py-3 px-4 text-center text-gray-300 text-sm">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-gray-400">Se încarcă...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-gray-400">Nicio echipă găsită</td></tr>
            ) : filtered.map(team => (
              <tr key={team.id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="py-3 px-4 text-white font-medium">{team.name}</td>
                <td className="py-3 px-4 text-gray-300">{team.phone || '-'}</td>
                <td className="py-3 px-4">
                  <span className={`font-bold ${team.balance < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {team.balance < 0 ? `-${Math.abs(team.balance).toLocaleString()}` : '0'} lei
                  </span>
                  {team.balance < 0 && (
                    <span className="ml-2 text-xs bg-red-900 text-red-300 px-2 py-0.5 rounded-full">datorii</span>
                  )}
                </td>
                <td className="py-3 px-4 text-gray-400 text-sm">
                  {new Date(team.createdAt).toLocaleDateString('ro-RO')}
                </td>
                <td className="py-3 px-4 text-center">
                  <button onClick={() => openEdit(team)} className="text-blue-400 hover:text-blue-300 mx-1"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(team)} className="text-red-400 hover:text-red-300 mx-1"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-lg font-bold">{editTeam ? 'Editează Echipa' : 'Adaugă Echipă Nouă'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            {error && <p className="text-red-400 text-sm mb-3 bg-red-900/30 p-2 rounded">{error}</p>}
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm block mb-1">Numele Echipei *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  placeholder="ex: FC Vulturii" />
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-1">Telefon (căpitan)</label>
                <input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  placeholder="+373 79 000 000" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded flex items-center justify-center gap-2 disabled:opacity-50">
                <Check size={16} />{saving ? 'Se salvează...' : 'Salvează'}
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded">Anulează</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
