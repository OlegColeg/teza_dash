// src/app/cash-calculator/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { Save, RefreshCw } from "lucide-react";

// Bancnote MDL
const BILLS = [200, 100, 50, 20, 10, 5, 1];
const COINS = [10, 5, 2, 1];

export default function CashCalculatorPage() {
  const [bills, setBills] = useState({ 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 1: 0 });
  const [coins, setCoins] = useState({ 10: 0, 5: 0, 2: 0, 1: 0 });
  const [systemBalance, setSystemBalance] = useState(null);
  const [totalDebt, setTotalDebt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  function getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  }

  useEffect(() => {
    // Load saved calculator state
    fetch('/api/finances/cash-calculator', { headers: getHeaders() })
      .then(r => r.json()).then(d => {
        if (d.bills) setBills(d.bills);
        if (d.coins) setCoins(d.coins);
        if (d.updatedAt) setSavedAt(d.updatedAt);
      }).catch(() => {});

    // Load system balance
    fetch('/api/finances', { headers: getHeaders() })
      .then(r => r.json()).then(d => setSystemBalance(d.summary?.balance ?? 0)).catch(() => {});

    // Load debts
    fetch('/api/debts', { headers: getHeaders() })
      .then(r => r.json()).then(d => setTotalDebt(d.totalDebt || 0)).catch(() => {});
  }, []);

  const totalBills = BILLS.reduce((s, b) => s + b * (Number(bills[b]) || 0), 0);
  const totalCoins = COINS.reduce((s, c) => s + (c / 100) * (Number(coins[c]) || 0), 0);  
  // MDL coins are in lei (1 leu, 2 lei, 5 lei, 10 lei) — not subdivisions
  const totalCoinsLei = COINS.reduce((s, c) => s + c * (Number(coins[c]) || 0), 0);
  const totalPhysical = totalBills + totalCoinsLei;

  const difference = systemBalance !== null ? totalPhysical - systemBalance : null;

  async function handleSave() {
    setSaving(true);
    const res = await fetch('/api/finances/cash-calculator', {
      method: 'PUT', headers: getHeaders(),
      body: JSON.stringify({ bills, coins })
    });
    if (res.ok) {
      const d = await res.json();
      setSavedAt(d.updatedAt);
    }
    setSaving(false);
  }

  function handleReset() {
    setBills({ 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 1: 0 });
    setCoins({ 10: 0, 5: 0, 2: 0, 1: 0 });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">🧮 CALCULATOR BANCNOTE</h1>
        <p className="text-gray-400">Numără fizic banii din casă și verifică dacă corespund cu evidența</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Bancnote input */}
        <div className="space-y-4">
          {/* Bills */}
          <div className="bg-gray-800 rounded-lg p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-yellow-400">💵</span> Bancnote (MDL)
            </h2>
            <div className="space-y-3">
              {BILLS.map(b => {
                const count = Number(bills[b]) || 0;
                const subtotal = b * count;
                return (
                  <div key={b} className="flex items-center gap-3">
                    <div className={`w-20 text-center py-1.5 rounded font-bold text-sm
                      ${b === 200 ? 'bg-blue-800 text-blue-200' :
                        b === 100 ? 'bg-green-800 text-green-200' :
                        b === 50 ? 'bg-purple-800 text-purple-200' :
                        b === 20 ? 'bg-yellow-800 text-yellow-200' :
                        'bg-gray-700 text-gray-300'}`}>
                      {b} lei
                    </div>
                    <span className="text-gray-400 text-sm">×</span>
                    <input
                      type="number"
                      value={bills[b] === 0 ? '' : bills[b]}
                      onChange={e => setBills(prev => ({ ...prev, [b]: Math.max(0, Number(e.target.value) || 0) }))}
                      className="w-24 bg-gray-700 text-white text-center rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-400 text-sm"
                      min="0"
                      placeholder="0"
                    />
                    <span className="text-gray-400 text-sm">bucăți</span>
                    <span className={`ml-auto font-bold text-sm ${subtotal > 0 ? 'text-white' : 'text-gray-600'}`}>
                      = {subtotal.toLocaleString()} lei
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-gray-700 mt-4 pt-3 flex justify-between">
              <span className="text-gray-400 text-sm">Total bancnote:</span>
              <span className="text-white font-bold">{totalBills.toLocaleString()} lei</span>
            </div>
          </div>

          {/* Coins */}
          <div className="bg-gray-800 rounded-lg p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-yellow-400">🪙</span> Monede (MDL)
            </h2>
            <div className="space-y-3">
              {COINS.map(c => {
                const count = Number(coins[c]) || 0;
                const subtotal = c * count;
                return (
                  <div key={c} className="flex items-center gap-3">
                    <div className="w-20 text-center py-1.5 rounded font-bold text-sm bg-gray-700 text-gray-300">
                      {c} lei
                    </div>
                    <span className="text-gray-400 text-sm">×</span>
                    <input
                      type="number"
                      value={coins[c] === 0 ? '' : coins[c]}
                      onChange={e => setCoins(prev => ({ ...prev, [c]: Math.max(0, Number(e.target.value) || 0) }))}
                      className="w-24 bg-gray-700 text-white text-center rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-400 text-sm"
                      min="0"
                      placeholder="0"
                    />
                    <span className="text-gray-400 text-sm">bucăți</span>
                    <span className={`ml-auto font-bold text-sm ${subtotal > 0 ? 'text-white' : 'text-gray-600'}`}>
                      = {subtotal.toLocaleString()} lei
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-gray-700 mt-4 pt-3 flex justify-between">
              <span className="text-gray-400 text-sm">Total monede:</span>
              <span className="text-white font-bold">{totalCoinsLei.toLocaleString()} lei</span>
            </div>
          </div>
        </div>

        {/* Right: Summary & Verification */}
        <div className="space-y-4">
          {/* Total physical */}
          <div className="bg-gray-800 rounded-lg p-5">
            <h2 className="text-white font-semibold mb-4">📊 Sumar</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Total bancnote</span>
                <span className="text-white font-bold">{totalBills.toLocaleString()} lei</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Total monede</span>
                <span className="text-white font-bold">{totalCoinsLei.toLocaleString()} lei</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-teal-900/40 rounded px-3">
                <span className="text-teal-300 font-semibold text-lg">TOTAL FIZIC</span>
                <span className="text-teal-300 font-bold text-2xl">{totalPhysical.toLocaleString()} lei</span>
              </div>
            </div>
          </div>

          {/* Verification — exact ca în Excel */}
          <div className="bg-gray-800 rounded-lg p-5">
            <h2 className="text-white font-semibold mb-1">✅ Verificare Corespundere</h2>
            <p className="text-gray-500 text-xs mb-4">Actual minus din casă (trebuie să fie 0)</p>
            <div className="space-y-3">

              {/* Row 1: Trebuie sa fie */}
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Trebuie să fie în casă</p>
                  <p className="text-gray-500 text-xs">Încasări − Cheltuieli din evidență</p>
                </div>
                <span className={`font-bold text-lg ${systemBalance !== null && systemBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {systemBalance !== null ? systemBalance.toLocaleString() : '...'} lei
                </span>
              </div>

              {/* Row 2: Este la moment (fizic) */}
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Este la moment în casă</p>
                  <p className="text-gray-500 text-xs">Numărat fizic (bancnote + monede)</p>
                </div>
                <span className="text-teal-300 font-bold text-lg">{totalPhysical.toLocaleString()} lei</span>
              </div>

              {/* Row 3: Datorii informational */}
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Datorii echipe (neachitate)</p>
                  <p className="text-gray-500 text-xs">Bani ce trebuie recuperați de la echipe</p>
                </div>
                <span className="text-orange-300 font-bold text-lg">{totalDebt.toLocaleString()} lei</span>
              </div>

              {/* Main result: Diferenta = fizic - trebuie */}
              {difference !== null && (
                <div className={`rounded-lg p-4 mt-1 ${
                  Math.abs(difference) < 1
                    ? 'bg-green-900/40 border border-green-700'
                    : difference > 0
                      ? 'bg-blue-900/40 border border-blue-700'
                      : 'bg-red-900/40 border border-red-700'
                }`}>
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className={`font-bold text-lg ${Math.abs(difference) < 1 ? 'text-green-300' : difference > 0 ? 'text-blue-300' : 'text-red-300'}`}>
                        {Math.abs(difference) < 1
                          ? '✅ La moment suma COINCIDE'
                          : difference > 0
                            ? `✅ Sunt Destule, chiar în plus cu: ${difference.toLocaleString()} LEI`
                            : `❌ NU AJUNG — ${Math.abs(difference).toLocaleString()} LEI`}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {Math.abs(difference) < 1
                          ? 'Banii fizici corespund exact cu evidența — totul e corect!'
                          : difference > 0
                            ? 'Ai mai mulți bani decât în evidență → probabil ceva venit nu a fost scris, sau o cheltuială a fost introdusă greșit (în plus).'
                            : 'Ai mai puțini bani decât în evidență → probabil o cheltuială sau datorie (bani luați din casă) nu a fost înregistrată.'}
                      </p>
                    </div>
                    <span className={`font-bold text-2xl whitespace-nowrap ${Math.abs(difference) < 1 ? 'text-green-400' : difference > 0 ? 'text-blue-400' : 'text-red-400'}`}>
                      {difference >= 0 ? '+' : ''}{difference.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Extra: with debts recovered */}
              {systemBalance !== null && totalDebt > 0 && (
                <div className="bg-gray-700/40 rounded p-3 text-sm">
                  <p className="text-gray-400">
                    Dacă toate echipele ar achita datoriile:
                    <span className={`font-bold ml-1 ${systemBalance + totalDebt >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                      {(systemBalance + totalDebt).toLocaleString()} lei
                    </span>
                    {' '}în evidență
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* Breakdown by bill */}
          <div className="bg-gray-800 rounded-lg p-5">
            <h2 className="text-white font-semibold mb-3">📋 Detaliu pe bancnote</h2>
            <div className="grid grid-cols-2 gap-2">
              {BILLS.filter(b => (Number(bills[b]) || 0) > 0).map(b => (
                <div key={b} className="bg-gray-700 rounded p-2 flex justify-between text-sm">
                  <span className="text-gray-300">{bills[b]}× {b} lei</span>
                  <span className="text-white font-medium">{(b * Number(bills[b])).toLocaleString()}</span>
                </div>
              ))}
              {COINS.filter(c => (Number(coins[c]) || 0) > 0).map(c => (
                <div key={`c${c}`} className="bg-gray-700 rounded p-2 flex justify-between text-sm">
                  <span className="text-gray-300">{coins[c]}× {c} lei</span>
                  <span className="text-white font-medium">{(c * Number(coins[c])).toLocaleString()}</span>
                </div>
              ))}
              {BILLS.every(b => !bills[b]) && COINS.every(c => !coins[c]) && (
                <p className="col-span-2 text-gray-500 text-sm text-center py-2">Introduceți cantitățile de mai sus</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded flex items-center justify-center gap-2 font-medium disabled:opacity-50">
              <Save size={16} />{saving ? 'Se salvează...' : 'Salvează starea'}
            </button>
            <button onClick={handleReset}
              className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded flex items-center gap-2">
              <RefreshCw size={16} /> Reset
            </button>
          </div>
          {savedAt && (
            <p className="text-gray-500 text-xs text-center">
              Salvat: {new Date(savedAt).toLocaleString('ro-RO')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
