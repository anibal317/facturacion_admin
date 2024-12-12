// app/page.tsx

import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 min-h-screen">
      <header className="bg-blue-600 py-4 w-full">
        <h1 className="font-bold text-3xl text-center text-white">Mi Aplicación</h1>
      </header>

      <main className="flex flex-col flex-1 justify-center items-center p-4">
        <h2 className="mb-4 font-bold text-4xl text-center">¡Bienvenido a nuestra plataforma!</h2>
        <p className="mb-6 text-center text-lg">
          Aquí puedes gestionar tus datos de manera eficiente y sencilla.
        </p>
        
        <div className="gap-4 grid grid-cols-1 md:grid-cols-3 mb-8">
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="font-semibold text-xl">Características 1</h3>
            <p className="text-gray-600">Descripción breve de la característica 1.</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="font-semibold text-xl">Características 2</h3>
            <p className="text-gray-600">Descripción breve de la característica 2.</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="font-semibold text-xl">Características 3</h3>
            <p className="text-gray-600">Descripción breve de la característica 3.</p>
          </div>
        </div>

        <Link href="/welcome">
          <a className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-white transition duration-200">
            Comenzar
          </a>
        </Link>
      </main>

      <footer className="bg-gray-200 py-4 w-full">
        <p className="text-center text-gray-600">© 2023 Mi Aplicación. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default HomePage;