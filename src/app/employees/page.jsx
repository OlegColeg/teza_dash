"use client";
import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, Users, DollarSign, UserCheck, Search } from "lucide-react";

const ROLES = [
  { value: "administrator", label: "Administrator" },
  { value: "casier", label: "Casier" },
  { value: "ingrijitor", label: "Îngrijitor Teren" },
  { value: "antrenor", label: "Antrenor" },
  { value: "paznic", label: "Paznic / Gardă" },
  { value: "tehnic", label: "Personal Tehnic" },
  { value: "altul", label: "Altul" },
];

const EMPTY_FORM = { name: "", role: "ingrijitor", phone: "", email: "", salary: "", hiredAt: new Date().toISOString().split("T")[0], status: "active", notes: "" };

export default function EmployeesPage() {
  const [data, setData] = useState({ employees: [], summary: { total: 0, active: 0, totalSalary: 0 } });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  function getHeaders() {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
    return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  }

  function load() {
    setLoading(true);
    fetch("/api/employees", { headers: getHeaders() })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const filtered = (data.employees || [])
    .filter(e => filterStatus === "all" || e.status === filterStatus)
    .filter(e => {
      if (!search) return true;
      const s = search.toLowerCase();
      return e.name.toLowerCase().includes(s) || e.role.toLowerCase().includes(s) || (e.phone || "").includes(s);
    });

  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  }

  function openEdit(emp) {
    setEditId(emp.id);
    setForm({ name: emp.name, role: emp.role, phone: emp.phone || "", email: emp.email || "", salary: emp.salary?.toString() || "", hiredAt: emp.hiredAt, status: emp.status, notes: emp.notes || "" });
    setError("");
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.role || !form.hiredAt) { setError("Completează câmpurile obligatorii"); return; }
    setSaving(true); setError("");
    const url = editId ? `/api/employees/${editId}` : "/api/employees";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify({ ...form, salary: Number(form.salary) || 0 }) });
    const json = await res.json();
    if (!res.ok) { setError(json.error || "Eroare la salvare"); setSaving(false); return; }
    setShowModal(false);
    load();
    setSaving(false);
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/employees/${id}`, { method: "DELETE", headers: getHeaders() });
    if (res.ok) { setDeleteConfirm(null); load(); }
  }

  const roleLabel = (r) => ROLES.find(x => x.value === r)?.label || r;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Angajați</h1>
          <p className="text-gray-400 text-sm mt-1">Gestionarea personalului stadionului</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Adaugă Angajat
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Angajați", value: loading ? "..." : data.summary?.total ?? 0, icon: <Users size={18} />, color: "bg-blue-900 text-blue-400" },
          { label: "Angajați Activi", value: loading ? "..." : data.summary?.active ?? 0, icon: <UserCheck size={18} />, color: "bg-teal-900 text-teal-400" },
          { label: "Fond Salarii/Lună", value: loading ? "..." : `${(data.summary?.totalSalary ?? 0).toLocaleString("ro-RO")} MDL`, icon: <DollarSign size={18} />, color: "bg-purple-900 text-purple-400" },
        ].map((c, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-5 border border-gray-700 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${c.color}`}>{c.icon}</div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">{c.label}</p>
              <p className="text-xl font-bold text-white">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Caută după nume, rol, telefon..." className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500" />
        </div>
        <div className="flex gap-2">
          {[["all", "Toți"], ["active", "Activi"], ["inactive", "Inactivi"]].map(([val, lbl]) => (
            <button key={val} onClick={() => setFilterStatus(val)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === val ? "bg-teal-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"}`}>{lbl}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">Se încarcă...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400">Nu există angajați înregistrați</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Nume</th>
                  <th className="text-left px-4 py-3">Rol</th>
                  <th className="text-left px-4 py-3">Telefon</th>
                  <th className="text-left px-4 py-3">Salariu</th>
                  <th className="text-left px-4 py-3">Angajat din</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => (
                  <tr key={emp.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">{emp.name}</p>
                          {emp.email && <p className="text-xs text-gray-400">{emp.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{roleLabel(emp.role)}</td>
                    <td className="px-4 py-3 text-gray-300">{emp.phone || "—"}</td>
                    <td className="px-4 py-3 text-teal-400 font-medium">{emp.salary ? `${emp.salary.toLocaleString("ro-RO")} MDL` : "—"}</td>
                    <td className="px-4 py-3 text-gray-300">{emp.hiredAt}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${emp.status === "active" ? "bg-teal-900 text-teal-300" : "bg-gray-700 text-gray-400"}`}>
                        {emp.status === "active" ? "Activ" : "Inactiv"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(emp)} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => setDeleteConfirm(emp)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-700">
              <h2 className="text-base font-semibold text-white">{editId ? "Editează Angajat" : "Angajat Nou"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm px-3 py-2 rounded-lg">{error}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">Nume complet *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500" placeholder="Ion Popescu" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Rol *</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500">
                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500">
                    <option value="active">Activ</option>
                    <option value="inactive">Inactiv</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Telefon</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500" placeholder="+373 ..." />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500" placeholder="email@exemplu.com" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Salariu lunar (MDL)</label>
                  <input type="number" min="0" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Angajat din *</label>
                  <input type="date" value={form.hiredAt} onChange={e => setForm(f => ({ ...f, hiredAt: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">Observații</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500 resize-none" placeholder="Note adiționale..." />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-700">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Anulează</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={15} />}
                {editId ? "Salvează" : "Adaugă"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-sm shadow-2xl p-6 text-center">
            <div className="w-12 h-12 bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-400" /></div>
            <h3 className="text-white font-semibold mb-2">Șterge angajat?</h3>
            <p className="text-gray-400 text-sm mb-5">Ești sigur că vrei să ștergi <span className="text-white font-medium">{deleteConfirm.name}</span>? Acțiunea nu poate fi anulată.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors">Anulează</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">Șterge</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
