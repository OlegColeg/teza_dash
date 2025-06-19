// src/app/team/page.jsx
"use client";

import React from "react";
import { Search, UserPlus, Edit, Trash2 } from "lucide-react";

export default function ManageTeam() {
  const teamMembers = [
    { id: 1, name: "Alexandru Popescu", email: "alex.popescu@exemplu.ro", role: "Administrator", department: "IT", status: "Activ" },
    { id: 2, name: "Maria Ionescu", email: "maria.ionescu@exemplu.ro", role: "Manager", department: "Vânzări", status: "Activ" },
    { id: 3, name: "Ion Vasile", email: "ion.vasile@exemplu.ro", role: "Dezvoltator", department: "IT", status: "Activ" },
    { id: 4, name: "Elena Stoica", email: "elena.stoica@exemplu.ro", role: "Designer", department: "Marketing", status: "Inactiv" },
    { id: 5, name: "Andrei Munteanu", email: "andrei.m@exemplu.ro", role: "Analist", department: "Financiar", status: "Activ" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">GESTIONARE ECHIPĂ</h1>
          <p className="text-gray-400">Administrează membrii echipei tale</p>
        </div>
        <button 
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded flex items-center"
        >
          <UserPlus size={18} className="mr-2" />
          ADAUGĂ MEMBRU
        </button>
      </div>

      {/* Căutare */}
      <div className="bg-dark-800 p-4 rounded-lg">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Caută membri..."
            className="w-full bg-dark-700 text-gray-300 rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-dark-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-white mb-4">Membrii echipei</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-dark-700 rounded-lg">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left text-gray-300">Nume</th>
                <th className="py-3 px-4 text-left text-gray-300">Email</th>
                <th className="py-3 px-4 text-left text-gray-300">Rol</th>
                <th className="py-3 px-4 text-left text-gray-300">Departament</th>
                <th className="py-3 px-4 text-left text-gray-300">Status</th>
                <th className="py-3 px-4 text-center text-gray-300">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map(member => (
                <tr key={member.id} className="border-b border-gray-700 hover:bg-dark-600">
                  <td className="py-3 px-4 text-gray-300">{member.name}</td>
                  <td className="py-3 px-4 text-gray-300">{member.email}</td>
                  <td className="py-3 px-4 text-gray-300">{member.role}</td>
                  <td className="py-3 px-4 text-gray-300">{member.department}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${member.status === 'Activ' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button 
                      className="text-blue-500 hover:text-blue-400 mx-1"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-400 mx-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}