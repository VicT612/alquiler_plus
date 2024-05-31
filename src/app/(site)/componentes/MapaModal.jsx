'use client';
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'tailwindcss/tailwind.css';
import axios from 'axios';

const MapaModal = ({ show, onClose }) => {
  const [map, setMap] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    if (show) {
      setMapKey((prevKey) => prevKey + 1);
    }
  }, [show]);

  useEffect(() => {
    if (show && typeof window !== 'undefined') {
      const newMap = L.map('map').setView([51.503, -0.09], 19);
      setMap(newMap);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(newMap);

      const markerIcon = L.icon({
        iconUrl: './marker.webp',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          const userLatLng = L.latLng(latitude, longitude);
          newMap.setView(userLatLng, 19);
          setSelectedPosition(userLatLng);
          const marker = L.marker(userLatLng, { icon: markerIcon, draggable: true }).addTo(newMap);
          setUserMarker(marker);

          marker.on('dragend', function (event) {
            const marker = event.target;
            const position = marker.getLatLng();
            setSelectedPosition(position);
          });
        });
      }
    }
  }, [show, mapKey]);

  const handleSave = async () => {
    if (selectedPosition) {
      try {
        const response = await axios.get(
          `https://us1.locationiq.com/v1/reverse?key=pk.2914d8bbdd858dafbde7131dd6db95d4&lat=${selectedPosition.lat}&lon=${selectedPosition.lng}&format=json`
        );

        const { lat, lon, address: { road, neighbourhood, city, county, state, country } } = response.data;
        const mapeado = {
          latitud: lat.toString(),
          longitud: lon.toString(),
          calle: road || '',
          barrio: neighbourhood || '',
          ciudad: city || '',
          provincia: county || '',
          Departamento: state || '',
          pais: country || '',
          beneficios: '',
        };

        console.log('Datos que se enviarán al servidor:', mapeado);
        localStorage.setItem('Mapeado', JSON.stringify(mapeado));

        const res = await axios.post('/api/agregarDireccion', mapeado, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Respuesta del servidor:', res.data);

        onClose();
      } catch (error) {
        console.error('Error al obtener la dirección o guardar la ubicación:', error);
      }
    } else {
      console.log('No se ha seleccionado ninguna posición.');
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="relative w-auto max-w-3xl mx-auto my-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
            <h3 className="text-black text-2xl font-semibold">Selecciona tu ubicación</h3>
            <button
              className="p-1 ml-auto bg-transparent border-none text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
            </button>
          </div>
          <div className="relative p-6 flex-auto">
            <div id="map" key={mapKey} style={{ height: '400px' }}></div>
          </div>
          <div className="flex items-center justify-end p-4 border-t border-solid border-gray-300 rounded-b">
            <button
              className="px-4 py-2 text-sm font-bold text-red-500 uppercase outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={onClose}
            >
              Cerrar
            </button>
            <button
              className="px-6 py-2 text-sm font-bold text-green-500 uppercase outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={handleSave}
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
