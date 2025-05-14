// src/app/layout.js - Layout-ul principal
"use client";

import { useState } from "react";
import "./globals.css";
import Sidebar from "@/layout/Sidebar";
import Navbar from "@/layout/Navbar";

export default function RootLayout({ children }) {
  // Mută starea sidebarVisible în layout-ul principal pentru a o partaja între componente
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  return (
    <html lang="en">
      <body className="bg-dark-900">
        <div className="flex">
          {/* Sidebar Component */}
          <Sidebar sidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} />
          
          {/* Main Content Area */}
          <div className={`flex flex-col flex-1 transition-all duration-300 ${sidebarVisible ? 'ml-64' : 'ml-0'}`}>
            {/* Navbar Component */}
            <Navbar toggleSidebar={toggleSidebar} sidebarVisible={sidebarVisible} />
            
            {/* Page Content */}
            <main className="p-5">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}