"use client";

import React, { useState } from "react";
import { PlusCircle, MinusCircle, HelpCircle } from "lucide-react";

export default function FAQPage() {
  // FAQ data cu text Lorem Ipsum
  const faqData = [
    {
      question: "Lorem ipsum dolor sit amet?",
      answer: "Consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue."
    },
    {
      question: "Sed posuere consectetur est at lobortis?",
      answer: "Cras justo odio, dapibus ac facilisis in, egestas eget quam."
    },
    {
      question: "Integer posuere erat a ante venenatis?",
      answer: "Duis mollis, est non commodo luctus, nisi erat porttitor ligula."
    },
    {
      question: "Curabitur blandit tempus porttitor?",
      answer: "Maecenas faucibus mollis interdum. Etiam porta sem malesuada magna mollis euismod."
    },
    {
      question: "Nulla vitae elit libero a pharetra augue?",
      answer: "Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna."
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