// src/app/components/AccessibilityPanel.jsx
"use client";

import { useState, useEffect } from "react";
import { X, Type, ZoomIn, ZoomOut, Contrast, Eye, RotateCcw } from "lucide-react";

const DEFAULTS = { fontSize: 16, contrast: 'normal', letterSpacing: 0, lineHeight: 1.5 };

export default function AccessibilityPanel({ open, onClose }) {
  const [settings, setSettings] = useState(DEFAULTS);

  // Load saved settings
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('accessibility') || 'null');
      if (saved) { setSettings(saved); applySettings(saved); }
    } catch {}
  }, []);

  const applySettings = (s) => {
    document.documentElement.style.fontSize = `${s.fontSize}px`;
    document.documentElement.style.letterSpacing = `${s.letterSpacing}em`;
    document.documentElement.style.lineHeight = `${s.lineHeight}`;
    if (s.contrast === 'high') {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const update = (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    applySettings(next);
    localStorage.setItem('accessibility', JSON.stringify(next));
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    localStorage.removeItem('accessibility');
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-700 shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div>
            <h2 className="text-white font-semibold text-base">Accesibilitate</h2>
            <p className="text-gray-500 text-xs mt-0.5">Personalizează interfața</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

          {/* Font size */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Type size={14} /> Mărime Text
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => update('fontSize', Math.max(12, settings.fontSize - 1))}
                className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
              >
                <ZoomOut size={16} />
              </button>
              <div className="flex-1 text-center">
                <span className="text-white font-bold text-lg">{settings.fontSize}</span>
                <span className="text-gray-500 text-xs ml-1">px</span>
              </div>
              <button
                onClick={() => update('fontSize', Math.min(24, settings.fontSize + 1))}
                className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
              >
                <ZoomIn size={16} />
              </button>
            </div>
            <input
              type="range"
              min={12}
              max={24}
              value={settings.fontSize}
              onChange={e => update('fontSize', +e.target.value)}
              className="w-full mt-2 accent-teal-400"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>12px (mic)</span>
              <span>24px (mare)</span>
            </div>
          </div>

          {/* Contrast */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Contrast size={14} /> Contrast
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'normal', label: 'Normal', desc: 'Standard' },
                { key: 'high', label: 'Înalt', desc: 'Mai vizibil' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => update('contrast', opt.key)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    settings.contrast === opt.key
                      ? 'border-teal-500 bg-teal-500/10 text-teal-300'
                      : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <p className="font-medium text-sm">{opt.label}</p>
                  <p className="text-xs opacity-70 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Letter spacing */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Eye size={14} /> Spațiere Litere
            </label>
            <input
              type="range"
              min={0}
              max={0.2}
              step={0.02}
              value={settings.letterSpacing}
              onChange={e => update('letterSpacing', +e.target.value)}
              className="w-full accent-teal-400"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Normal</span>
              <span>Larg</span>
            </div>
          </div>

          {/* Line height */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Type size={14} /> Înălțime Rânduri
            </label>
            <input
              type="range"
              min={1.2}
              max={2.2}
              step={0.1}
              value={settings.lineHeight}
              onChange={e => update('lineHeight', +e.target.value)}
              className="w-full accent-teal-400"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Compact</span>
              <span>Aerat</span>
            </div>
          </div>

        </div>

        {/* Reset */}
        <div className="px-5 py-4 border-t border-gray-800">
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
          >
            <RotateCcw size={15} />
            Resetează setările
          </button>
        </div>
      </div>

      <style>{`
        html.high-contrast { filter: contrast(1.5) brightness(1.1); }
      `}</style>
    </>
  );
}
