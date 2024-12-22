import React, { useState, useEffect } from "react";
import { Home, Trophy, Settings, LogOut, ChevronLeft, ChevronRight, FileIcon as FileUser , CircleHelpIcon, LayoutList, LucideLink, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
  id: string;
  icon: React.ElementType;
  label: string;
  path: string;
  subItems?: MenuItem[];
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, isExpanded, toggleSidebar }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();
  
  const menuItems: MenuItem[] = [
    { id: 'home', icon: Home, label: 'Inicio', path: '/dashboard', subItems: [] },
    { id: 'benefits', icon: Settings, label: 'Beneficios', path: '/dashboard/benefits', subItems: [] },
    { id: 'plans', icon: Trophy, label: 'Planes', path: '', subItems: [
      { id: 'list-plans', icon: LayoutList, label: 'Tipos de Planes', path: '/dashboard/plans' },
      { id: 'list-plans-items', icon: Trophy, label: 'Funcionalidades', path: '/dashboard/plans/items' },
    ] },
    { id: 'clients', icon: FileUser , label: 'Clientes', path: '/dashboard/clients', subItems: [] },
    { id: 'faqs', icon: CircleHelpIcon, label: 'FAQs', path: '/dashboard/faqs', subItems: [] },
    { id: 'features', icon: LayoutList, label: 'Funcionalidades', path: '', subItems: [
      { id: 'list-features', icon: LayoutList, label: 'Funcionalidades', path: '/dashboard/features' },
      { id: 'list-plan-items', icon: Trophy, label: 'Características', path: '/dashboard/features/items' },
    ] },
    {
      id: 'links', icon: LucideLink, label: 'Links', path: '',
      subItems: [
        { id: 'list-navigation', icon: LayoutList, label: 'Navegación principal', path: '/dashboard/links' },
        { id: 'list-nav-items', icon: Trophy, label: 'Links', path: '/dashboard/links/items' },
      ]
    },
    { id: 'settings', icon: Settings, label: 'Configuración', path: '/dashboard/settings', subItems: [] },
  ];

  useEffect(() => {
    const currentOpenItem = menuItems.find(item =>
      pathname.startsWith(item.path) ||
      item.subItems?.some(subItem => pathname.startsWith(subItem.path))
    );
    if (currentOpenItem) {
      setExpandedItems(prev => {
        if (!prev.includes(currentOpenItem.id)) {
          return [...prev, currentOpenItem.id]; // Asegúrate de que el padre esté expandido
        }
        return prev;
      });
    }
  }, [pathname]);

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId] // Solo mantener el padre expandido
    );
  };

  const closeAllExpansions = () => {
    setExpandedItems([]);
  };

  const isActive = (item: MenuItem) => {
    return pathname === item.path || item.subItems?.some(subItem => pathname === subItem.path);
  };

  const renderMenuItem = (item: MenuItem) => {
    const active = isActive(item);
    const expanded = expandedItems.includes(item.id);

    return (
      <li key={item.id}>
        <div className="flex flex-col">
          <Link href={item.path} passHref>
            <button
              onClick={() => {
                if (item.subItems && item.subItems.length > 0) {
                  toggleExpand(item.id);
 } else {
                  setIsOpen(false); // Cierra el sidebar si no tiene subelementos
                }
              }}
              className={`w-full p-3 flex items-center justify-between hover:bg-gray-800 transition-colors ${active ? 'bg-blue-600' : ''}`}
              title={item.label}
            >
              <div className="flex items-center">
                <item.icon className="flex-shrink-0 w-6 h-6" />
                {isExpanded && <span className="ml-3">{item.label}</span>}
              </div>
              {item.subItems && item.subItems.length > 0 && isExpanded && (
                expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </Link>
          {item.subItems && item.subItems.length > 0 && expanded && isExpanded && (
            <ul className="space-y-2 mt-2 ml-4">
              {item.subItems.map(subItem => (
                <li key={subItem.id}>
                  <Link href={subItem.path} passHref>
                    <button
                      onClick={() => {
                        // No cerrar el padre al seleccionar un subelemento
                        setIsOpen(false); // Ocultar sidebar en móvil
                      }}
                      className={`w-full p-2 flex items-center hover:bg-gray-800 transition-colors ${pathname === subItem.path ? 'bg-blue-500' : ''}`}
                      title={subItem.label}
                    >
                      <subItem.icon className="flex-shrink-0 w-4 h-4" />
                      <span className="ml-2 text-sm">{subItem.label}</span>
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </li>
    );
  };

  useEffect(() => {
    if (isOpen) {
      const currentOpenItem = menuItems.find(item =>
        pathname.startsWith(item.path) ||
        item.subItems?.some(subItem => pathname.startsWith(subItem.path))
      );
      if (currentOpenItem) {
        setExpandedItems(prev => {
          if (!prev.includes(currentOpenItem.id)) {
            return [...prev, currentOpenItem.id]; // Asegúrate de que el padre esté expandido
          }
          return prev;
        });
      }
    } else {
      closeAllExpansions(); // Cerrar todas las expansiones al cerrar el sidebar
    }
  }, [isOpen]);

  return (
    <aside
      className={`bg-gray-900 text-white fixed top-0 left-0 z-40 h-[calc(100vh-var(--footer-height))] overflow-y-auto flex flex-col transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-all duration-300 md:translate-x-0 ${isExpanded ? "w-64" : "w-16"}`}
    >
      <div className="flex-grow py-6">
        <ul className="space-y-4">
          {menuItems.map(renderMenuItem)}
        </ul>
      </div>
      <div className="p-3">
        {isOpen && (
          <button
            onClick={() => {
              toggleSidebar();
              if (!isOpen) {
                setIsOpen(true); // Asegúrate de que el sidebar esté abierto
              } else {
                setIsOpen(false); // Ocultar sidebar al hacer clic en el menú hamburguesa
                closeAllExpansions(); // Cerrar todas las expansiones al cerrar el sidebar
              }
            }}
            className="block md:flex justify-center items-center hover:bg-gray-800 p-3 w-full transition-colors"
            title={isExpanded ? "Contraer Sidebar" : "Expandir Sidebar"}
          >
            {isExpanded ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
          </button>
        )}
        <button
          className="flex justify-center items-center bg-red-700 hover:bg-red-800 mt-2 p-3 w-full transition-colors"
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