'use client';
import React, { useState } from 'react';
import Sidebar from '../sideBar';
import RegistrarCuarto from './viewRegistrarCuartos/registrarCuarto';
import './page.css';

const OwnerDashboard = () => {
  const [selectedView, setSelectedView] = useState('regcuartos');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const links = [
    { name: 'Registrar cuarto', 
      icon:   <svg viewBox="0 0 512 512" className="menu-icon">
                <path d="M256 0C114.62 0 0 114.62 0 256s114.62 256 256 256 256-114.62 256-256S397.38 0 256 0zm0 470.64c-118.46 0-214.64-96.18-214.64-214.64S137.54 41.36 256 41.36 470.64 137.54 470.64 256 374.46 470.64 256 470.64zM372.36 239.64H272V139.64c0-8.84-7.16-16-16-16s-16 7.16-16 16v100H139.64c-8.84 0-16 7.16-16 16s7.16 16 16 16H240v100c0 8.84 7.16 16 16 16s16-7.16 16-16V271.64h100c8.84 0 16-7.16 16-16s-7.16-16-16-16z" fill="white"/>
              </svg>, 
      view: 'regcuartos' },

    { name: 'Ver mis cuartos',
      icon: <svg viewBox="0 0 512 512" className="menu-icon">
      <path d="M501.333 42.667H10.667C4.771 42.667 0 47.437 0 53.333v405.333c0 5.896 4.771 10.667 10.667 10.667h490.667c5.896 0 10.667-4.771 10.667-10.667V53.333c0-5.896-4.771-10.667-10.667-10.667zm-10.667 405.333H21.333V63.333h469.333v384zM128 128h85.333v106.667H128V128zm170.667 0h85.333v106.667h-85.333V128zM128 277.333h85.333v106.667H128v-106.667zm170.667 0h85.333v106.667h-85.333v-106.667zM384 128h85.333v256H384V128zM42.667 128h85.333v256H42.667V128z" fill="white"/>
    </svg>
    ,   
      view: 'miscuarto' },

    { name: 'Chat Con el Cliente', 
      icon: <svg viewBox="0 0 512 512" className="menu-icon">
              <path d="M448.205,392.507c30.519-27.2,47.8-63.455,47.8-101.078,0-39.984-18.718-77.378-52.707-105.3C410.218,158.963,366.432,144,320,144s-90.218,14.963-123.293,42.131C162.718,214.051,144,251.445,144,291.429s18.718,77.378,52.707,105.3c33.075,27.168,76.861,42.13,123.293,42.13,6.187,0,12.412-.273,18.585-.816l10.546,9.141A199.849,199.849,0,0,0,480,496h16V461.943l-4.686-4.685A199.17,199.17,0,0,1,448.205,392.507ZM370.089,423l-21.161-18.341-7.056.865A180.275,180.275,0,0,1,320,406.857c-79.4,0-144-51.781-144-115.428S240.6,176,320,176s144,51.781,144,115.429c0,31.71-15.82,61.314-44.546,83.358l-9.215,7.071,4.252,12.035a231.287,231.287,0,0,0,37.882,67.817A167.839,167.839,0,0,1,370.089,423Z" fill="white"></path>
            </svg>, 
      view: 'chatconclie' },

    { name: 'Estatus de los cuartos',
      icon: <svg viewBox="0 0 512 512" className="menu-icon">
      <path d="M64 464H448V32H64V464zM400 416H112V80H400V416z" fill="white"/>
      <path d="M160 352H192V256H160zM240 352H272V192H240zM320 352H352V128H320z" fill="white"/>
    </svg>, 
      view: 'estatuscuartos' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        setSelectedView={setSelectedView}
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
      <div className={`container mx-auto p-6 ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {selectedView === 'regcuartos' && <RegistrarCuarto />}
      </div>
    </div>
  );
};

export default OwnerDashboard;
