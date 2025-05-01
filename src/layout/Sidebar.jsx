"use client";

import React, { useState } from 'react';
import { ChevronDown, Home, Users, FileText, FilePlus, Calendar, HelpCircle, BarChart2, PieChart, TrendingUp, Map } from 'lucide-react';
import Navbar from './Navbar';
import Content from '@/app/content';
const Sidebar = () => {
  const [expanded, setExpanded] = useState({
    data: true,
    pages: true,
    charts: true
  });
  
  // Add state to track sidebar visibility
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSection = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  return (
    <>
      {/* Hamburger button when sidebar is collapsed */}
<div className='flex w-full justify-between '>
      {!sidebarVisible && (
        <>
         {/* <div className='flex w-full'> */}
        <button 
          onClick={toggleSidebar} 
          className=" top-3 left-4 z-20 text-white bg-gray-800 p-2 m-3  rounded-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
{/*        
          <Navbar />
        </div> */}
        </>
      )}
      
      {/* Main sidebar - will be hidden when sidebarVisible is false */}

      <div className={`max-h-100 overflow-y-auto
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 border-r border-e-slate-950 w-64 min-h-screen bg-gray-900 text-gray-300 flex flex-col transition-all duration-300 ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'} fixed top-0 left-0 z-10  `}>
        {/* Logo and Brand */}
        <div className="py-4 px-6 flex items-center">
          <h1 className="text-xl font-semibold text-white">ADMINIS</h1>
          <button className="ml-auto text-gray-400" onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* User Profile */}
        <div className="px-6 py-6 flex flex-col items-center border-b border-gray-800">
          <div className="h-20 w-20 rounded-full overflow-hidden mb-4">
            <img src="/image/olegAdmin.jpg" alt="User profile" className="h-full w-full object-cover" />
          </div>
          <h2 className="text-xl font-semibold text-white">Oală Oală</h2>
          <p className="text-sm text-gray-400">VP Fancy Admin</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {/* Dashboard */}
          <div className="px-3 py-2">
            <a href="#" className="flex items-center px-3 py-2 text-blue-400 bg-blue-900 bg-opacity-30 rounded-md">
              <Home size={20} className="mr-3" />
              <span>Dashboard</span>
            </a>
          </div>

          {/* Data Section */}
          <div className="mt-6">
            <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Data
            </div>
            <div className="px-3">
              <a href="#" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md">
                <Users size={20} className="mr-3" />
                <span>Manage Team</span>
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md">
                <FileText size={20} className="mr-3" />
                <span>Contacts Information</span>
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md">
                <FilePlus size={20} className="mr-3" />
                <span>Invoices Balances</span>
              </a>
            </div>
          </div>

          {/* Pages Section */}
          <div className="mt-6">
            <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Pages
            </div>
            <div className="px-3">
              <a href="#" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md">
                <Users size={20} className="mr-3" />
                <span>Profile Form</span>
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md">
                <Calendar size={20} className="mr-3" />
                <span>Calendar</span>
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md">
                <HelpCircle size={20} className="mr-3" />
                <span>FAQ Page</span>
              </a>
            </div>
          </div>

          {/* Charts Section */}
          <div className="mt-6">
            <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Charts
            </div>
            <div className="px-3">
              <a href="#" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md">
                <BarChart2 size={20} className="mr-3" />
                <span>Bar Chart</span>
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md">
                <PieChart size={20} className="mr-3" />
                <span>Pie Chart</span>
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md">
                <TrendingUp size={20} className="mr-3" />
                <span>Line Chart</span>
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md">
                <Map size={20} className="mr-3" />
                <span>Geography Chart</span>
              </a>
            </div>
          </div>
        </nav>
      </div>
      <div className={`w-full transition-all duration-300 ${sidebarVisible ? 'ml-64' : 'ml-0'}` }>

<Navbar />

</div>

      </div>
      <div className={`w-100% py-2 px-5 transition-all duration-300 ${sidebarVisible ? 'ml-64' : 'ml-0'}` }>
<Content />


</div>


      {/* Content area */}
   
    </>
  );
};

export default Sidebar;