import React from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
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
          <h1 className="font-bold text-2xl text-gray-800">Dashboard</h1>
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

