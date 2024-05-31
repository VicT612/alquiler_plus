'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; // Importa useRouter de next/router
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface User {
  id: number;
  nombre: string;
  email: string;
  fotoUrl: string;
  rol: string;
}

const AdminPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { data: session } = useSession(); // Obtener los datos de la sesión

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); 
    router.push('/..');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="h-full p-3 space-y-2 w-60 bg-white dark:bg-gray-800">
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
              <a href="#" className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current dark:text-gray-300">
                <path d="M3 5h18v2H3V5zm0 6h18v-2H3v2zm0 6h18v-2H3v2z"/>
              </svg>
                <span>Usuarios</span>
              </a>
            </li>
            {/* Eliminado el enlace a la página de cuarto */}
            <li>
              <a href="#" className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current dark:text-gray-300">
                <path d="M12 3c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zM11 7h2v7h-2V7zm4 3h2v4h-2v-4z"/>
              </svg>
                <span>Estadisticass</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current text-red-500 dark:text-red-700">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-12.5l-7 7-1.41-1.41 7-7L15.5 5.5zm-7 7l7-7 1.41 1.41-7 7-1.41-1.41z"/>
              </svg>

                <span>Baneados</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Panel de Administrador</h2>
          <button onClick={handleLogout} className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600">Logout</button>
        </header>

        {/* Contenido específico del panel de administrador */}
        <p>¡Bienvenido al panel de administrador! Aquí puedes administrar diferentes aspectos del sitio web.</p>
      </div>
    </div>
  );
};

export default AdminPage;
