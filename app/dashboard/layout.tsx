'use client';
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/footer/Footer";
import { useState, useEffect } from 'react';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Contenedor principal */}
      <div className="flex flex-1 overflow-hidden">
        {isClient && (
          <Sidebar
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            isExpanded={isSidebarExpanded}
            toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
          />
        )}
        <div className={`flex-1 flex flex-col ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-16'}`}>
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          {/* Área de contenido con scroll vertical */}
          <main className="flex-1 bg-gray-100 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      {/* Footer sticky */}
      <Footer  />
    </div>
  );
}
