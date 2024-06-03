'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from './types';
import './SideBar.css';

interface SidebarProps {
  setSelectedView: (view: string) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  links: Array<{ name: string, icon: React.ReactNode, view: string }>; // Lista de enlaces pasados como props
}

const Sidebar: React.FC<SidebarProps> = ({ setSelectedView, sidebarOpen, toggleSidebar, links }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('Mapeado');
    router.push('/');
  };

  return (
    <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button className="toggle-button" onClick={toggleSidebar}>
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        {user && (
          <div className="user-info">
            <img
              src={user.fotoUrl || 'https://static.vecteezy.com/system/resources/previews/000/550/731/original/user-icon-vector.jpg'}
              alt=""
              className="user-avatar"
            />
            <div className="user-details">
              <h2 className="user-name">{user.nombre}</h2>
              <h3 className="user-role">{user.rol}</h3>
            </div>
          </div>
        )}
      </div>
      <div className="menu">
        <ul className="menu-list">
          {links.map(link => (
            <li key={link.view} className="menu-item">
              <button onClick={() => setSelectedView(link.view)} className="menu-button">
                {link.icon}
                <span>{link.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className='sidebar-footer'>
        <ul className="menu-list">
          <li className="menu-item">
            <button onClick={handleLogout} className="menu-button">
              <svg viewBox="0 0 512 512" className="menu-icon">
                <path d="M440,424V88H352V13.005L88,58.522V424H16v32h86.9L352,490.358V120h56V456h88V424ZM320,453.642,120,426.056V85.478L320,51Z" fill="white"></path>
                <rect width="32" height="64" x="256" y="232" fill="white"></rect>
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
