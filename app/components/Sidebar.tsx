// app/components/Sidebar.tsx
import React from 'react';

const Sidebar = () => {

  return (
    <aside className="bg-gray-900 shadow-lg p-6 w-64 h-screen text-white">
      <h2 className="mb-6 font-bold text-center text-lg">Menú</h2>
      <ul className="space-y-4">
        <li><a href="#" className="hover:text-gray-300 transition">Opción 1</a></li>
        <li><a href="#" className="hover:text-gray-300 transition">Opción 2</a></li>
        <li><a href="#" className="hover:text-gray-300 transition">Opción 3</a></li>
      </ul>
      <button
        // onClick={}
        className="bg-red-600 hover:bg-red-700 mt-6 px-4 py-2 rounded w-full text-white transition duration-200"
      >
        Cerrar Sesión
      </button>
    </aside>
  );
};

export default Sidebar;