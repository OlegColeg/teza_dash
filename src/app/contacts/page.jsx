"use client";

import React from "react";
import { Search, UserPlus, Trash2, Star } from "lucide-react";

export default function ContactsPage() {
  // Date statice pentru afișare vizuală
  const contacts = [
    { id: 1, name: "Oală Oleg", email: "ooale47@gmail.com", phone: "+373060435197", favorite: true, image: "image/olegAdmin.jpg" },
    { id: 2, name: "Lumina Lumii", email: "bisericaluminalumii@gmail.com", phone: "0231 75 109", favorite: true, image: "image/bll.jpg" },
    { id: 3, name: "Ion Vasile", email: "ion.vasile@exemplu.md", phone: "+37379012345", favorite: true, image: "https://placehold.co/100" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-white">CONTACTE</h1>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded flex items-center">
          <UserPlus size={18} className="mr-2" />
          ADAUGĂ
        </button>
      </div>

      {/* Căutare */}
      <div className="bg-dark-800 p-4 rounded-lg">
        <div className="relative w-full">
          <input type="text" placeholder="Caută contacte..." className="w-full bg-dark-700 text-gray-300 rounded pl-10 pr-4 py-2" />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* Lista de contacte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map(contact => (
          <div key={contact.id} className="bg-dark-800 rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
                <img src={contact.image} alt={contact.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                  <button className={contact.favorite ? 'text-yellow-400' : 'text-gray-500'}>
                    <Star size={20} fill={contact.favorite ? "currentColor" : "none"} />
                  </button>
                </div>
                <p className="text-gray-400">{contact.email}</p>
                <p className="text-gray-400">{contact.phone}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="text-red-400 flex items-center">
                <Trash2 size={16} className="mr-1" />
                <span>Șterge</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}