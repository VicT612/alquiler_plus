'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

import { useSession } from 'next-auth/react';

const Home = () => {
  const { data: session } = useSession(); // Obtener los datos de la sesión

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    precio: '',
    descripcion: '',
    condiciones: '',
    tipoCuarto: 'GARZONIER',
    estadoCuarto: 'DESOCUPADO',
    email: session?.user?.email
  });

  // Estado para la URL de la imagen
  const [fotoUrlcuarto, setFotoUrl] = useState<string>('');

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejar cambios en el input de la imagen
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Realizar la solicitud POST para crear el cuarto
      const response = await axios.post('/api/cuartos', {
        ...formData,
        fotoUrlcuarto: fotoUrlcuarto
      });
      setFotoUrl(''); // Limpiar la URL de la imagen después de enviar el formulario
    } catch (error) {
      console.error('Error al agregar cuarto:', error);
      // Aquí podrías manejar el error de alguna manera, como mostrar un mensaje de error al usuario
    }
  };
  
  

  // Renderiza el formulario
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Panel de Control - Agregar Cuarto</h2>
    
      <div className="bg-white rounded-lg shadow p-6">
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
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1" htmlFor="caracteristicas">Características</label>
              <input
                type="text"
                id="caracteristicas"
                name="caracteristicas"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1" htmlFor="tipo">Tipo de Cuarto</label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipoCuarto}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              >
                <option value="GARZONIER">Garzonier</option>
              </select>
            </div>
    
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1" htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={formData.estadoCuarto}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              >
                <option value="DESOCUPADO">Desocupado</option>
                <option value="EN_CONTRATO">En Contrato</option>
                <option value="ALQUILADO">Alquilado</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1" htmlFor="foto">Foto del Cuarto</label>
              <input
                type="file"
                id="foto"
                name="foto"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <button type="submit" className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600">Agregar Cuarto</button>
        </form>
      </div>
    </div>
  );
};

// Exporta el componente Home
export default Home;