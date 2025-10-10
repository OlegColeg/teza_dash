"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import Sidebar from "@/app/components/layout/Sidebar";
import Navbar from "@/app/components/layout/Navbar";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { authAPI } from "@/app/utils/auth";

export default function RootLayout({ children }) {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const pathname = usePathname();
  
  // Pagini publice care nu necesită autentificare
  const publicPages = ['/auth'];
  const isPublicPage = publicPages.includes(pathname);

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  // Dacă suntem pe o pagină publică, afișează doar conținutul
  if (isPublicPage) {
    return (
      <html lang="ro">
        <head>
          <title>Dashboard Oală Oleg</title>
        </head>
        <body>
          {children}
        </body>
      </html>
    );
  }

  // Pentru toate celelalte pagini, folosește layout-ul cu sidebar + protecție
  return (
    <html lang="ro">
      <head>
        <title>Dashboard Oală Oleg</title>
      </head>
      <body>
        <ProtectedRoute>
          <div className="flex">
            <Sidebar sidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} />
            
            <div className={`flex flex-col flex-1 transition-all duration-300 ${sidebarVisible ? 'ml-64' : 'ml-0'}`}>
              <Navbar toggleSidebar={toggleSidebar} sidebarVisible={sidebarVisible} />
              
              <main className="p-5">
                {children}
              </main>
            </div>
          </div>
        </ProtectedRoute>
      </body>
    </html>
  );
}