// app/components/Header.tsx
import React from 'react';
const Header = () => {
  return (
    <header className="flex justify-between items-center bg-white shadow-md mb-6 p-4 rounded-lg">
      <h1 className="font-bold text-2xl text-gray-800">Dashboard</h1>
      <div className="flex items-center">
        <img
          src="/avatar.png" // Asegúrate de tener una imagen de avatar en la carpeta public
          alt="Avatar"
          className="border-2 border-gray-300 mr-2 rounded-full w-10 h-10"
        />
        {/* <span className="font-semibold text-gray-800">{user?.username}</span> */}
      </div>
    </header>
  );
};

export default Header;