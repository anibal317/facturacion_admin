// app/components/MainContent.tsx
import React from 'react';

const MainContent = () => {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="mb-4 font-bold text-xl">Bienvenido al Dashboard</h2>
      <p className="text-gray-700">Aquí puedes gestionar tus pedidos y más.</p>
      <div className="mt-6">
        <h3 className="font-semibold text-lg">Estadísticas</h3>
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
          <div className="bg-blue-100 shadow p-4 rounded-lg">
            <h4 className="font-bold">Total de Pedidos</h4>
            <p className="text-2xl">150</p>
          </div>
          <div className="bg-green-100 shadow p-4 rounded-lg">
            <h4 className="font-bold">Pedidos Completados</h4>
            <p className="text-2xl">120</p>
          </div>
          <div className="bg-yellow-100 shadow p-4 rounded-lg">
            <h4 className="font-bold">Pedidos Pendientes</h4>
            <p className="text-2xl">30</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;