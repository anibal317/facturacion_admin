// app/dashboard/page.tsx
'use client'
import '@/app/globals.css'

import Header from "../components/Header";
import MainContent from "../components/MainContent";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />
        <MainContent />
      </main>
    </div>
  );
};

export default Dashboard;