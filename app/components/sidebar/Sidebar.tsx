import React, { useState } from "react";
import { Home, ShoppingCart, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, isExpanded, toggleSidebar }) => {
  const [selectedOption, setSelectedOption] = useState('home');

  const menuItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'orders', icon: ShoppingCart, label: 'Pedidos' },
    { id: 'settings', icon: Settings, label: 'Configuración' },
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

