// src/app/team/page.jsx
"use client";

import React, { useState } from "react";
import { Users, Search, UserPlus, Edit, Trash2, Check, X } from "lucide-react";

export default function ManageTeam() {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: "Alexandru Popescu", email: "alex.popescu@exemplu.ro", role: "Administrator", department: "IT", status: "Activ" },
    { id: 2, name: "Maria Ionescu", email: "maria.ionescu@exemplu.ro", role: "Manager", department: "Vânzări", status: "Activ" },
    { id: 3, name: "Ion Vasile", email: "ion.vasile@exemplu.ro", role: "Dezvoltator", department: "IT", status: "Activ" },
    { id: 4, name: "Elena Stoica", email: "elena.stoica@exemplu.ro", role: "Designer", department: "Marketing", status: "Inactiv" },
    { id: 5, name: "Andrei Munteanu", email: "andrei.m@exemplu.ro", role: "Analist", department: "Financiar", status: "Activ" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    status: "Activ"
  });
  const [editMember, setEditMember] = useState({});

  // Filtrare membri după căutare
  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Adăugare membru nou
  const handleAddMember = () => {
    if (newMember.name && newMember.email && newMember.role && newMember.department) {
      setTeamMembers([...teamMembers, { 
        id: teamMembers.length + 1,
        ...newMember 
      }]);
      setNewMember({
        name: "",
        email: "",
        role: "",
        department: "",
        status: "Activ"
      });
      setIsAdding(false);
    }
  };

  // Inițializare editare
  const startEditing = (member) => {
    setEditingId(member.id);
    setEditMember({ ...member });
  };

  // Salvare modificări
  const saveEditing = () => {
    setTeamMembers(teamMembers.map(member => 
      member.id === editingId ? editMember : member
    ));
    setEditingId(null);
  };

  // Ștergere membru
  const deleteMember = (id) => {
    if (confirm("Ești sigur că vrei să ștergi acest membru?")) {
      setTeamMembers(teamMembers.filter(member => member.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">GESTIONARE ECHIPĂ</h1>
          <p className="text-gray-400">Administrează membrii echipei tale</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded flex items-center"
        >
          <UserPlus size={18} className="mr-2" />
          ADAUGĂ MEMBRU
        </button>
      </div>

      {/* Căutare și filtrare */}
      <div className="bg-dark-800 p-4 rounded-lg">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Caută membri..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-700 text-gray-300 rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* Formular adăugare membru */}
      {isAdding && (
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-white mb-4">Adaugă membru nou</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-400 mb-1">Nume</label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                className="w-full bg-dark-700 text-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                className="w-full bg-dark-700 text-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Rol</label>
              <input
                type="text"
                value={newMember.role}
                onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                className="w-full bg-dark-700 text-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Departament</label>
              <input
                type="text"
                value={newMember.department}
                onChange={(e) => setNewMember({...newMember, department: e.target.value})}
                className="w-full bg-dark-700 text-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button 
              onClick={() => setIsAdding(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Anulează
            </button>
            <button 
              onClick={handleAddMember}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
            >
              Adaugă
            </button>
          </div>
        </div>
      )}

      {/* Tabel cu membrii echipei */}
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
              {filteredMembers.map(member => (
                <tr key={member.id} className="border-b border-gray-700 hover:bg-dark-600">
                  {editingId === member.id ? (
                    <>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editMember.name}
                          onChange={(e) => setEditMember({...editMember, name: e.target.value})}
                          className="w-full bg-dark-600 text-gray-300 rounded px-2 py-1"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="email"
                          value={editMember.email}
                          onChange={(e) => setEditMember({...editMember, email: e.target.value})}
                          className="w-full bg-dark-600 text-gray-300 rounded px-2 py-1"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editMember.role}
                          onChange={(e) => setEditMember({...editMember, role: e.target.value})}
                          className="w-full bg-dark-600 text-gray-300 rounded px-2 py-1"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editMember.department}
                          onChange={(e) => setEditMember({...editMember, department: e.target.value})}
                          className="w-full bg-dark-600 text-gray-300 rounded px-2 py-1"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={editMember.status}
                          onChange={(e) => setEditMember({...editMember, status: e.target.value})}
                          className="bg-dark-600 text-gray-300 rounded px-2 py-1"
                        >
                          <option value="Activ">Activ</option>
                          <option value="Inactiv">Inactiv</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button 
                          onClick={saveEditing}
                          className="text-green-500 hover:text-green-400 mx-1"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          onClick={() => setEditingId(null)}
                          className="text-red-500 hover:text-red-400 mx-1"
                        >
                          <X size={18} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
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
                          onClick={() => startEditing(member)}
                          className="text-blue-500 hover:text-blue-400 mx-1"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => deleteMember(member.id)}
                          className="text-red-500 hover:text-red-400 mx-1"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-4 px-4 text-center text-gray-400">
                    Nu s-au găsit membri care să corespundă căutării.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}