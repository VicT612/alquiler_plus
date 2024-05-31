// Sidebar.tsx
'use client'
import React from 'react';
import { User } from './types';

interface SidebarProps {
  user: User | null;
  setSelectedView: (view: string) => void;
  handleLogout: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, setSelectedView, handleLogout, sidebarOpen, toggleSidebar }) => {
  return (
    <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-60 transition-transform duration-200 ease-in-out bg-white dark:bg-gray-800`}>
      <button
        className="absolute top-4 right-4 p-4 text-gray-600 dark:text-gray-300 focus:outline-none"
        onClick={toggleSidebar}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
      {user && (
        <div className="flex items-center p-2 space-x-4">
          <img
            src={user.fotoUrl || 'https://static.vecteezy.com/system/resources/previews/000/550/731/original/user-icon-vector.jpg'}
            alt=""
            className="w-12 h-12 rounded-full dark:bg-gray-500"
          />
          <div>
            <h2 className="text-lg font-bold">{user.nombre}</h2>
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-600">{user.rol}</h3>
          </div>
        </div>
      )}
      <div className="divide-y dark:divide-gray-700">
        <ul className="pt-2 pb-4 space-y-1 text-sm">
          <li className="dark:bg-gray-700 dark:text-gray-300">
            <button
              onClick={() => setSelectedView('cuartos')}
              className="w-full text-left flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current dark:text-gray-300">
                <path d="M68.983,382.642l171.35,98.928a32.082,32.082,0,0,0,32,0l171.352-98.929a32.093,32.093,0,0,0,16-27.713V157.071a32.092,32.092,0,0,0-16-27.713L272.334,30.429a32.086,32.086,0,0,0-32,0L68.983,129.358a32.09,32.09,0,0,0-16,27.713V354.929A32.09,32.09,0,0,0,68.983,382.642ZM272.333,67.38l155.351,89.691V334.449L272.333,246.642ZM256.282,274.327l157.155,88.828-157.1,90.7L99.179,363.125ZM84.983,157.071,240.333,67.38v179.2L84.983,334.39Z"></path>
              </svg>
              <span>Cuartos en alquiler</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedView('cuarto')}
              className="w-full text-left flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current dark:text-gray-300">
                <path d="M7 14h10v-2H7v2zm0-4h10v-2H7v2zm0-4h10V4H7v2zm12-4h2v18h-2V2zm-2 18h-4v-6H7v6H3V2h2v16h2v-4h8v4h2v2z" />
              </svg>
              <span>Cuarto</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedView('chat')}
              className="w-full text-left flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current dark:text-gray-300">
                <path d="M448.205,392.507c30.519-27.2,47.8-63.455,47.8-101.078,0-39.984-18.718-77.378-52.707-105.3C410.218,158.963,366.432,144,320,144s-90.218,14.963-123.293,42.131C162.718,214.051,144,251.445,144,291.429s18.718,77.378,52.707,105.3c33.075,27.168,76.861,42.13,123.293,42.13,6.187,0,12.412-.273,18.585-.816l10.546,9.141A199.849,199.849,0,0,0,480,496h16V461.943l-4.686-4.685A199.17,199.17,0,0,1,448.205,392.507ZM370.089,423l-21.161-18.341-7.056.865A180.275,180.275,0,0,1,320,406.857c-79.4,0-144-51.781-144-115.428S240.6,176,320,176s144,51.781,144,115.429c0,31.71-15.82,61.314-44.546,83.358l-9.215,7.071,4.252,12.035a231.287,231.287,0,0,0,37.882,67.817A167.839,167.839,0,0,1,370.089,423Z"></path>
              </svg>
              <span>Chat</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedView('wishlist')}
              className="w-full text-left flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current dark:text-gray-300">
                <path d="M453.122,79.012a128,128,0,0,0-181.087.068l-15.511,15.7L241.142,79.114l-.1-.1a128,128,0,0,0-181.02,0l-6.91,6.91a128,128,0,0,0,0,181.019L235.485,449.314l20.595,21.578.491-.492.533.533L276.4,450.574,460.032,266.94a128.147,128.147,0,0,0,0-181.019ZM437.4,244.313,256.571,425.146,75.738,244.313a96,96,0,0,1,0-135.764l6.911-6.91a96,96,0,0,1,135.713-.051l38.093,38.787,38.274-38.736a96,96,0,0,1,135.765,0l6.91,6.909A96.11,96.11,0,0,1,437.4,244.313Z"></path>
              </svg>
              <span>Lista de deseos</span>
            </button>
          </li>
        </ul>
        <ul className="pt-4 pb-2 space-y-1 text-sm">
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current dark:text-gray-300">
                <path d="M440,424V88H352V13.005L88,58.522V424H16v32h86.9L352,490.358V120h56V456h88V424ZM320,453.642,120,426.056V85.478L320,51Z"></path>
                <rect width="32" height="64" x="256" y="232"></rect>
              </svg>
              <span>Salir</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
