"use client";

import React, { useState } from "react";

export default function SimpleProfilePage() {
  const [profileData, setProfileData] = useState({
    firstName: "Oală",
    lastName: "Oală",
    email: "ooale47@gmail.com",
    phone: "+373 604 35 197",
    city: "Bălți",
    country: "Moldova",
  });

  const [formData, setFormData] = useState({ ...profileData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfileData({ ...formData });
    alert("Datele au fost actualizate.");
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-100 text-center">Profilul Meu</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Prenume</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Nume</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Telefon</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Oraș</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Țara</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded"
        >
          Salvează
        </button>
      </form>
    </div>
  );
}