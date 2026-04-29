// src/app/calendar/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Check, Trash2 } from "lucide-react";

const HOURS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
  const [reservations, setReservations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ teamInput: "", startTime: "18:00", endTime: "19:00", status: "paid", cost: "", notes: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  }

  function loadReservations() {
    fetch('/api/reservations', { headers: getHeaders() })
      .then(r => r.json()).then(data => setReservations(Array.isArray(data) ? data : []));
  }

  function loadTeams() {
    fetch('/api/teams', { headers: getHeaders() })
      .then(r => r.json()).then(data => setTeams(Array.isArray(data) ? data : []));
  }

  useEffect(() => { loadReservations(); loadTeams(); }, []);

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

  const reservedDates = new Set(reservations.map(r => r.date));

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
      if (!res.ok) { setError(data.error || 'Eroare'); setSaving(false); loadReservations(); return; }
      setShowModal(false);
      loadReservations();
      loadTeams();
    } catch {
      setError('Eroare de rețea — verifici dacă rezervarea a apărut');
      loadReservations(); // reload to detect if it actually saved
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm('Ștergi această rezervare?')) return;
    const res = await fetch(`/api/reservations/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) { loadReservations(); loadTeams(); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">CALENDAR REZERVĂRI</h1>
        <p className="text-gray-400">Gestionează orele de joc pe teren</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="text-gray-400 hover:text-white p-1"><ChevronLeft size={20} /></button>
            <span className="text-white font-semibold capitalize">{monthName}</span>
            <button onClick={nextMonth} className="text-gray-400 hover:text-white p-1"><ChevronRight size={20} /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['D','L','M','M','J','V','S'].map((d, i) => (
              <div key={i} className="text-center text-gray-400 text-xs font-medium py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array(firstDay).fill(null).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const dateStr = formatDate(day);
              const isToday = dateStr === today.toISOString().split('T')[0];
              const isSelected = dateStr === selectedDate;
              const hasReservation = reservedDates.has(dateStr);
              return (
                <div key={day} onClick={() => setSelectedDate(dateStr)}
                  className={`relative flex items-center justify-center h-9 w-full rounded-lg cursor-pointer text-sm transition
                    ${isSelected ? 'bg-teal-600 text-white font-bold' : isToday ? 'bg-blue-900 text-blue-300 font-bold' : 'text-gray-300 hover:bg-gray-700'}`}>
                  {day}
                  {hasReservation && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-400 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Day detail */}
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-white font-semibold">
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h2>
              <p className="text-gray-400 text-sm">{selectedReservations.length} rezervări</p>
            </div>
            <button onClick={() => { setForm({ teamInput: '', startTime: '18:00', endTime: '19:00', status: 'paid', cost: '', notes: '' }); setError(''); setShowModal(true); }}
              className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded flex items-center gap-2">
              <Plus size={16} /> Adaugă Rezervare
            </button>
          </div>

          {/* Hour slots */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {HOURS.map(hour => {
              const res = selectedReservations.find(r => r.startTime <= hour && r.endTime > hour);
              return (
                <div key={hour} className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm w-12 flex-shrink-0">{hour}</span>
                  {res ? (
                    <div className="flex-1 bg-teal-900 border border-teal-600 rounded px-3 py-2 flex justify-between items-center">
                      <div>
                        <span className="text-teal-300 font-medium">{res.team?.name || '?'}</span>
                        <span className="text-gray-400 text-xs ml-2">{res.startTime}–{res.endTime} · {res.cost} lei</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${res.status === 'paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                          {res.status === 'paid' ? 'achitat' : 'amânat'}
                        </span>
                      </div>
                      {res.startTime === hour && (
                        <button onClick={() => handleDelete(res.id)} className="text-red-400 hover:text-red-300 ml-2"><Trash2 size={14} /></button>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 h-8 border border-dashed border-gray-700 rounded" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-lg font-bold">Adaugă Rezervare</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            {error && <p className="text-red-400 text-sm mb-3 bg-red-900/30 p-2 rounded">{error}</p>}
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm block mb-1">Echipa *</label>
                <input
                  type="text"
                  list="teams-datalist"
                  value={form.teamInput}
                  onChange={e => setForm(f => ({ ...f, teamInput: e.target.value }))}
                  placeholder="Scrie sau alege echipa..."
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                />
                <datalist id="teams-datalist">
                  {teams.map(t => <option key={t.id} value={t.name} />)}
                </datalist>
                {form.teamInput.trim() && !teams.find(t => t.name.toLowerCase() === form.teamInput.toLowerCase().trim()) && (
                  <p className="text-yellow-400 text-xs mt-1">✨ Echipă nouă — va fi creată automat</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm block mb-1">Ora început</label>
                  <select value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400">
                    {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-300 text-sm block mb-1">Ora sfârșit</label>
                  <select value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400">
                    {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-1">Plată</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400">
                  <option value="paid">Achitat pe loc</option>
                  <option value="deferred">Amânat la plată (datorie)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm block mb-1">Cost (lei)</label>
                  <input type="number" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                    min="0" step="50" placeholder="ex: 500" />
                </div>
                <div>
                  <label className="text-gray-300 text-sm block mb-1">Observații</label>
                  <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                    placeholder="opțional" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAdd} disabled={saving}
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
