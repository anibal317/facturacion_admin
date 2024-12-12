// app/dashboard/page.tsx
'use client'
import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MainContent from '../components/MainContent';

const Dashboard = () => {
  const { user } = useAuth();
  const router = useRouter();

  // Verificar si el usuario está autenticado y es admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  // Si el usuario no está autenticado, no renderizamos nada
  if (!user || user.role !== 'admin') {
    return null; // Evitar renderizar el contenido del dashboard
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />
        <MainContent />
      </main>
    </div>
  );
};

export default Dashboard;