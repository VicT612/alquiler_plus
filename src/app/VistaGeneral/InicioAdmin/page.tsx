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
    { name: 'Cuartos publicados', 
      icon:  <svg viewBox="0 0 512 512" className="menu-icon">
                <path d="M68.983,382.642l171.35,98.928a32.082,32.082,0,0,0,32,0l171.352-98.929a32.093,32.093,0,0,0,16-27.713V157.071a32.092,32.092,0,0,0-16-27.713L272.334,30.429a32.086,32.086,0,0,0-32,0L68.983,129.358a32.09,32.09,0,0,0-16,27.713V354.929A32.09,32.09,0,0,0,68.983,382.642ZM272.333,67.38l155.351,89.691V334.449L272.333,246.642ZM256.282,274.327l157.155,88.828-157.1,90.7L99.179,363.125ZM84.983,157.071,240.333,67.38v179.2L84.983,334.39Z" fill="white"/>
              </svg>, 
      view: 'cuartos' },

    { name: 'Usuarios', 
      icon: <svg viewBox="0 0 24 24" className="menu-icon">
              <path d="M7 14h10v-2H7v2zm0-4h10v-2H7v2zm0-4h10V4H7v2zm12-4h2v18h-2V2zm-2 18h-4v-6H7v6H3V2h2v16h2v-4h8v4h2v2z" fill="white" />   
            </svg>,   
      view: 'cuarto' },

    { name: 'Estadisticas', 
      icon: <svg viewBox="0 0 24 24" className="menu-icon">
              <path d="M3 21h18v-2H3v2zM7 14h3v5H7v-5zM12 10h3v9h-3v-9zM17 6h3v13h-3V6z" fill="white" />
            </svg>, 
      view: 'chat' },

    { name: 'Lista de deseos', 
      icon: <svg viewBox="0 0 512 512" className="menu-icon">
              <path d="M453.122,79.012a128,128,0,0,0-181.087.068l-15.511,15.7L241.142,79.114l-.1-.1a128,128,0,0,0-181.02,0l-6.91,6.91a128,128,0,0,0,0,181.019L235.485,449.314l20.595,21.578.491-.492.533.533L276.4,450.574,460.032,266.94a128.147,128.147,0,0,0,0-181.019ZM437.4,244.313,256.571,425.146,75.738,244.313a96,96,0,0,1,0-135.764l6.911-6.91a96,96,0,0,1,135.713-.051l38.093,38.787,38.274-38.736a96,96,0,0,1,135.765,0l6.91,6.909A96.11,96.11,0,0,1,437.4,244.313Z" fill="white"></path>
            </svg>, 
      view: 'wishlist' },
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
