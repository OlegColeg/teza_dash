// src/layout/Navbar.jsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sun, Moon, Bell, Settings, ChevronDown, User, LogOut,
  HelpCircle, Menu, Search, X, Accessibility, FileText,
  Users, DollarSign, Calendar, AlertTriangle
} from 'lucide-react';

const PAGES = [
  { label: 'Dashboard', href: '/', icon: 'Home' },
  { label: 'Echipe', href: '/dashboard/team', icon: 'Users' },
  { label: 'Angajați', href: '/employees', icon: 'Briefcase' },
  { label: 'Calendar Rezervări', href: '/calendar', icon: 'Calendar' },
  { label: 'Finanțe', href: '/finances', icon: 'DollarSign' },
  { label: 'Datorii', href: '/debts', icon: 'AlertTriangle' },
  { label: 'Calculator Bancnote', href: '/cash-calculator', icon: 'Calculator' },
  { label: 'Grafic Bare', href: '/charts/bar', icon: 'BarChart2' },
  { label: 'Grafic Circular', href: '/charts/pie', icon: 'PieChart' },
  { label: 'Grafic Liniar', href: '/charts/line', icon: 'TrendingUp' },
  { label: 'Hartă Geografică', href: '/charts/geo', icon: 'Map' },
  { label: 'Profil', href: '/profile', icon: 'User' },
  { label: 'Facturi', href: '/invoices', icon: 'FileText' },
  { label: 'Contacte', href: '/contacts', icon: 'Phone' },
  { label: 'FAQ', href: '/faq', icon: 'HelpCircle' },
];

