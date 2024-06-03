// ClientePage.tsx
'use client';
import React, { useState } from 'react';
import Sidebar from '../sideBar';
import CuartosView from './viewCuartos/cuartos';
import './page.css';

const ClientePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const links = [
    { name: 'Cuartos en alquiler', 
      icon:  <svg viewBox="0 0 512 512" className="menu-icon">
                <path d="M68.983,382.642l171.35,98.928a32.082,32.082,0,0,0,32,0l171.352-98.929a32.093,32.093,0,0,0,16-27.713V157.071a32.092,32.092,0,0,0-16-27.713L272.334,30.429a32.086,32.086,0,0,0-32,0L68.983,129.358a32.09,32.09,0,0,0-16,27.713V354.929A32.09,32.09,0,0,0,68.983,382.642ZM272.333,67.38l155.351,89.691V334.449L272.333,246.642ZM256.282,274.327l157.155,88.828-157.1,90.7L99.179,363.125ZM84.983,157.071,240.333,67.38v179.2L84.983,334.39Z" fill="white"/>
              </svg>, 
      view: 'cuartos' },

    { name: 'Cuarto', 
      icon: <svg viewBox="0 0 24 24" className="menu-icon">
              <path d="M7 14h10v-2H7v2zm0-4h10v-2H7v2zm0-4h10V4H7v2zm12-4h2v18h-2V2zm-2 18h-4v-6H7v6H3V2h2v16h2v-4h8v4h2v2z" fill="white" />   
            </svg>,   
      view: 'cuarto' },

    { name: 'Chat', 
      icon: <svg viewBox="0 0 512 512" className="menu-icon">
              <path d="M448.205,392.507c30.519-27.2,47.8-63.455,47.8-101.078,0-39.984-18.718-77.378-52.707-105.3C410.218,158.963,366.432,144,320,144s-90.218,14.963-123.293,42.131C162.718,214.051,144,251.445,144,291.429s18.718,77.378,52.707,105.3c33.075,27.168,76.861,42.13,123.293,42.13,6.187,0,12.412-.273,18.585-.816l10.546,9.141A199.849,199.849,0,0,0,480,496h16V461.943l-4.686-4.685A199.17,199.17,0,0,1,448.205,392.507ZM370.089,423l-21.161-18.341-7.056.865A180.275,180.275,0,0,1,320,406.857c-79.4,0-144-51.781-144-115.428S240.6,176,320,176s144,51.781,144,115.429c0,31.71-15.82,61.314-44.546,83.358l-9.215,7.071,4.252,12.035a231.287,231.287,0,0,0,37.882,67.817A167.839,167.839,0,0,1,370.089,423Z" fill="white"></path>
            </svg>, 
      view: 'chat' },

    { name: 'Lista de deseos', 
      icon: <svg viewBox="0 0 512 512" className="menu-icon">
              <path d="M453.122,79.012a128,128,0,0,0-181.087.068l-15.511,15.7L241.142,79.114l-.1-.1a128,128,0,0,0-181.02,0l-6.91,6.91a128,128,0,0,0,0,181.019L235.485,449.314l20.595,21.578.491-.492.533.533L276.4,450.574,460.032,266.94a128.147,128.147,0,0,0,0-181.019ZM437.4,244.313,256.571,425.146,75.738,244.313a96,96,0,0,1,0-135.764l6.911-6.91a96,96,0,0,1,135.713-.051l38.093,38.787,38.274-38.736a96,96,0,0,1,135.765,0l6.91,6.909A96.11,96.11,0,0,1,437.4,244.313Z" fill="white"></path>
            </svg>, 
      view: 'wishlist' },
  ];

  return (
    <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 ${sidebarOpen ? 'sidebar-open' : ''}`}>
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
      <div className="flex-1 flex flex-col">
        <CuartosView />
      </div>
    </div>
  );
};

export default ClientePage;
