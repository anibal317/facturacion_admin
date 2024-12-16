// app/page.tsx
import Link from 'next/link';
import '@/app/globals.css'
const Home = () => {
  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md p-8 rounded-lg w-full max-w-md">
        <h1 className="mb-4 font-bold text-2xl text-center text-gray-800">
          Bienvenido al Portal de Administración de Order Flow
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Aquí podrás gestionar y monitorear todos los pedidos de manera eficiente.
        </p>
        <div className="flex justify-center">
          <Link
            href="/login"
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white transition duration-200"
          >
            Ir al Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;