// src/app/calendar/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Check, Trash2, DollarSign } from "lucide-react";

const HOURS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
  const [reservations, setReservations] = useState([]);
  const [financeEvents, setFinanceEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ teamInput: "", startTime: "18:00", endTime: "19:00", status: "paid", cost: "", notes: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  }

  function loadAll() {
    const h = getHeaders();
    Promise.all([
      fetch('/api/reservations', { headers: h }).then(r => r.json()).then(d => Array.isArray(d) ? d : []).catch(() => []),
      fetch('/api/finances', { headers: h }).then(r => r.json()).then(d => {
        const arr = d.transactions || d.data || (Array.isArray(d) ? d : []);
        return arr.filter(f => f.type === 'income' && (f.teamId || f.client));
      }).catch(() => []),
      fetch('/api/teams', { headers: h }).then(r => r.json()).then(d => Array.isArray(d) ? d : []).catch(() => []),
    ]).then(([res, fins, tms]) => {
      setReservations(res);
      setFinanceEvents(fins);
      setTeams(tms);
    });
  }

  useEffect(() => { loadAll(); }, []);

  // Calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleString('ro-RO', { month: 'long', year: 'numeric' });

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function formatDate(d) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  const selectedReservations = reservations.filter(r => r.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const selectedFinEvents = financeEvents
    .filter(f => f.date === selectedDate)
    .sort((a, b) => (a.client || '').localeCompare(b.client || ''));

  const reservedDates = new Set([
    ...reservations.map(r => r.date),
    ...financeEvents.map(f => f.date),
  ]);

  async function handleAdd() {
    if (!form.teamInput.trim()) { setError('Introdu numele echipei'); return; }
    if (!form.startTime || !form.endTime) { setError('Selectează orele'); return; }
    if (form.startTime >= form.endTime) { setError('Ora de sfârşit trebuie să fie după ora de început'); return; }
    setSaving(true); setError('');
    try {
      const teamByName = teams.find(t => t.name.toLowerCase() === form.teamInput.toLowerCase().trim());
      const payload = {
        ...(teamByName ? { teamId: teamByName.id } : { teamName: form.teamInput.trim() }),
        date: selectedDate,
        startTime: form.startTime,
        endTime: form.endTime,
        cost: Number(form.cost) || 0,
        status: form.status,
        notes: form.notes || null
      };
      const res = await fetch('/api/reservations', {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Eroare'); setSaving(false); loadAll(); return; }
      setShowModal(false);
      loadAll();
    } catch {
      setError('Eroare de rețea — verifică dacă rezervarea a apărut');
      loadAll();
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm('Ștergi această rezervare?')) return;
    const res = await fetch(`/api/reservations/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) loadAll();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">CALENDAR REZERVĂRI</h1>
        <p className="text-gray-400 text-sm">Rezervări programate + istoricul plăților per echipă</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Calendar */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-700 transition"><ChevronLeft size={20} /></button>
            <span className="text-white font-semibold capitalize text-sm">{monthName}</span>
            <button onClick={nextMonth} className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-700 transition"><ChevronRight size={20} /></button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 mb-2">
            {['D','L','M','M','J','V','S'].map((d, i) => (
              <div key={i} className="text-center text-gray-400 text-xs font-medium py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {Array(firstDay).fill(null).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const dateStr = formatDate(day);
              const isToday = dateStr === today.toISOString().split('T')[0];
              const isSelected = dateStr === selectedDate;
              const hasReservation = reservations.some(r => r.date === dateStr);
              const hasFinance = financeEvents.some(f => f.date === dateStr);
              return (
                <div key={day} onClick={() => setSelectedDate(dateStr)}
                  className={`relative flex items-center justify-center h-9 w-full rounded-lg cursor-pointer text-sm transition select-none
                    ${isSelected ? 'bg-teal-600 text-white font-bold' : isToday ? 'bg-blue-900/60 text-blue-300 font-bold' : 'text-gray-300 hover:bg-gray-700'}`}>
                  {day}
                  {(hasReservation || hasFinance) && !isSelected && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {hasReservation && <span className="w-1 h-1 bg-teal-400 rounded-full" />}
                      {hasFinance && <span className="w-1 h-1 bg-green-400 rounded-full" />}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700 flex gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-teal-400 rounded-full inline-block" />Rezervare</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full inline-block" />Plată</span>
          </div>
        </div>

        {/* Day detail */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <h2 className="text-white font-semibold capitalize text-sm sm:text-base">
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h2>
              <p className="text-gray-400 text-xs mt-0.5">
                {selectedReservations.length > 0 && `${selectedReservations.length} rezervare(i)`}
                {selectedReservations.length > 0 && selectedFinEvents.length > 0 && ' · '}
                {selectedFinEvents.length > 0 && `${selectedFinEvents.length} plată(ți)`}
                {selectedReservations.length === 0 && selectedFinEvents.length === 0 && 'Nicio activitate'}
              </p>
            </div>
            <button onClick={() => { setForm({ teamInput: '', startTime: '18:00', endTime: '19:00', status: 'paid', cost: '', notes: '' }); setError(''); setShowModal(true); }}
              className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm whitespace-nowrap transition">
              <Plus size={16} /> Adaugă Rezervare
            </button>
          </div>

          {/* Programmed reservations with time slots */}
          {selectedReservations.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">Rezervări cu interval orar</p>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                {HOURS.map(hour => {
                  const res = selectedReservations.find(r => r.startTime <= hour && r.endTime > hour);
                  return (
                    <div key={hour} className="flex items-center gap-3">
                      <span className="text-gray-500 text-xs w-10 flex-shrink-0 font-mono">{hour}</span>
                      {res ? (
                        <div className="flex-1 bg-teal-900/40 border border-teal-700/60 rounded-lg px-3 py-2 flex justify-between items-center">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span className="text-teal-300 font-semibold text-sm">{res.team?.name || '?'}</span>
                            <span className="text-gray-400 text-xs">{res.startTime}–{res.endTime}</span>
                            {res.cost > 0 && <span className="text-green-400 text-xs font-medium">+{res.cost} lei</span>}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${res.status === 'paid' ? 'bg-green-900/60 text-green-300' : 'bg-yellow-900/60 text-yellow-300'}`}>
                              {res.status === 'paid' ? 'achitat' : 'amânat'}
                            </span>
                          </div>
                          {res.startTime === hour && (
                            <button onClick={() => handleDelete(res.id)} className="text-gray-600 hover:text-red-400 ml-2 flex-shrink-0 transition"><Trash2 size={14} /></button>
                          )}
                        </div>
                      ) : (
                        <div className="flex-1 h-6 border border-dashed border-gray-700/40 rounded-lg" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Finance events — no time, from import/manual */}
          {selectedFinEvents.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">Plăți înregistrate în finanțe</p>
              <div className="space-y-2">
                {selectedFinEvents.map((f, i) => (
                  <div key={f.id || i} className="bg-green-900/20 border border-green-800/40 rounded-lg px-3 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-green-700/60 border border-green-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {(f.client || f.team?.name || '?').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-green-300 font-semibold text-sm truncate">{f.client || f.team?.name || '—'}</p>
                        {f.notes && <p className="text-gray-400 text-xs truncate">{f.notes}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                      <DollarSign size={13} className="text-green-400" />
                      <span className="text-green-400 font-bold text-sm">+{f.amount.toLocaleString('ro-RO')} lei</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedReservations.length === 0 && selectedFinEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <p className="text-sm">Nicio activitate în această zi</p>
              <p className="text-xs mt-1">Apasă „Adaugă Rezervare" pentru a programa un meci</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-gray-700">
              <div>
                <h2 className="text-white font-bold">Adaugă Rezervare</h2>
                <p className="text-gray-400 text-sm capitalize">
                  {new Date(selectedDate + 'T12:00:00').toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              {error && <p className="text-red-400 text-sm bg-red-900/30 p-2.5 rounded-lg">{error}</p>}
              <div>
                <label className="text-gray-300 text-sm block mb-1">Echipa *</label>
                <input
                  type="text"
                  list="teams-datalist"
                  value={form.teamInput}
                  onChange={e => setForm(f => ({ ...f, teamInput: e.target.value }))}
                  placeholder="Scrie sau alege echipa din listă..."
                  autoComplete="off"
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
                />
                <datalist id="teams-datalist">
                  {teams.map(t => <option key={t.id} value={t.name} />)}
                </datalist>
                {form.teamInput.trim() && !teams.find(t => t.name.toLowerCase() === form.teamInput.toLowerCase().trim()) && (
                  <p className="text-yellow-400 text-xs mt-1">✨ Echipă nouă — va fi creată automat la salvare</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 text-sm block mb-1">Ora început</label>
                  <select value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400">
                    {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-300 text-sm block mb-1">Ora sfârșit</label>
                  <select value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400">
                    {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-1">Plată</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400">
                  <option value="paid">Achitat pe loc</option>
                  <option value="deferred">Amânat la plată (datorie)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 text-sm block mb-1">Cost (lei)</label>
                  <input type="number" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
                    min="0" step="50" placeholder="ex: 500" />
                </div>
                <div>
                  <label className="text-gray-300 text-sm block mb-1">Observații</label>
                  <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
                    placeholder="opțional" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button onClick={handleAdd} disabled={saving}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 font-medium transition">
                <Check size={16} />{saving ? 'Se salvează...' : 'Salvează Rezervarea'}
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-lg transition">Anulează</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
