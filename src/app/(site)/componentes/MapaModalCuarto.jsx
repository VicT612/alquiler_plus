'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import './MapaModalCuarto.css';

const DynamicMap = dynamic(() => import('leaflet'), { ssr: false });

const MapaModalCuarto = ({ show, onClose }) => {
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
    if (show && typeof window !== 'undefined' && mapKey !== 0) {
      const L = require('leaflet');

      if (!map) {
        const newMap = L.map('map').setView([51.503, -0.09], 19);
        setMap(newMap);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(newMap);

        const markerIcon = L.icon({
          iconUrl: '../marker.webp',
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
    }
  }, [show, mapKey, map]);

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
        localStorage.setItem('MapeadoCuartos', JSON.stringify(mapeado));

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
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Selecciona tu ubicación</h3>
            <button className="modal-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div id="map" key={mapKey} className="map-container"></div>
          </div>
          <div className="modal-footer">
            <button className="modal-button modal-close-button" type="button" onClick={onClose}>
              Cerrar
            </button>
            <button className="modal-button modal-save-button" type="button" onClick={handleSave}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaModalCuarto;
