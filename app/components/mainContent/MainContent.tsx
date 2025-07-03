import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const MainContent = () => {
  const [totalPlanes, setTotalPlanes] = useState<number>(0);
  const [totalClientes, setTotalClientes] = useState<number>(0);
  const [urlSite, setUrlSite] = useState<string>('');

  useEffect(() => {
    // Obtener cantidad de planes
    fetch('/api/plans')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTotalPlanes(data.length);
        } else if (data.data && Array.isArray(data.data)) {
          setTotalPlanes(data.data.length);
        }
      });
    // Obtener cantidad de clientes
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTotalClientes(data.length);
        } else if (data.data && Array.isArray(data.data)) {
          setTotalClientes(data.data.length);
        }
      });

    // Obtener URL del sitio
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.urlSite) {
          setUrlSite(data.urlSite);
        }
      })
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  return (
    <div className="bg-white shadow-md p-6 rounded-lg text-blue-600">
      <h2 className="mb-4 font-bold text-xl">Bienvenido al Dashboard</h2>
      <p className="text-gray-700">Administra clientes, planes y la información clave de tu empresa desde el panel de control de <Link href={urlSite} id='bsLink'>Bolívar Software.</Link></p>
      <div className="mt-6">
        <h3 className="font-semibold text-lg">Estadísticas</h3>
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
          <div className="bg-blue-100 shadow p-4 rounded-lg">
            <h4 className="font-bold">Cantidad de Planes</h4>
            <p className="text-2xl">{totalPlanes}</p>
          </div>
          <div className="bg-green-100 shadow p-4 rounded-lg">
            <h4 className="font-bold">Cantidad de Clientes</h4>
            <p className="text-2xl">{totalClientes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;

