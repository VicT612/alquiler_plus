'use client'
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'tailwindcss/tailwind.css';
import axios from 'axios';

const MapaModal = ({ show, onClose, onSave }) => {
  const [map, setMap] = useState(null); // Estado para almacenar la instancia del mapa
  const [userMarker, setUserMarker] = useState(null); // Estado para almacenar el marcador del usuario
  const [selectedPosition, setSelectedPosition] = useState(null); // Estado para almacenar la posición seleccionada
  const [mapKey, setMapKey] = useState(0); // Estado para controlar la clave del mapa

  useEffect(() => {
    if (show) {
      setMapKey(prevKey => prevKey + 1); // Cambiar la clave cada vez que se muestra el modal
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      // Crear e inicializar el mapa cuando el modal se muestra
      const newMap = L.map('map').setView([51.503, -0.09], 19); // Inicializa el mapa centrado en una ubicación con zoom máximo (19)
      setMap(newMap); // Guarda la instancia del mapa en el estado

      // Añadir la capa de tiles al mapa (OpenStreetMap)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, // Máximo nivel de zoom permitido
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' // Atribución a OpenStreetMap
      }).addTo(newMap); // Añade la capa de tiles al mapa

      // Crea un icono personalizado para el marcador utilizando la imagen PNG
      const markerIcon = L.icon({
        iconUrl: './marker.webp', // Utiliza la imagen PNG como icono del marcador
        iconSize: [30, 30], // Establece el tamaño del icono (ajusta según sea necesario)
        iconAnchor: [15, 30], // Establece el punto de anclaje del icono (la mitad de la imagen)
        popupAnchor: [0, -30] // Ajusta la posición del popup en relación al icono
      });

      // Obtener la ubicación actual del usuario
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords; // Obtiene las coordenadas de la ubicación actual
          const userLatLng = L.latLng(latitude, longitude); // Crea un objeto de latitud y longitud
          newMap.setView(userLatLng, 19); // Ajusta la vista del mapa a la ubicación del usuario con el zoom máximo
          setSelectedPosition(userLatLng); // Actualiza la posición seleccionada con la ubicación actual
          const marker = L.marker(userLatLng, { icon: markerIcon, draggable: true }).addTo(newMap); // Crea un marcador arrastrable en la ubicación actual
          setUserMarker(marker); // Guarda el marcador en el estado

          // Actualiza la posición seleccionada cuando se arrastra el marcador
          marker.on('dragend', function(event) {
            const marker = event.target;
            const position = marker.getLatLng();
            setSelectedPosition(position); // Actualiza la posición seleccionada al finalizar el arrastre
          });
        });
      }
    }
  }, [show, mapKey]); // Dependencias del useEffect para ejecutar el efecto cada vez que se muestra el modal y cambia la clave

  // Función para manejar la acción de guardar
  const handleSave = async () => {
    if (selectedPosition) {
      onSave(selectedPosition); // Llama a la función de guardado con la posición seleccionada
      try {
        // Hace una solicitud GET a la API de LocationIQ para obtener la dirección de la posición seleccionada
        const response = await axios.get(`https://us1.locationiq.com/v1/reverse?key=pk.2914d8bbdd858dafbde7131dd6db95d4&lat=${selectedPosition.lat}&lon=${selectedPosition.lng}&format=json`);
        
        // Extrae y traduce los datos de la respuesta
        const { lat, lon, address } = response.data;
        const { road, neighbourhood, city, county, state, country } = address;

        console.log(`Latitud: ${lat}`);
        console.log(`Longitud: ${lon}`);
        console.log(`Calle: ${road}`);
        console.log(`Barrio: ${neighbourhood}`);
        console.log(`Ciudad: ${city}`);
        console.log(`Provincia: ${county}`);
        console.log(`Estado: ${state}`);
        console.log(`País: ${country}`);
        
      } catch (error) {
        console.error('Error al obtener la dirección:', error); // Muestra un error en la consola si la solicitud falla
      }
    }
    onClose(); // Cierra el modal
  };

  // No muestra el componente si show es falso
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="relative w-auto max-w-3xl mx-auto my-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
            <h3 className="text-2xl font-semibold">Selecciona tu ubicación</h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose} // Cierra el modal al hacer clic en el botón
            >
              <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          <div className="relative p-6 flex-auto">
            <div id="map" key={mapKey} style={{ height: '400px' }}></div> {/* Contenedor del mapa con altura de 400px */}
          </div>
          <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
            <button
              className="px-6 py-2 text-sm font-bold text-red-500 uppercase outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={onClose} // Cierra el modal al hacer clic en el botón
            >
              Cerrar
            </button>
            <button
              className="px-6 py-2 text-sm font-bold text-green-500 uppercase outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={handleSave} // Guarda la posición seleccionada al hacer clic en el botón
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaModal;