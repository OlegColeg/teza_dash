"use client";

import React, { useState } from "react";
import { Lock, Mail, User, Phone, MapPin } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Autentificare eșuată");
      }

      // Salvează token-ul în localStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirecționează către dashboard
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (registerData.password !== registerData.confirmPassword) {
      setError("Parolele nu coincid");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          phone: registerData.phone,
          city: registerData.city,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Înregistrare eșuată");
      }

      // Salvează token-ul în localStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirecționează către dashboard
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
          <p className="text-gray-200 mt-2">
            {isLogin ? "Bine ai revenit!" : "Creează un cont nou"}
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 text-center font-semibold transition-all ${
              isLogin
                ? "bg-gray-700 text-white border-b-2 border-teal-500"
                : "text-gray-400 hover:bg-gray-750"
            }`}
          >
            Autentificare
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 text-center font-semibold transition-all ${
              !isLogin
                ? "bg-gray-700 text-white border-b-2 border-teal-500"
                : "text-gray-400 hover:bg-gray-750"
            }`}
          >
            Înregistrare
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        {isLogin ? (
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="email@exemplu.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Parola
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-teal-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Se încarcă..." : "Autentifică-te"}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Prenume
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={registerData.firstName}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, firstName: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Ion"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Nume
                </label>
                <input
                  type="text"
                  value={registerData.lastName}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, lastName: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Popescu"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="email@exemplu.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Telefon
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="tel"
                  value={registerData.phone}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, phone: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="+373 60 000 000"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Oraș
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={registerData.city}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, city: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Chișinău"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Parola
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Confirmă Parola
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, confirmPassword: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-teal-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Se încarcă..." : "Creează Cont"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}