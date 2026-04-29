// src/app/finances/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, X, Check, TrendingUp, TrendingDown, DollarSign, Search, Upload, FileText, AlertCircle, SlidersHorizontal, ChevronDown } from "lucide-react";

const CATEGORIES_INCOME = [
  { value: "chirie_teren", label: "Chirie Teren" },
  { value: "achitare_datorie", label: "Achitare Datorie" },
  { value: "altele", label: "Altele" },
];
const CATEGORIES_EXPENSE = [
  { value: "salariu", label: "Salariu Personal" },
  { value: "electricitate", label: "Electricitate" },
  { value: "mentenanta", label: "Mentenanță Gazon" },
  { value: "curatenie", label: "Curățenie" },
  { value: "reparatii", label: "Reparații" },
  { value: "achizitii", label: "Achiziții / Cumpărături" },
  { value: "imprumut", label: "Împrumut" },
  { value: "altele", label: "Altele" },
];

function catLabel(cat) {
  return [...CATEGORIES_INCOME, ...CATEGORIES_EXPENSE].find(c => c.value === cat)?.label || cat;
}

export default function FinancesPage() {
  const [data, setData] = useState({ transactions: [], summary: { income: 0, expense: 0, balance: 0 } });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    type: "income",
    category: "chirie_teren",
    client: "",
    description: "",
    notes: "",
    amount: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [deletingMulti, setDeletingMulti] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importType, setImportType] = useState('income');
  const [importResult, setImportResult] = useState(null);
  const [importing, setImporting] = useState(false);
  const importFileRef = React.useRef(null);
  // Advanced filters
  const [teamsList, setTeamsList] = useState([]);
  const [filterTeam, setFilterTeam] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterAmtMin, setFilterAmtMin] = useState('');
  const [filterAmtMax, setFilterAmtMax] = useState('');
  const [showAdvFilters, setShowAdvFilters] = useState(false);

  // ── Datorii BLL state ──────────────────────────────────────────────────────
  const [loans, setLoans] = useState([]);
  const [loansSummary, setLoansSummary] = useState({ totalAmount: 0, totalRestituit: 0, totalRamas: 0 });
  const [loansLoading, setLoansLoading] = useState(true);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null); // null = new, object = edit
  const [loanForm, setLoanForm] = useState({ denumire: '', date: new Date().toISOString().split('T')[0], amount: '', notes: '', restituit: '0' });
  const [loanError, setLoanError] = useState('');
  const [savingLoan, setSavingLoan] = useState(false);
  const [deletingLoanId, setDeletingLoanId] = useState(null);
  const [showLoanImport, setShowLoanImport] = useState(false);
  const [loanImportResult, setLoanImportResult] = useState(null);
  const [importingLoan, setImportingLoan] = useState(false);
  const loanImportFileRef = React.useRef(null);

  function getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  }

  function load() {
    setLoading(true);
    setSelected(new Set());
    fetch('/api/finances', { headers: getHeaders() })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }

  function loadLoans() {
    setLoansLoading(true);
    fetch('/api/loans', { headers: getHeaders() })
      .then(r => r.json())
      .then(d => { setLoans(d.loans || []); setLoansSummary(d.summary || { totalAmount: 0, totalRestituit: 0, totalRamas: 0 }); setLoansLoading(false); })
      .catch(() => setLoansLoading(false));
  }

  useEffect(() => { load(); loadLoans(); }, []);

  useEffect(() => {
    fetch('/api/teams', { headers: getHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(d => setTeamsList(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const activeFiltersCount = [filterTeam, filterCategory, filterDateFrom, filterDateTo, filterAmtMin, filterAmtMax].filter(Boolean).length;

  const filtered = data.transactions
    .filter(t => filter === 'all' || t.type === filter)
    .filter(t => {
      if (!filterTeam) return true;
      const team = teamsList.find(tm => tm.id === filterTeam);
      return t.teamId === filterTeam || (t.client || '').toLowerCase().includes((team?.name || '').toLowerCase());
    })
    .filter(t => !filterCategory || t.category === filterCategory)
    .filter(t => !filterDateFrom || t.date >= filterDateFrom)
    .filter(t => !filterDateTo || t.date <= filterDateTo)
    .filter(t => !filterAmtMin || t.amount >= Number(filterAmtMin))
    .filter(t => !filterAmtMax || t.amount <= Number(filterAmtMax))
    .filter(t => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (t.client || '').toLowerCase().includes(s) ||
        (t.description || '').toLowerCase().includes(s) ||
        (t.notes || '').toLowerCase().includes(s);
    });

  function openModal(type = "income") {
    setForm({
      type,
      category: type === 'income' ? 'chirie_teren' : 'salariu',
      client: "", description: "", notes: "", amount: "",
      date: new Date().toISOString().split('T')[0]
    });
    setError("");
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.amount || !form.date) { setError("Suma și data sunt obligatorii"); return; }
    if (Number(form.amount) <= 0) { setError("Suma trebuie să fie pozitivă"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch('/api/finances', { method: 'POST', headers: getHeaders(), body: JSON.stringify(form) });
      const d = await res.json();
      if (!res.ok) { setError(d.error || 'Eroare'); setSaving(false); return; }
      setShowModal(false);
      load();
    } catch { setError('Eroare de rețea'); }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm('Ștergi această tranzacție?')) return;
    const res = await fetch(`/api/finances/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) load();
  }

  async function handleDeleteSelected() {
    if (selected.size === 0) return;
    if (!confirm(`Ștergi ${selected.size} tranzacții selectate?`)) return;
    setDeletingMulti(true);
    await Promise.all([...selected].map(id =>
      fetch(`/api/finances/${id}`, { method: 'DELETE', headers: getHeaders() })
    ));
    setSelected(new Set());
    setDeletingMulti(false);
    load();
  }

  // ── Datorii BLL handlers ───────────────────────────────────────────────────
  function openLoanModal(loan = null) {
    setEditingLoan(loan);
    setLoanForm(loan
      ? { denumire: loan.denumire, date: loan.date, amount: String(loan.amount), notes: loan.notes || '', restituit: String(loan.restituit) }
      : { denumire: '', date: new Date().toISOString().split('T')[0], amount: '', notes: '', restituit: '0' }
    );
    setLoanError('');
    setShowLoanModal(true);
  }

  async function handleSaveLoan() {
    if (!loanForm.denumire.trim()) { setLoanError('Denumirea este obligatorie'); return; }
    if (!loanForm.date) { setLoanError('Data este obligatorie'); return; }
    if (!loanForm.amount || Number(loanForm.amount) <= 0) { setLoanError('Suma trebuie să fie pozitivă'); return; }
    setSavingLoan(true); setLoanError('');
    try {
      const url = editingLoan ? `/api/loans/${editingLoan.id}` : '/api/loans';
      const method = editingLoan ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(loanForm) });
      const d = await res.json();
      if (!res.ok) { setLoanError(d.error || 'Eroare'); setSavingLoan(false); return; }
      setShowLoanModal(false);
      loadLoans();
    } catch { setLoanError('Eroare de rețea'); }
    setSavingLoan(false);
  }

  async function handleDeleteLoan(id) {
    if (!confirm('Ștergi acest împrumut?')) return;
    setDeletingLoanId(id);
    await fetch(`/api/loans/${id}`, { method: 'DELETE', headers: getHeaders() });
    setDeletingLoanId(null);
    loadLoans();
  }

  async function handleLoanImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportingLoan(true); setLoanImportResult(null);
    const text = await file.text();
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    const rows = lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const obj = {};
      headers.forEach((h, i) => { obj[h] = vals[i] || ''; });
      return obj;
    }).filter(r => Object.values(r).some(Boolean));
    try {
      const res = await fetch('/api/loans/import', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ rows }) });
      const d = await res.json();
      setLoanImportResult(d);
      if (!d.error) loadLoans();
    } catch { setLoanImportResult({ error: 'Eroare de rețea' }); }
    setImportingLoan(false);
    if (loanImportFileRef.current) loanImportFileRef.current.value = '';
  }

  function toggleSelect(id) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === filtered.length && filtered.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(t => t.id)));
    }
  }

  // Total datorii neachitate (teams with negative balance)
  const [totalDebt, setTotalDebt] = useState(0);
  useEffect(() => {
    fetch('/api/debts', { headers: getHeaders() })
      .then(r => r.json()).then(d => setTotalDebt(d.totalDebt || 0)).catch(() => {});
  }, [data]);

  const balanceWithDebt = data.summary.balance - totalDebt;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">FINANȚE</h1>
          <p className="text-gray-400">Evidența completă a încasărilor și cheltuielilor</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => openModal('income')}
            className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 text-sm">
            <Plus size={16} /> ÎNCASARE
          </button>
          <button onClick={() => openModal('expense')}
            className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 text-sm">
            <Plus size={16} /> CHELTUIALĂ
          </button>
          <button onClick={() => { setShowImport(true); setImportResult(null); }}
            className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 text-sm">
            <Upload size={16} /> IMPORT CSV
          </button>
        </div>
      </div>

      {/* Summary cards — exact logica din Excel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-5 rounded-lg border-l-4 border-green-500">
          <p className="text-gray-400 text-xs uppercase tracking-wide">Total Încasări</p>
          <p className="text-green-400 text-2xl font-bold mt-1">{data.summary.income.toLocaleString()} lei</p>
          <p className="text-gray-500 text-xs mt-1">Bani intrați în casă</p>
        </div>
        <div className="bg-gray-800 p-5 rounded-lg border-l-4 border-red-500">
          <p className="text-gray-400 text-xs uppercase tracking-wide">Total Cheltuieli</p>
          <p className="text-red-400 text-2xl font-bold mt-1">{data.summary.expense.toLocaleString()} lei</p>
          <p className="text-gray-500 text-xs mt-1">Salariu + facturi + altele</p>
        </div>
        <div className={`bg-gray-800 p-5 rounded-lg border-l-4 ${data.summary.balance >= 0 ? 'border-teal-500' : 'border-red-500'}`}>
          <p className="text-gray-400 text-xs uppercase tracking-wide">Bani în Casă</p>
          <p className={`text-2xl font-bold mt-1 ${data.summary.balance >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
            {data.summary.balance.toLocaleString()} lei
          </p>
          <p className="text-gray-500 text-xs mt-1">Încasări − Cheltuieli</p>
        </div>
        <div className={`bg-gray-800 p-5 rounded-lg border-l-4 ${balanceWithDebt >= 0 ? 'border-blue-500' : 'border-orange-500'}`}>
          <p className="text-gray-400 text-xs uppercase tracking-wide">Casă − Datorii</p>
          <p className={`text-2xl font-bold mt-1 ${balanceWithDebt >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
            {balanceWithDebt.toLocaleString()} lei
          </p>
          <p className="text-gray-500 text-xs mt-1">Dacă toți ar achita acum</p>
        </div>
      </div>

      {/* Verification banner — exact ca în Excel */}
      <div className={`rounded-lg p-4 flex items-center justify-between flex-wrap gap-2 ${data.summary.balance >= 0 ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{data.summary.balance >= 0 ? '✅' : '❌'}</span>
          <div>
            <p className="text-white font-semibold">
              {data.summary.balance >= 0
                ? `Balanță pozitivă — ${data.summary.balance.toLocaleString()} lei disponibili`
                : `DEFICIT — lipsesc ${Math.abs(data.summary.balance).toLocaleString()} lei`}
            </p>
            <p className="text-gray-400 text-sm">
              Datorii neachitate de echipe: <span className="text-red-300 font-bold">{totalDebt.toLocaleString()} lei</span>
              {' · '}
              Dacă se achită toate: <span className={`font-bold ${balanceWithDebt >= 0 ? 'text-green-300' : 'text-red-300'}`}>{balanceWithDebt.toLocaleString()} lei</span>
            </p>
          </div>
        </div>
        <a href="/cash-calculator" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm">
          🧮 Calculator Bancnote
        </a>
      </div>

      {/* Filters + Search */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex gap-1.5 flex-wrap">
            {[['all', 'Toate'], ['income', '💚 Încasări'], ['expense', '🔴 Cheltuieli']].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)}
                className={`px-3 py-2 rounded text-sm font-medium transition ${filter === val ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-40">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Caută client, descriere..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-800 text-gray-300 rounded pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400" />
          </div>
          <button onClick={() => setShowAdvFilters(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm transition whitespace-nowrap ${showAdvFilters || activeFiltersCount > 0 ? 'bg-teal-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            <SlidersHorizontal size={14} />
            Filtre
            {activeFiltersCount > 0 && <span className="bg-teal-400 text-gray-900 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{activeFiltersCount}</span>}
            <ChevronDown size={12} className={`transition-transform ${showAdvFilters ? 'rotate-180' : ''}`} />
          </button>
          <span className="text-gray-500 text-sm whitespace-nowrap">{filtered.length} înreg.</span>
        </div>

        {showAdvFilters && (
          <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="col-span-2 sm:col-span-1 lg:col-span-2">
                <label className="text-xs text-gray-400 block mb-1">Echipă / Client</label>
                <select value={filterTeam} onChange={e => setFilterTeam(e.target.value)}
                  className="w-full bg-gray-700 text-gray-200 text-sm rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-400">
                  <option value="">Toate echipele</option>
                  {teamsList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Categorie</label>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                  className="w-full bg-gray-700 text-gray-200 text-sm rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-400">
                  <option value="">Toate</option>
                  <optgroup label="Încasări">
                    {CATEGORIES_INCOME.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </optgroup>
                  <optgroup label="Cheltuieli">
                    {CATEGORIES_EXPENSE.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Data de la</label>
                <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)}
                  className="w-full bg-gray-700 text-gray-200 text-sm rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-400" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Data până la</label>
                <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)}
                  className="w-full bg-gray-700 text-gray-200 text-sm rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-400" />
              </div>
              <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Sumă min</label>
                  <input type="number" value={filterAmtMin} onChange={e => setFilterAmtMin(e.target.value)}
                    placeholder="0" min="0"
                    className="w-full bg-gray-700 text-gray-200 text-sm rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Sumă max</label>
                  <input type="number" value={filterAmtMax} onChange={e => setFilterAmtMax(e.target.value)}
                    placeholder="∞" min="0"
                    className="w-full bg-gray-700 text-gray-200 text-sm rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-400" />
                </div>
              </div>
            </div>
            {activeFiltersCount > 0 && (
              <button onClick={() => { setFilterTeam(''); setFilterCategory(''); setFilterDateFrom(''); setFilterDateTo(''); setFilterAmtMin(''); setFilterAmtMax(''); }}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                <X size={12} /> Resetează filtrele ({activeFiltersCount} active)
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between bg-red-900/30 border border-red-700 rounded-lg px-4 py-2.5">
          <span className="text-red-300 text-sm font-medium">{selected.size} tranzacții selectate</span>
          <div className="flex gap-2">
            <button onClick={() => setSelected(new Set())} className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded hover:bg-gray-700 transition">Deselectează</button>
            <button onClick={handleDeleteSelected} disabled={deletingMulti}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded transition disabled:opacity-50">
              <Trash2 size={13} /> {deletingMulti ? 'Se șterg...' : `Șterge ${selected.size} selectate`}
            </button>
          </div>
        </div>
      )}

      {/* Table — like Excel layout */}
      <div className="bg-gray-800 rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-900/50">
              <th className="py-3 px-3 text-center w-8">
                <input type="checkbox"
                  checked={filtered.length > 0 && selected.size === filtered.length}
                  onChange={toggleSelectAll}
                  className="accent-teal-500 cursor-pointer w-3.5 h-3.5"
                />
              </th>
              <th className="py-3 px-3 text-left text-gray-400 font-medium w-24">Data</th>
              <th className="py-3 px-3 text-left text-gray-400 font-medium">Client / Denumire</th>
              <th className="py-3 px-3 text-left text-gray-400 font-medium">Categorie</th>
              <th className="py-3 px-3 text-left text-gray-400 font-medium">Descriere / Observații</th>
              <th className="py-3 px-3 text-right text-gray-400 font-medium w-32">Sumă</th>
              <th className="py-3 px-3 text-center text-gray-400 font-medium w-10"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-gray-400">Se încarcă...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-8 text-center text-gray-400">Nicio tranzacție</td></tr>
            ) : filtered.map(t => (
              <tr key={t.id} className={`border-b border-gray-700/50 hover:bg-gray-700/50 transition-colors ${selected.has(t.id) ? 'bg-teal-900/20' : t.type !== 'income' ? 'bg-red-900/10' : ''}`}>
                <td className="py-2.5 px-3 text-center">
                  <input type="checkbox"
                    checked={selected.has(t.id)}
                    onChange={() => toggleSelect(t.id)}
                    className="accent-teal-500 cursor-pointer w-3.5 h-3.5"
                  />
                </td>
                <td className="py-2.5 px-3 text-gray-400 text-xs whitespace-nowrap">
                  {new Date(t.date + 'T12:00:00').toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-white font-medium">{t.client || t.description || '—'}</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${t.type === 'income' ? 'bg-green-900/60 text-green-300' : 'bg-red-900/60 text-red-300'}`}>
                    {catLabel(t.category)}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-gray-400 text-xs">{t.notes || t.description || '—'}</td>
                <td className={`py-2.5 px-3 text-right font-bold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {t.type === 'income' ? '+' : '−'}{t.amount.toLocaleString()} lei
                </td>
                <td className="py-2.5 px-3 text-center">
                  <button onClick={() => handleDelete(t.id)} className="text-gray-600 hover:text-red-400 transition">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {filtered.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-gray-600 bg-gray-900/50">
                <td />
                <td colSpan={4} className="py-3 px-3 text-gray-400 text-sm font-medium">
                  Total filtrat ({filtered.length} înreg.)
                </td>
                <td className="py-3 px-3 text-right font-bold text-white">
                  {(() => {
                    const inc = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
                    const exp = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
                    const net = inc - exp;
                    return <span className={net >= 0 ? 'text-green-400' : 'text-red-400'}>{net >= 0 ? '+' : ''}{net.toLocaleString()} lei</span>;
                  })()}
                </td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-lg font-bold">
                {form.type === 'income' ? '💚 Adaugă Încasare' : '🔴 Adaugă Cheltuială'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            {/* Type toggle */}
            <div className="flex gap-2 mb-4">
              <button onClick={() => setForm(f => ({ ...f, type: 'income', category: 'chirie_teren' }))}
                className={`flex-1 py-2 rounded text-sm font-medium transition ${form.type === 'income' ? 'bg-green-700 text-white' : 'bg-gray-700 text-gray-400'}`}>
                💚 Încasare
              </button>
              <button onClick={() => setForm(f => ({ ...f, type: 'expense', category: 'salariu' }))}
                className={`flex-1 py-2 rounded text-sm font-medium transition ${form.type === 'expense' ? 'bg-red-700 text-white' : 'bg-gray-700 text-gray-400'}`}>
                🔴 Cheltuială
              </button>
            </div>

            {error && <p className="text-red-400 text-sm mb-3 bg-red-900/30 p-2 rounded">{error}</p>}

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Categorie</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400">
                    {(form.type === 'income' ? CATEGORIES_INCOME : CATEGORIES_EXPENSE).map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Data *</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400" />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-xs block mb-1">
                  {form.type === 'income' ? 'Client / Echipă' : 'Denumire (ex: Oală Oleg Salariu, Electricitate...)'}
                </label>
                <input type="text" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
                  placeholder={form.type === 'income' ? 'ex: Gajula, Arcadii, Liviu...' : 'ex: Oală Oleg Salariu Martie'} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Sumă (lei) *</label>
                  <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
                    min="0" step="1" placeholder="ex: 500" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Observații</label>
                  <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
                    placeholder="ex: cec, restituit..." />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={handleSave} disabled={saving}
                className={`flex-1 text-white py-2.5 rounded flex items-center justify-center gap-2 disabled:opacity-50 font-medium ${form.type === 'income' ? 'bg-green-700 hover:bg-green-600' : 'bg-red-700 hover:bg-red-600'}`}>
                <Check size={16} />{saving ? 'Se salvează...' : 'Salvează'}
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded">Anulează</button>
            </div>
          </div>
        </div>
      )}
      {/* Import CSV Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-700">
              <h2 className="text-white font-semibold flex items-center gap-2"><Upload size={18} /> Import Date din CSV / TXT</h2>
              <button onClick={() => setShowImport(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Tip */}
              <div className="flex gap-2">
                {[['income','💚 Venituri (Încasări)'],['expense','🔴 Cheltuieli']].map(([val,lbl]) => (
                  <button key={val} onClick={() => setImportType(val)}
                    className={`flex-1 py-2 rounded text-sm font-medium transition ${importType === val ? (val==='income' ? 'bg-green-700 text-white' : 'bg-red-700 text-white') : 'bg-gray-700 text-gray-400 hover:text-white'}`}>
                    {lbl}
                  </button>
                ))}
              </div>

              {/* Format instructions */}
              <div className="bg-gray-900 rounded-lg p-4 text-xs text-gray-400 space-y-2">
                <div className="flex items-start gap-2">
                  <FileText size={14} className="text-teal-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-200 font-medium mb-1">Format CSV (separator: virgulă sau punct-virgulă):</p>
                    {importType === 'income' ? (
                      <>
                        <p className="font-mono bg-gray-800 px-2 py-1 rounded text-green-300">echipa,data,suma,observatii</p>
                        <p className="mt-1">Exemplu:</p>
                        <p className="font-mono bg-gray-800 px-2 py-1 rounded text-gray-300">FC Vulturii,2026-04-01,500,achitat cash<br />Arcadii Team,2026-04-05,300,</p>
                      </>
                    ) : (
                      <>
                        <p className="font-mono bg-gray-800 px-2 py-1 rounded text-red-300">denumire,data,suma,categorie,observatii</p>
                        <p className="mt-1">Categorii: <span className="text-teal-300">salariu, electricitate, mentenanta, curatenie, reparatii, achizitii, imprumut, altele</span></p>
                        <p className="font-mono bg-gray-800 px-2 py-1 rounded text-gray-300">Oală Oleg Salariu,2026-04-05,3000,salariu,<br />Electricitate Aprilie,2026-04-10,850,electricitate,factura nr 123</p>
                      </>
                    )}
                    <p className="mt-1 text-yellow-400">⚠ Data obligatorie în format: YYYY-MM-DD</p>
                  </div>
                </div>
              </div>

              {/* File upload */}
              <div>
                <label className="block text-xs text-gray-400 mb-2">Selectează fișier CSV sau TXT:</label>
                <input
                  ref={importFileRef}
                  type="file"
                  accept=".csv,.txt"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setImporting(true); setImportResult(null);
                    const text = await file.text();
                    const lines = text.split(/\r?\n/).filter(l => l.trim());
                    const sep = lines[0]?.includes(';') ? ';' : ',';
                    // Skip header row if first col is non-numeric text like 'echipa'/'denumire'
                    const dataLines = /^[a-zA-Z\s]+$/.test(lines[0]?.split(sep)[0]?.trim()) ? lines.slice(1) : lines;
                    const rows = dataLines.map(line => {
                      const cols = line.split(sep).map(c => c.trim().replace(/^"|"$/g, ''));
                      if (importType === 'income') {
                        return { echipa: cols[0], data: cols[1], suma: cols[2], observatii: cols[3] || '' };
                      } else {
                        return { denumire: cols[0], data: cols[1], suma: cols[2], categorie: cols[3] || 'altele', observatii: cols[4] || '' };
                      }
                    }).filter(r => r.suma || r.echipa || r.denumire);
                    if (rows.length === 0) { setImportResult({ error: 'Fișierul este gol sau formatul e incorect' }); setImporting(false); return; }
                    const token = localStorage.getItem('token');
                    const res = await fetch('/api/finances/import', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                      body: JSON.stringify({ type: importType, rows })
                    });
                    const result = await res.json();
                    setImportResult(result);
                    setImporting(false);
                    if ((result.created || 0) > 0) load();
                    if (importFileRef.current) importFileRef.current.value = '';
                  }}
                  className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-teal-700 file:text-white hover:file:bg-teal-600 cursor-pointer"
                />
              </div>

              {/* Result */}
              {importing && <div className="text-center text-gray-400 text-sm py-2">Se importă datele...</div>}
              {importResult && !importResult.error && (
                <div className="space-y-2">
                  <div className="bg-green-900/30 border border-green-700 rounded-lg px-4 py-3 text-sm">
                    <p className="text-green-300 font-medium">✅ Importate cu succes: <strong>{importResult.created}</strong> înregistrări</p>
                    {importResult.teamsCreated?.length > 0 && (
                      <p className="text-teal-300 text-xs mt-1">
                        🆕 Echipe noi create automat: <strong>{importResult.teamsCreated.join(', ')}</strong>
                      </p>
                    )}
                  </div>
                  {importResult.errors?.length > 0 && (
                    <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg px-4 py-3 text-sm">
                      <p className="text-yellow-300 font-medium flex items-center gap-1 mb-2"><AlertCircle size={14} /> Erori ({importResult.errors.length}):</p>
                      <ul className="space-y-1">{importResult.errors.map((e, i) => <li key={i} className="text-yellow-400 text-xs">{e}</li>)}</ul>
                    </div>
                  )}
                </div>
              )}
              {importResult?.error && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 text-sm text-red-300">{importResult.error}</div>
              )}
            </div>
            <div className="flex justify-end px-5 py-4 border-t border-gray-700">
              <button onClick={() => setShowImport(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">Închide</button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* DATORII / ÎMPRUMUTURI                                                */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <div className="border-t-2 border-amber-700/50 pt-6">
        {/* Section header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-amber-400">DATORII / ÎMPRUMUTURI</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowLoanImport(true); setLoanImportResult(null); }}
              className="flex items-center gap-2 px-3 py-2 bg-amber-900/40 hover:bg-amber-800/50 border border-amber-700/50 text-amber-300 rounded-lg text-sm transition-colors"
            >
              <Upload size={14} /> Import CSV
            </button>
            <button
              onClick={() => openLoanModal()}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Adaugă Împrumut
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-xs text-gray-400 mb-1">Total împrumutat</p>
            <p className="text-2xl font-bold text-amber-400">{loansSummary.totalAmount.toLocaleString('ro-MD', { minimumFractionDigits: 2 })} L</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-xs text-gray-400 mb-1">Total restituit</p>
            <p className="text-2xl font-bold text-green-400">{loansSummary.totalRestituit.toLocaleString('ro-MD', { minimumFractionDigits: 2 })} L</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-amber-700/50">
            <p className="text-xs text-gray-400 mb-1">Rămâne de restituit</p>
            <p className="text-2xl font-bold text-red-400">{loansSummary.totalRamas.toLocaleString('ro-MD', { minimumFractionDigits: 2 })} L</p>
          </div>
        </div>

        {/* Loans table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          {loansLoading ? (
            <div className="p-8 text-center text-gray-500 text-sm">Se încarcă împrumuturile...</div>
          ) : loans.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">Nu există împrumuturi înregistrate.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-750">
                    <th className="text-left px-4 py-3 text-amber-400 font-semibold">Denumire</th>
                    <th className="text-left px-4 py-3 text-amber-400 font-semibold">Data</th>
                    <th className="text-right px-4 py-3 text-amber-400 font-semibold">Sumă</th>
                    <th className="text-left px-4 py-3 text-amber-400 font-semibold hidden md:table-cell">Obiecții</th>
                    <th className="text-right px-4 py-3 text-amber-400 font-semibold">Restituit</th>
                    <th className="text-right px-4 py-3 text-amber-400 font-semibold">Mai Trebuie</th>
                    <th className="px-4 py-3 text-amber-400 font-semibold text-right">Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan, idx) => {
                    const ramas = Math.max(0, loan.amount - loan.restituit);
                    return (
                      <tr key={loan.id} className={`border-b border-gray-700/50 hover:bg-gray-750/60 transition-colors ${idx % 2 === 0 ? '' : 'bg-gray-800/50'}`}>
                        <td className="px-4 py-3 font-medium text-gray-100">{loan.denumire}</td>
                        <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{new Date(loan.date + 'T00:00:00').toLocaleDateString('ro-MD', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                        <td className="px-4 py-3 text-right font-mono text-amber-300">{loan.amount.toLocaleString('ro-MD', { minimumFractionDigits: 2 })} L</td>
                        <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell max-w-xs truncate">{loan.notes || '—'}</td>
                        <td className="px-4 py-3 text-right font-mono text-green-400">{loan.restituit > 0 ? `${loan.restituit.toLocaleString('ro-MD', { minimumFractionDigits: 2 })} L` : '—'}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold">
                          {ramas > 0 ? <span className="text-red-400">{ramas.toLocaleString('ro-MD', { minimumFractionDigits: 2 })} L</span> : <span className="text-green-500 text-xs">✓ Achitat</span>}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openLoanModal(loan)}
                              className="px-2 py-1 bg-amber-700/40 hover:bg-amber-600/50 text-amber-300 rounded text-xs transition-colors"
                              title="Editează / actualizează restituit"
                            >
                              Editează
                            </button>
                            <button
                              onClick={() => handleDeleteLoan(loan.id)}
                              disabled={deletingLoanId === loan.id}
                              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                              title="Șterge"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-amber-700/50 bg-gray-750">
                    <td colSpan={2} className="px-4 py-3 font-semibold text-amber-300 text-sm">TOTAL</td>
                    <td className="px-4 py-3 text-right font-bold font-mono text-amber-300">{loansSummary.totalAmount.toLocaleString('ro-MD', { minimumFractionDigits: 2 })} L</td>
                    <td className="hidden md:table-cell" />
                    <td className="px-4 py-3 text-right font-bold font-mono text-green-400">{loansSummary.totalRestituit.toLocaleString('ro-MD', { minimumFractionDigits: 2 })} L</td>
                    <td className="px-4 py-3 text-right font-bold font-mono text-red-400">{loansSummary.totalRamas.toLocaleString('ro-MD', { minimumFractionDigits: 2 })} L</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Add / Edit Loan modal ──────────────────────────────────────────── */}
      {showLoanModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-amber-700/50">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
              <h2 className="text-lg font-bold text-amber-400">{editingLoan ? 'Editează Împrumut' : 'Împrumut Nou'}</h2>
              <button onClick={() => setShowLoanModal(false)} className="p-1 hover:bg-gray-700 rounded"><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              {loanError && <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-3 py-2 text-sm">{loanError}</div>}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Denumire *</label>
                <input
                  value={loanForm.denumire}
                  onChange={e => setLoanForm(p => ({ ...p, denumire: e.target.value }))}
                  placeholder="ex. BLL Budca goroh Borsh"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Data *</label>
                  <input
                    type="date"
                    value={loanForm.date}
                    onChange={e => setLoanForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Suma (MDL) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={loanForm.amount}
                    onChange={e => setLoanForm(p => ({ ...p, amount: e.target.value }))}
                    placeholder="0.00"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Obiecții / Comentarii</label>
                <input
                  value={loanForm.notes}
                  onChange={e => setLoanForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="ex. cec 300,50 moica 100era"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Restituit (MDL)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={loanForm.restituit}
                  onChange={e => setLoanForm(p => ({ ...p, restituit: e.target.value }))}
                  placeholder="0.00"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-amber-500"
                />
                {loanForm.amount && Number(loanForm.restituit) > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    Rămâne: <span className={Number(loanForm.amount) - Number(loanForm.restituit) > 0 ? 'text-red-400' : 'text-green-400'}>
                      {Math.max(0, Number(loanForm.amount) - Number(loanForm.restituit)).toLocaleString('ro-MD', { minimumFractionDigits: 2 })} L
                    </span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-700">
              <button onClick={() => setShowLoanModal(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">Anulează</button>
              <button onClick={handleSaveLoan} disabled={savingLoan} className="flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium">
                {savingLoan ? 'Se salvează...' : <><Check size={14} /> Salvează</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Import CSV/TXT Loans modal ────────────────────────────────────── */}
      {showLoanImport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border border-amber-700/50">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
              <div>
                <h2 className="text-lg font-bold text-amber-400">Import CSV / TXT — Datorii</h2>
                <p className="text-xs text-gray-400 mt-0.5">Format: denumire, data (YYYY-MM-DD), suma, obiectii, restituit</p>
              </div>
              <button onClick={() => setShowLoanImport(false)} className="p-1 hover:bg-gray-700 rounded"><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-750 rounded-lg p-3 border border-gray-700 text-xs font-mono text-gray-400 space-y-1">
                <p className="text-gray-300 font-semibold mb-1">Exemplu CSV / TXT (valori separate prin virgulă):</p>
                <p>denumire,data,suma,obiectii,restituit</p>
                <p>Budca goroh,2025-11-20,250,cec 300,250</p>
                <p>plicuri hartie,2026-04-09,1070,,0</p>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Selectează fișier CSV sau TXT</label>
                <input
                  type="file"
                  accept=".csv,.txt,text/csv,text/plain"
                  ref={loanImportFileRef}
                  onChange={handleLoanImport}
                  className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-amber-700 file:text-white hover:file:bg-amber-600 cursor-pointer"
                />
              </div>
              {importingLoan && <div className="text-center text-gray-400 text-sm py-2">Se importă datele...</div>}
              {loanImportResult && !loanImportResult.error && (
                <div className="space-y-2">
                  <div className="bg-green-900/30 border border-green-700 rounded-lg px-4 py-3 text-sm">
                    <p className="text-green-300 font-medium">✅ Importate cu succes: <strong>{loanImportResult.created}</strong> înregistrări</p>
                  </div>
                  {loanImportResult.errors?.length > 0 && (
                    <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg px-4 py-3 text-sm">
                      <p className="text-yellow-300 font-medium flex items-center gap-1 mb-2"><AlertCircle size={14} /> Erori ({loanImportResult.errors.length}):</p>
                      <ul className="space-y-1">{loanImportResult.errors.map((e, i) => <li key={i} className="text-yellow-400 text-xs">{e}</li>)}</ul>
                    </div>
                  )}
                </div>
              )}
              {loanImportResult?.error && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 text-sm text-red-300">{loanImportResult.error}</div>
              )}
            </div>
            <div className="flex justify-end px-5 py-4 border-t border-gray-700">
              <button onClick={() => setShowLoanImport(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">Închide</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
