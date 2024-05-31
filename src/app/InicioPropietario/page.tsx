'use client'
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import axios from 'axios';
import { useSession } from 'next-auth/react';
import MapaModal from "../(site)/componentes/MapaModal";

const DynamicMapa = dynamic(() => import("../InicioPropietario/components/UbicacionModal"), {
  loading: () => <div>Cargando...</div>,
  ssr: false,
});

interface User {
  id: number;
  nombre: string;
  email: string;
  fotoUrl: string;
  rol: string;
}

interface Cuarto {
  id: number;
  direccion: string;
  fotoUrlcuarto: string;
  precio: number;
  caracteristicas: string;
  tipo: string;
  cantidadHabitaciones: number;
  estado: string;
  propietario: {
    nombre: string;
  };
}

const AboutRoom = () => {
  const [cuartos, setCuartos] = useState<Cuarto[]>([]);
  const [darkMode, setDarkMode] = useState(false); 
  const [user, setUser] = useState<User | null>(null); 
  const router = useRouter();
  const { data: session } = useSession(); // Obtener los datos de la sesión

  const [formData, setFormData] = useState({
    precio: '',
    descripcion: '',
    condiciones: '',
    tipoCuarto: 'GARZONIER',
    estadoCuarto: 'DESOCUPADO',
    email: '', // Inicialmente vacío
    direccion: '' // Asegúrate de incluir este campo
  });

  const [fotoUrlcuarto, setFotoUrlcuarto] = useState<string>(''); // Declaración correcta de fotoUrlcuarto
  const [showMapModal, setShowMapModal] = useState(false); // Declaración correcta de showMapModal

  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: session.user?.email ?? ''
      }));
    }
  }, [session]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoUrlcuarto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenMapModal = () => {
    setShowMapModal(true);
  };

  const handleCloseMapModal = () => {
    setShowMapModal(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const storedAddress = localStorage.getItem('Mapeado');
    if (storedAddress) {
      const addressData = JSON.parse(storedAddress);
      const { latitud, longitud, calle, barrio, ciudad, provincia, Departamento, pais, beneficios } = addressData;
  
      try {
        const addressResponse = await axios.post('/api/agregarDireccion', {
          latitud,
          longitud,
          calle,
          barrio,
          ciudad,
          provincia,
          Departamento,
          pais,
          beneficios,
        });
  
        const ubicacionId = addressResponse.data.id;
  
        await axios.post('/api/cuartos', {
          ...formData,
          precio: parseFloat(formData.precio), // Conversión a número
          fotoUrlcuarto,
          ubicacionId,
          direccion: `${calle}` as string
        });
  
        setFotoUrlcuarto(''); // Limpiar la URL de la imagen después de enviar el formulario
      } catch (error) {
        console.error('Error al agregar cuarto:', error);
      }
    } else {
      console.log('No se ha seleccionado ninguna ubicación.');
    }
  };
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    async function fetchData() {
      try {
        const response = await fetch("/api/getcuarto");
        const data = await response.json();
        setCuartos(data);
      } catch (error) {
        console.error("Error al obtener datos de cuarto:", error);
      }
    }
    fetchData();
  }, []);

  const handleCardClick = (id: number) => {
    router.push(`/AboutRoom/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); 
    router.push('/..');
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current dark:text-gray-300">
                  <path d="M68.983,382.642l171.35,98.928a32.082,32.082,0,0,0,32,0l171.352-98.929a32.093,32.093,0,0,0,16-27.713V157.071a32.092,32.092,0,0,0-16-27.713L272.334,30.429a32.086,32.086,0,0,0-32,0L68.983,129.358a32.09,32.09,0,0,0-16,27.713V354.929A32.09,32.09,0,0,0,68.983,382.642ZM272.333,67.38l155.351,89.691V334.449L272.333,246.642ZM256.282,274.327l157.155,88.828-157.1,90.7L99.179,363.125ZM84.983,157.071,240.333,67.38v179.2L84.983,334.39Z"></path>
                </svg>
                <span>Cuartos en alquiler</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current dark:text-gray-300">
                  <path d="M7 14h10v-2H7v2zm0-4h10v-2H7v2zm0-4h10V4H7v2zm12-4h2v18h-2V2zm-2 18h-4v-6H7v6H3V2h2v16h2v-4h8v4h2v2z"/>
                </svg>
                <span>Cuarto</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current dark:text-gray-300">
                  <path d="M448.205,392.507c30.519-27.2,47.8-63.455,47.8-101.078,0-39.984-18.718-77.378-52.707-105.3C410.218,158.963,366.432,144,320,144s-90.218,14.963-123.293,42.131C162.718,214.051,144,251.445,144,291.429s18.718,77.378,52.707,105.3c33.075,27.168,76.861,42.13,123.293,42.13,6.187,0,12.412-.273,18.585-.816l10.546,9.141A199.849,199.849,0,0,0,480,496h16V461.943l-4.686-4.685A199.17,199.17,0,0,1,448.205,392.507ZM370.089,423l-21.161-18.341-7.056.865A180.275,180.275,0,0,1,320,406.857c-79.4,0-144-51.781-144-115.428S240.6,176,320,176s144,51.781,144,115.429c0,31.71-15.82,61.314-44.546,83.358l-9.215,7.071,4.252,12.035a231.287,231.287,0,0,0,37.334,48.86,199.347,199.347,0,0,1-82.536,35.168l-21.8,4.93Z"></path>
                </svg>
                <span>Conversaciones</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cuartos en Alquiler</h2>
          <button onClick={handleLogout} className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600">Logout</button>
        </header>

        <div className="dark:bg-slate-700 bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1" htmlFor="precio">Precio</label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1" htmlFor="caracteristicas">Características</label>
                <input
                  type="text"
                  id="caracteristicas"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1" htmlFor="tipo">Tipo de Cuarto</label>
                <select
                  id="tipo"
                  name="tipoCuarto"
                  value={formData.tipoCuarto}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 text-black"
                >
                  <option value="GARZONIER">Garzonier</option>
                  <option value="RECIDENCIA ESTUDINATIL">Recidencia Estundiantil</option>
                  <option value="CUARTO DE ALQUILER">Cuarto de Alquiler</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1" htmlFor="estado">Estado</label>
                <select
                  id="estado"
                  name="estadoCuarto"
                  value={formData.estadoCuarto}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 text-black"
                >
                  <option value="DESOCUPADO">Desocupado</option>
                  <option value="EN_CONTRATO">En Contrato</option>
                  <option value="ALQUILADO">Alquilado</option>
                </select>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input 
                      type="file"
                      id="foto"
                      name="foto"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="" />
                  </label>
                </div>
              </div>
            </div>
            <button type="button" onClick={handleOpenMapModal} className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600">Agregar Ubicación</button>
            <button type="submit" className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 ml-4">Agregar Cuarto</button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {cuartos.map((cuarto) => (
            <div key={cuarto.id} className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800" onClick={() => handleCardClick(cuarto.id)}>
              <img src={cuarto.fotoUrlcuarto} alt={cuarto.direccion} className="w-full h-48 object-cover rounded-md" />
              <div className="mt-4">
                <h3 className="text-lg font-semibold">{cuarto.direccion}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{cuarto.caracteristicas}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold">{cuarto.precio} $</span>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Ver</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal del mapa */}
      <MapaModal show={showMapModal} onClose={handleCloseMapModal} />
    </div>
  );
};

export default AboutRoom;
