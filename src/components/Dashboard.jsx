import React from "react";

export default function Dashboard() {
  return (
    <> 
    <div className="flex justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">DASHBOARD</h1>
        <p className="text-gray-400">Welcome to your dashboard</p>
      </div>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        DOWNLOAD REPORTS
      </button>
    </div>

    </>
  );
}