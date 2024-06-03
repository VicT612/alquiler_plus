'use client';
import React, { useState } from 'react';
import Sidebar from '../sideBar';
import './page.css';

const OwnerDashboard = () => {
  const [selectedView, setSelectedView] = useState('cuartos');
  const [sidebarOpen, setSidebarOpen] = useState(false);
 
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const links = [
    { name: 'Mis Cuartos', icon: <svg>...</svg>, view: 'cuartos' },
    { name: 'Crear Cuarto', icon: <svg>...</svg>, view: 'crear' },
    { name: 'Chat', icon: <svg>...</svg>, view: 'chat' },
    { name: 'Estadísticas', icon: <svg>...</svg>, view: 'estadisticas' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar 
        setSelectedView={(view) => console.log(view)}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        links={links}
      />
      {!sidebarOpen && (
        <div className="tab" onClick={toggleSidebar}>
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          <span className="tab-text">Menu</span>
        </div>
      )}
      <div className="container mx-auto p-6">
        {selectedView === 'crear'}
      </div>
    </div>
  );
};

export default OwnerDashboard;
