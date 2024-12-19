import React, { useState } from "react";
import { Home, Trophy, Settings, LogOut, ChevronLeft, ChevronRight, FileUser , CircleHelpIcon, LayoutList, Link as LucideLink } from 'lucide-react';
import Link from 'next/link'; // Importa el componente Link de Next.js

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, isExpanded, toggleSidebar }) => {
  const [selectedOption, setSelectedOption] = useState('home');

  const menuItems = [
    { id: 'home', icon: Home, label: 'Inicio', path: '/dashboard' },
    { id: 'plans', icon: Trophy, label: 'Planes', path: '/dashboard/plans' },
    { id: 'clients', icon: FileUser , label: 'Clientes', path: '/dashboard/clients' },
    { id: 'faqs', icon: CircleHelpIcon, label: 'FAQs', path: '/dashboard/faqs' },
    { id: 'features', icon: LayoutList, label: 'Funcionalidades', path: '/dashboard/features' },
    { id: 'links', icon: LucideLink, label: 'Links', path: '/dashboard/links' },
    { id: 'settings', icon: Settings, label: 'Configuración', path: '/dashboard/settings' },
  ];

  return (
    <aside
      className={`bg-gray-900 text-white fixed top-0 left-0 z-40 h-[calc(100vh-var(--footer-height))] overflow-y-auto flex flex-col transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-all duration-300 md:translate-x-0 ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      <div className="flex-grow py-6">
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link href={item.path} passHref>
                <button
                  onClick={() => setSelectedOption(item.id)}
                  className={`w-full p-3 flex items-center hover:bg-gray-800 transition-colors ${
                    selectedOption === item.id ? 'bg-blue-600' : ''
                  }`}
                  title={item.label}
                >
                  <item.icon className="flex-shrink-0 w-6 h-6" />
                  {isExpanded && <span className="ml-3">{item.label}</span>}
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-3">
        <button
          onClick={toggleSidebar}
          className="flex justify-center items-center hover:bg-gray-800 p-3 w-full transition-colors"
          title={isExpanded ? "Contraer Sidebar" : "Expandir Sidebar"}
        >
          {isExpanded ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </button>
        <button
          className="flex justify-center items-center bg-red-700 hover:bg-gray-800 mt-2 p-3 w-full transition-colors"
          title="Cerrar Sesión"
        >
          <LogOut className="w-6 h-6" />
          {isExpanded && <span className="ml-3">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;