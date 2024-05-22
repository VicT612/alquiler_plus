'use client'
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Mapa = () => {
  const [map, setMap] = useState(null);
  const [userMarker, setUserMarker] = useState(null);

  useEffect(() => {
    // Verificar si el mapa ya está inicializado antes de crearlo
    if (!document.getElementById('map').classList.contains('leaflet-container')) {
      // Inicializar mapa solo si el contenedor no tiene la clase de Leaflet
      const newMap = L.map('map').setView([51.503, -0.09], 13); // Ajustar la vista inicial más al sur
      setMap(newMap);

      // Agregar capa de azulejos (tiles)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(newMap);

      // Manejar evento de clic en el mapa
      function onMapClick(e) {
        L.popup()
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(newMap);
      }
      newMap.on('click', onMapClick);
    }
  }, []); // Solo se ejecuta una vez al montar el componente

  useEffect(() => {
    if (map) {
      const geoOptions = {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0
      };

      // Función para obtener la ubicación del usuario
      const getUserLocation = () => {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            const userLatLng = [latitude, longitude];

            // Crear un marcador para la ubicación del usuario si no existe
            if (!userMarker) {
              const marker = L.marker(userLatLng).addTo(map);
              setUserMarker(marker);
            } else {
              // Actualizar la posición del marcador del usuario
              userMarker.setLatLng(userLatLng);
            }

            // Centrar el mapa en la ubicación del usuario
            map.setView(userLatLng, 18);
          },
          error => {
            console.error('Error al obtener la ubicación del usuario:', error);
          },
          geoOptions
        );
      };

      // Obtener la ubicación inicial del usuario
      getUserLocation();

      // Actualizar la ubicación del usuario cada 10 segundos
      const intervalId = setInterval(getUserLocation, 1000);

      // Limpiar el intervalo al desmontar el componente
      return () => clearInterval(intervalId);
    }
  }, [map, userMarker]);

  return <div id="map" style={{ height: '400px' }}></div>;
}

export default Mapa;
