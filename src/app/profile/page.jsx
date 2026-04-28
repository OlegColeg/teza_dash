// src/app/profile/page.jsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, Save, Download } from "lucide-react";

export default function SimpleProfilePage() {
  const EMPTY_PROFILE = { firstName: '', lastName: '', email: '', phone: '', city: '', country: '' };
  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState(EMPTY_PROFILE);
  const [formData, setFormData] = useState(EMPTY_PROFILE);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saved, setSaved] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Citim utilizatorul curent
    let userId = null;
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      userId = u?.id || null;
      setCurrentUser(u);
    } catch {}

    if (!userId) return;

    // Chei unice per utilizator
    const photoKey = `profilePhoto_${userId}`;
    const dataKey = `profileData_${userId}`;

    const savedPhoto = localStorage.getItem(photoKey);
    if (savedPhoto) setPhotoPreview(savedPhoto);

    const savedProfile = localStorage.getItem(dataKey);
    if (savedProfile) {
      try { const p = JSON.parse(savedProfile); setProfileData(p); setFormData(p); } catch {}
    }
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Fișierul este prea mare (max 5MB)'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setPhotoPreview(dataUrl);
      try {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        if (u?.id) localStorage.setItem(`profilePhoto_${u.id}`, dataUrl);
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfileData({ ...formData });
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      if (u?.id) localStorage.setItem(`profileData_${u.id}`, JSON.stringify(formData));
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportPDF = async () => {
    setExportLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const [teamsRes, finRes, debtsRes, resRes] = await Promise.all([
        fetch('/api/teams', { headers }),
        fetch('/api/finances', { headers }),
        fetch('/api/debts', { headers }),
        fetch('/api/reservations', { headers }),
      ]);
      const teams = teamsRes.ok ? (await teamsRes.json()) : [];
      const finances = finRes.ok ? (await finRes.json()) : [];
      const debts = debtsRes.ok ? (await debtsRes.json()) : [];
      const reservations = resRes.ok ? (await resRes.json()) : [];

      const teamsArr = teams.data || teams || [];
      const finArr = finances.data || finances || [];
      const debtsArr = debts.data || debts || [];
      const resArr = reservations.data || reservations || [];

      const totalIncome = finArr.filter(f => f.type === 'income').reduce((s, f) => s + (f.amount || 0), 0);
      const totalExpense = finArr.filter(f => f.type === 'expense').reduce((s, f) => s + (f.amount || 0), 0);
      const totalDebt = debtsArr.reduce((s, d) => s + Math.abs(d.balance || 0), 0);

      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();

      // Header teal
      doc.setFillColor(20, 184, 166);
      doc.rect(0, 0, pageW, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('RAPORT STADION MINI-FOTBAL', pageW / 2, 12, { align: 'center' });
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generat: ${new Date().toLocaleDateString('ro-RO')}  |  Administrator: ${formData.firstName} ${formData.lastName}`, pageW / 2, 22, { align: 'center' });

      let y = 40;
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('SUMAR FINANCIAR', 14, y);
      y += 4;
      autoTable(doc, {
        startY: y,
        head: [['Indicator', 'Valoare']],
        body: [
          ['Total Venituri', `${totalIncome.toFixed(2)} MDL`],
          ['Total Cheltuieli', `${totalExpense.toFixed(2)} MDL`],
          ['Profit Net', `${(totalIncome - totalExpense).toFixed(2)} MDL`],
          ['Total Datorii', `${totalDebt.toFixed(2)} MDL`],
          ['Nr. Echipe', `${teamsArr.length}`],
          ['Nr. Rezervări', `${resArr.length}`],
        ],
        theme: 'striped',
        headStyles: { fillColor: [20, 184, 166], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 10 },
        columnStyles: { 1: { fontStyle: 'bold', halign: 'right' } },
      });
      y = doc.lastAutoTable.finalY + 10;

      if (teamsArr.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('ECHIPE', 14, y);
        y += 2;
        autoTable(doc, {
          startY: y,
          head: [['Nume Echipă', 'Telefon', 'Tarif/h', 'Sold (MDL)']],
          body: teamsArr.map(t => [
            t.name || '-', t.phone || '-', `${t.hourlyRate ?? '-'} MDL`,
            `${(t.balance ?? 0) < 0 ? '⚠ ' : ''}${(t.balance ?? 0).toFixed(2)}`,
          ]),
          theme: 'striped',
          headStyles: { fillColor: [30, 41, 59], textColor: 255 },
          styles: { fontSize: 9 },
        });
        y = doc.lastAutoTable.finalY + 10;
      }

      if (debtsArr.length > 0) {
        if (y > 230) { doc.addPage(); y = 20; }
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('DATORII ECHIPE', 14, y);
        y += 2;
        autoTable(doc, {
          startY: y,
          head: [['Echipă', 'Telefon', 'Datorie (MDL)']],
          body: debtsArr.map(d => [d.name || '-', d.phone || '-', Math.abs(d.balance ?? 0).toFixed(2)]),
          theme: 'striped',
          headStyles: { fillColor: [239, 68, 68], textColor: 255 },
          styles: { fontSize: 9 },
        });
        y = doc.lastAutoTable.finalY + 10;
      }

      if (finArr.length > 0) {
        if (y > 220) { doc.addPage(); y = 20; }
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('TRANZACȚII FINANCIARE (ultimele 20)', 14, y);
        y += 2;
        autoTable(doc, {
          startY: y,
          head: [['Data', 'Tip', 'Categorie', 'Descriere', 'Suma (MDL)']],
          body: finArr.slice(-20).reverse().map(f => [
            f.date || '-',
            f.type === 'income' ? '+ Venit' : '- Cheltuială',
            f.category || '-',
            (f.description || '').substring(0, 35),
            `${f.type === 'income' ? '+' : '-'}${(f.amount ?? 0).toFixed(2)}`,
          ]),
          theme: 'striped',
          headStyles: { fillColor: [20, 184, 166], textColor: 255 },
          styles: { fontSize: 8 },
          columnStyles: { 4: { halign: 'right', fontStyle: 'bold' } },
        });
      }

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Pagina ${i} din ${pageCount}  |  Stadion Mini-Fotbal © ${new Date().getFullYear()}`,
          pageW / 2, doc.internal.pageSize.getHeight() - 8, { align: 'center' }
        );
      }

      doc.save(`raport-stadion-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Export PDF error:', err);
      alert('Eroare la generarea raportului.');
    }
    setExportLoading(false);
  };

  const inputClass = "w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm";
  const labelClass = "block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Profilul Meu</h1>
          <p className="text-gray-400 text-sm mt-1">Gestionează informațiile contului tău</p>
        </div>
        <button
          onClick={handleExportPDF}
          disabled={exportLoading}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          {exportLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : <Download size={16} />}
          Export Raport PDF
        </button>
      </div>

      {/* Poză profil */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Fotografie Profil</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 border-2 border-gray-600">
              <img
                src={photoPreview || '/image/olegAdmin.jpg'}
                alt="Profil"
                className="w-full h-full object-cover"
                onError={e => { e.currentTarget.src = '/image/olegAdmin.jpg'; }}
              />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-teal-600 hover:bg-teal-500 rounded-full flex items-center justify-center shadow-lg transition-colors"
            >
              <Camera size={14} className="text-white" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </div>
          <div>
            <p className="text-white font-semibold">{formData.firstName} {formData.lastName}</p>
            <p className="text-gray-400 text-sm">Administrator</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-xs text-teal-400 hover:text-teal-300 transition-colors"
            >
              Schimbă fotografia
            </button>
            <p className="text-xs text-gray-600 mt-1">JPG, PNG — max 5MB</p>
          </div>
        </div>
      </div>

      {/* Formular date */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Date Personale</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Prenume</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Nume</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Telefon</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Oraș</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Țara</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} className={inputClass} />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Save size={15} />
              Salvează modificările
            </button>
            {saved && <span className="text-teal-400 text-sm">✓ Salvat cu succes!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}


