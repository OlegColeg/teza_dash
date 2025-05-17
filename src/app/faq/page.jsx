"use client";

import React, { useState } from "react";
import { PlusCircle, MinusCircle, HelpCircle } from "lucide-react";

export default function FAQPage() {
  // FAQ data
  const faqData = [
    {
      question: "Cum pot exporta datele din grafice?",
      answer: "Pentru a exporta datele din grafice, apăsați butonul 'EXPORTĂ GRAFIC' din partea dreaptă sus a paginii. Datele vor fi exportate în format CSV sau PNG."
    },
    {
      question: "Cum pot adăuga utilizatori noi în sistem?",
      answer: "Pentru a adăuga utilizatori noi, navigați la secțiunea 'Manage Team' din meniul lateral, apoi apăsați butonul 'Adaugă Utilizator'. Completați formularul cu informațiile necesare și apăsați 'Salvează'."
    },
    {
      question: "Cum pot genera rapoarte personalizate?",
      answer: "Pentru rapoarte personalizate, accesați pagina 'Dashboard', selectați perioada dorită și filtrele relevante, apoi apăsați butonul 'DOWNLOAD REPORTS' pentru a genera și descărca raportul."
    },
    {
      question: "Ce reprezintă graficele de pe Dashboard?",
      answer: "Graficele de pe Dashboard reprezintă date analitice despre vânzări, venituri și profit. Acestea sunt actualizate în timp real și oferă o privire de ansamblu asupra performanței afacerii."
    },
    {
      question: "Cum pot modifica parolele utilizatorilor?",
      answer: "Pentru a modifica parola unui utilizator, accesați secțiunea 'Manage Team', găsiți utilizatorul respectiv, apăsați pe iconița de editare și selectați opțiunea 'Resetare parolă'."
    }
  ];

  const [expandedItems, setExpandedItems] = useState({});

  const toggleFAQ = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">FAQ</h1>
          <p className="text-gray-400">Întrebări frecvente și răspunsuri</p>
        </div>
      </div>

      {/* FAQ Cards */}
      <div className="grid grid-cols-1 gap-4">
        {faqData.map((faq, index) => (
          <div key={index} className="bg-dark-800 rounded-lg shadow">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex items-center">
                <HelpCircle size={20} className="text-teal-500 mr-3" />
                <h3 className="font-semibold text-white">{faq.question}</h3>
              </div>
              {expandedItems[index] ? (
                <MinusCircle size={20} className="text-teal-500" />
              ) : (
                <PlusCircle size={20} className="text-teal-500" />
              )}
            </div>
            {expandedItems[index] && (
              <div className="px-4 pb-4 pt-2 text-gray-300 border-t border-gray-700">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Support Card */}
      <div className="bg-dark-800 p-6 rounded-lg shadow mt-6">
        <h2 className="text-xl font-semibold text-white mb-4">Nu ai găsit răspunsul?</h2>
        <p className="text-gray-300 mb-4">Dacă nu ai găsit răspunsul la întrebarea ta, contactează echipa noastră de suport.</p>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded">
          Contactează Suport
        </button>
      </div>
    </div>
  );
}