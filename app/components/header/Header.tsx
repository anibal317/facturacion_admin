import React from 'react';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  toggleSidebar: () => void;
}

const routeTitles: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/dashboard/icons': 'Iconos Disponibles',
  '/dashboard/clients': 'Clientes',
  '/dashboard/benefits': 'Beneficios',
  '/dashboard/faqs': 'Preguntas Frecuentes',
  '/dashboard/features': 'Funcioanlidades',
  '/dashboard/features/items': 'Características',
  '/dashboard/links': 'Navegación Principal',
  '/dashboard/links/items': 'Items de Navegación',
  '/dashboard/plans': 'Planes',
  '/dashboard/plans/items': 'Item Planes',
  '/dashboard/settings': 'Configuración',
  // Agrega más rutas según tu app
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const pathname = usePathname();
  const title = routeTitles[pathname] || 'Dashboard';

  return (
    <header className="z-30 bg-white shadow p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="md:hidden mr-4 text-gray-600 hover:text-gray-900"
            onClick={toggleSidebar}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="font-bold text-gray-800 text-2xl">{title}</h1>
        </div>
        <div className="flex items-center">
          <img
            src="/avatar/girl.svg"
            alt="Avatar"
            className="border-2 border-gray-300 rounded-full w-12 h-12"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;