export default function Navbar({ toggleSidebar, sidebarVisible, theme, toggleTheme, user, onLogout, onOpenAccessibility }) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const profileRef = useRef(null);
  const settingsRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setSettingsOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = useCallback(async (q) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); setSearchOpen(false); return; }
    setSearchOpen(true);
    setSearchLoading(true);
    const lower = q.toLowerCase();
    // Căutare locală în pagini
    const pageMatches = PAGES.filter(p => p.label.toLowerCase().includes(lower)).slice(0, 3);
    // Fetch echipe + finanțe rapid
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const [teamsRes, finRes] = await Promise.all([
        fetch('/api/teams', { headers }),
        fetch('/api/finances', { headers }),
      ]);
      const teams = teamsRes.ok ? await teamsRes.json() : [];
      const fins = finRes.ok ? await finRes.json() : [];
      const teamMatches = (teams.data || teams || [])
        .filter(t => t.name?.toLowerCase().includes(lower))
        .slice(0, 3)
        .map(t => ({ label: t.name, sub: `Echipă · Sold: ${t.balance ?? 0} MDL`, href: '/dashboard/team', type: 'team' }));
      const finMatches = (fins.data || fins || [])
        .filter(f => f.description?.toLowerCase().includes(lower) || f.category?.toLowerCase().includes(lower))
        .slice(0, 3)
        .map(f => ({ label: f.description || f.category, sub: `${f.type === 'income' ? '+' : '-'}${f.amount} MDL · ${f.date}`, href: '/finances', type: 'finance' }));
      setSearchResults([
        ...pageMatches.map(p => ({ label: p.label, sub: 'Pagină', href: p.href, type: 'page' })),
        ...teamMatches,
        ...finMatches,
      ]);
    } catch {
      setSearchResults(pageMatches.map(p => ({ label: p.label, sub: 'Pagină', href: p.href, type: 'page' })));
    }
    setSearchLoading(false);
  }, []);

  const goToResult = (href) => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    router.push(href);
  };

  return (
    <header className="bg-gray-900 sticky top-0 z-10 border-b border-gray-800">
      <div className="px-4 py-3 flex w-full justify-between items-center gap-3">

        {/* Hamburger în navbar */}
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
          title={sidebarVisible ? 'Ascunde meniu' : 'Arată meniu'}
        >
          <Menu size={20} />
        </button>

        {/* Căutare funcțională */}
        <div className="relative flex-1 max-w-sm" ref={searchRef}>
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => searchQuery && setSearchOpen(true)}
            placeholder="Caută pagini, echipe, finanțe..."
            className="w-full bg-gray-800 focus:bg-gray-750 text-gray-300 rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400 text-sm transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setSearchResults([]); setSearchOpen(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X size={13} />
            </button>
          )}

          {/* Dropdown rezultate */}
          {searchOpen && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              {searchLoading ? (
                <div className="px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
                  <div className="w-3 h-3 border border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                  Se caută...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">Niciun rezultat găsit</div>
              ) : (
                searchResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => goToResult(r.href)}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-gray-700 transition-colors text-left"
                  >
                    <span className={`mt-0.5 text-xs px-1.5 py-0.5 rounded font-medium ${
                      r.type === 'page' ? 'bg-blue-900/50 text-blue-300' :
                      r.type === 'team' ? 'bg-teal-900/50 text-teal-300' :
                      'bg-green-900/50 text-green-300'
                    }`}>{r.type === 'page' ? 'P' : r.type === 'team' ? 'E' : 'F'}</span>
                    <div>
                      <p className="text-sm text-white">{r.label}</p>
                      <p className="text-xs text-gray-500">{r.sub}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Butoane dreapta */}
        <div className="flex items-center space-x-1">

          {/* Toggle temă */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Temă luminoasă' : 'Temă întunecată'}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Accesibilitate */}
          <button
            onClick={onOpenAccessibility}
            title="Accesibilitate"
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Accessibility size={19} />
          </button>

          {/* Notificări */}
          <button
            title="Notificări"
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors relative"
          >
            <Bell size={19} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
          </button>

          {/* Setări */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => { setSettingsOpen(o => !o); setProfileOpen(false); }}
              title="Setări"
              className={`p-2 rounded-lg transition-colors ${settingsOpen ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            >
              <Settings size={19} />
            </button>

            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Setări aplicație</p>
                </div>
                <div className="px-4 py-3 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-300 font-medium">Temă interfață</p>
                      <p className="text-xs text-gray-500 mt-0.5">{theme === 'dark' ? 'Mod întunecat' : 'Mod luminos'}</p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${theme === 'light' ? 'bg-teal-500' : 'bg-gray-600'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${theme === 'light' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => { setSettingsOpen(false); onOpenAccessibility?.(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <Accessibility size={16} className="text-gray-500" />
                  Accesibilitate
                </button>
                <Link
                  href="/faq"
                  onClick={() => setSettingsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <HelpCircle size={16} className="text-gray-500" />
                  Ajutor & FAQ
                </Link>
              </div>
            )}
          </div>

          {/* Profil */}
          <div className="relative ml-1" ref={profileRef}>
            <button
              onClick={() => { setProfileOpen(o => !o); setSettingsOpen(false); }}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${profileOpen ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
            >
              <div className="w-7 h-7 rounded-full overflow-hidden bg-teal-600 flex items-center justify-center flex-shrink-0">
                <img
                  src={typeof window !== 'undefined' && user?.id ? (localStorage.getItem(`profilePhoto_${user.id}`) || '/image/olegAdmin.jpg') : '/image/olegAdmin.jpg'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={e => { e.currentTarget.src = '/image/olegAdmin.jpg'; }}
                />
              </div>
              <span className="text-sm text-gray-300 hidden md:block max-w-24 truncate">
                {user?.username || 'Admin'}
              </span>
              <ChevronDown size={13} className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-sm font-semibold text-white">{user?.username || 'Admin'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Administrator</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <User size={15} className="text-gray-500" />
                  Profilul meu
                </Link>
                <div className="border-t border-gray-700">
                  <button
                    onClick={() => { setProfileOpen(false); onLogout?.(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                  >
                    <LogOut size={15} />
                    Deconectare
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

