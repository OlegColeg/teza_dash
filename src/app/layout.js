// src/app/layout.js - Layout-ul principal
"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import "./globals.css";
import Sidebar from "@/app/components/layout/Sidebar";
import Navbar from "@/app/components/layout/Navbar";
import AccessibilityPanel from "@/app/components/AccessibilityPanel";

const PUBLIC_PATHS = ['/login', '/register'];

export default function RootLayout({ children }) {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // Aplică tema la mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // Verifică autentificarea
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthChecked(true);
      return;
    }
    // Validează token-ul pe server — dacă e expirat/invalid, delogăm
    fetch('/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.valid && data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('profilePhoto');
        }
      })
      .catch(() => {
        // Rețea offline — folosim datele locale ca fallback
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            setUser(JSON.parse(userData));
            setIsLoggedIn(true);
          } catch {}
        }
      })
      .finally(() => setAuthChecked(true));
  }, []);

  // Redirect la login dacă nu e autentificat
  useEffect(() => {
    if (!authChecked) return;
    if (!isPublicPath && !isLoggedIn) {
      router.replace('/login');
    }
  }, [authChecked, isLoggedIn, pathname]);

  const applyTheme = (t) => {
    if (t === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleSidebar = () => setSidebarVisible(prev => !prev);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Nota: profilePhoto este stocat per user ID (profilePhoto_${id}), nu se șterge la logout
    // pentru că este asociat explicit unui user și nu va afecta alți utilizatori
    setUser(null);
    setIsLoggedIn(false);
    fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <html lang="ro">
      <head>
        <title>Dashboard Oală Oleg</title>
      </head>
      <body>
        {isPublicPath ? (
          // Pagini publice (login/register) — fără sidebar/navbar
          <>{children}</>
        ) : !authChecked ? (
          // Loading cât verificăm auth
          <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm">Se încarcă...</p>
            </div>
          </div>
        ) : isLoggedIn ? (
          <div className="flex">
            <Sidebar
              sidebarVisible={sidebarVisible}
              toggleSidebar={toggleSidebar}
              user={user}
              onLogout={handleLogout}
            />
            <div className={`flex flex-col flex-1 transition-all duration-300 ${sidebarVisible ? 'ml-64' : 'ml-0'}`}>
              <Navbar
                toggleSidebar={toggleSidebar}
                sidebarVisible={sidebarVisible}
                theme={theme}
                toggleTheme={toggleTheme}
                user={user}
                onLogout={handleLogout}
                onOpenAccessibility={() => setAccessibilityOpen(true)}
              />
              <main className="p-5">
                {children}
              </main>
            </div>
            <AccessibilityPanel open={accessibilityOpen} onClose={() => setAccessibilityOpen(false)} />
          </div>
        ) : null}
      </body>
    </html>
  );
}