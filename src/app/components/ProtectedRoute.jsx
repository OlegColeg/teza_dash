"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/app/utils/auth';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verifică dacă există token
        if (!authAPI.isAuthenticated()) {
          router.push('/auth');
          return;
        }

        // Opțional: verifică validitatea token-ului
        await authAPI.getProfile();
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication check failed:', error);
        authAPI.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}