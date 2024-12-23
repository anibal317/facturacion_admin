// components/IconGrid.tsx

'use client';
import React, { useState, useEffect, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

const IconGrid: React.FC = () => {
  // Obtener las claves de los íconos (solo los nombres) y filtrar los que terminan en "Icon"
  const validIcons = useMemo(() => {
    return Object.keys(LucideIcons).filter(iconName => !iconName.endsWith('Icon'));
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const iconsPerPage = 10; // Cambia esto según tus necesidades
  const [filterLetter, setFilterLetter] = useState('');
  const [filteredIcons, setFilteredIcons] = useState<string[]>(validIcons); // Estado para los iconos filtrados

  // Efecto para actualizar los iconos filtrados cuando cambian los criterios
  useEffect(() => {
    const newFilteredIcons = validIcons.filter(item => {
      const matchesSearch = item.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLetter = filterLetter ? item.startsWith(filterLetter) : true;
      return matchesSearch && matchesLetter;
    });
    setFilteredIcons(newFilteredIcons);
    setCurrentPage(0); // Reiniciar a la primera página al filtrar
  }, [searchTerm, filterLetter, validIcons]);

  // Calcular el total de páginas
  const totalPages = Math.ceil(filteredIcons.length / iconsPerPage);
  const paginatedIcons = filteredIcons.slice(currentPage * iconsPerPage, (currentPage + 1) * iconsPerPage);

  // Función para copiar al portapapeles
  const copyToClipboard = (iconName: string) => {
    navigator.clipboard.writeText(iconName).then(() => {
      alert(`Copiado: ${iconName}`);
    }).catch(err => {
      console.error('Error al copiar al portapapeles: ', err);
    });
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 font-bold text-2xl">Iconos</h1>
      <p className="mb-4">Total de iconos: {filteredIcons.length}</p>
      
      <input
        type="text"
        placeholder="Buscar íconos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border-gray-300 mb-4 p-2 border rounded-md w-full"
      />

      <div className="mb-4">
        {Array.from(new Set(validIcons.map(icon => icon.charAt(0).toUpperCase()))).map(letter => (
          <button
            key={letter}
            onClick={() => setFilterLetter(letter)}
            className="bg-blue-500 hover:bg-blue-600 mr-2 px-2 py-1 rounded-md text-white"
          >
            {letter}
          </button>
        ))}
        <button
          onClick={() => {
            setFilterLetter(''); // Restablecer el filtro de letra
            setSearchTerm(''); // Restablecer el término de búsqueda
          }}
          className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded-md text-gray-700"
        >
          Mostrar todos
        </button>
      </div>

      <div className="gap-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {paginatedIcons.map((item) => {
          const IconComponent = LucideIcons[item as keyof typeof LucideIcons] as LucideIcon | undefined;

          return (
            <div
              key={item}
              className="flex flex-col items-center border-gray-300 hover:shadow-lg p-4 border rounded-lg transition-shadow cursor-pointer"
              onClick={() => copyToClipboard(item)}
            >
              {IconComponent && <IconComponent size={48} className="mb-2" />}
              <p className="text-center text-sm">{item}</p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-white"
        >
          Anterior
        </button>
        <span>Página {currentPage + 1} de {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
          disabled={currentPage === totalPages - 1}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-white"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default IconGrid;