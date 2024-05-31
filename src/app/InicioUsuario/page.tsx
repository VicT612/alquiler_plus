// AboutRoom.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './components/sideBar';
import Card from './components/cardCuartos';
import { User, Cuarto } from './components/types';

const AboutRoom = () => {
  const [cuartos, setCuartos] = useState<Cuarto[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('cuartos');
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    async function fetchData() {
      try {
        const response = await fetch('/api/agarrarCuartos');
        const data = await response.json();
        setCuartos(data);
      } catch (error) {
        console.error('Error al obtener datos de cuarto:', error);
      }
    }
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/..');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const body = document.body;
    if (darkMode) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="flex h-screen">
      <Sidebar user={user} setSelectedView={setSelectedView} handleLogout={handleLogout} sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {!sidebarOpen && (
        <button
          className="fixed top-4 left-4 p-4 text-gray-600 dark:text-gray-300 focus:outline-none z-50"
          onClick={toggleSidebar}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      )}
      <div className={`flex-1 p-6 transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
        {selectedView === 'cuartos' && <Card cuartos={cuartos} />}
        {selectedView === 'cuarto' && <div>Detalle de un cuarto específico</div>}
        {selectedView === 'chat' && <div>Componente de Chat</div>}
        {selectedView === 'wishlist' && <div>Componente de Lista de deseos</div>}
      </div>
    </div>
  );
};

export default AboutRoom;

