'use client'
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Card from "./cardCuartos/cardCuartos";
import dynamic from "next/dynamic";

const DynamicMapa = dynamic(() => import("../InicioPropietario/components/UbicacionModal"), {
  loading: () => <div>Cargando...</div>,
  ssr: false,
});


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
  const [darkMode, setDarkMode] = useState(false); // Estado para el modo oscuro
  const router = useRouter();

  useEffect(() => {
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
    // Navega a la página "AboutRoom" con el ID del cuarto como parámetro en la URL
    router.push(`/AboutRoom/${id}`);
  };

  useEffect(() => {
    // Aplicar cambios globales de estilos en función del modo oscuro
    const body = document.body;
    if (darkMode) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <div className="header">
        <h1 className="text-4xl font-bold mb-4">Detalles del Cuarto</h1>
        <button 
          className={`ml-auto px-2 py-1 rounded-lg ${darkMode ? 'bg-red-900 text-white' : 'bg-red-300 text-gray-800'} focus:outline-none`}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
        </button>
      </div>
      <p>Conoce tu ubicación</p>
      
      <div className="card-container">
        <DynamicMapa/>
        {cuartos.map((cuarto) => (
          <Card key={cuarto.id} cuarto={cuarto} />
        ))}
      </div>
     

      <style jsx>{`
        .app {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          transition: background-color 0.3s ease;
        }

        .header {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 7px;
          background-color: ${darkMode ? '#E63858  ' : '#E63858  '};
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .card-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          padding: 20px;
          max-width: 1200px;
          width: 100%;
        }

        @media only screen and (max-width: 768px) {
          .card-container {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }

        .light {
          background-color: #ffffff;
          color: #333;
        }

        .dark {
          background-color: #121212;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
};

export default AboutRoom;
