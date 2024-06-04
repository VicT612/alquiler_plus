'use client'
import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { Cuarto } from '../../types';
import CardCuarto from './components/cardCuartos';
import AboutRoom from './PaginaCuartos/page';
import './cuartosView.css';

const CuartosView = () => {
  const [cuartos, setCuartos] = useState<Cuarto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriteria, setSearchCriteria] = useState<string[]>(['descripcion']);
  const [estado, setEstado] = useState('');
  const [showCriteria, setShowCriteria] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchCuartos = async () => {
    try {
      const response = await fetch('/api/agarrarCuartos');
      const data = await response.json();
      if (Array.isArray(data)) {
        setCuartos(data);
      } else {
        setCuartos([]);
        console.error('Error: los datos obtenidos no son un array:', data);
      }
    } catch (error) {
      console.error('Error al obtener datos de cuarto:', error);
    }
  };

  useEffect(() => {
    fetchCuartos();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery, searchCriteria, estado);
  }, [searchCriteria, estado]);

  const handleSearch = async (query: string, criteria: string[], estado: string) => {
    if (query.trim() === '' && estado === '') {
      fetchCuartos();
    } else {
      try {
        const params = new URLSearchParams();
        if (query.trim() !== '') {
          params.append('q', query);
        }
        if (estado !== '') {
          params.append('estado', estado);
        }
        criteria.forEach(criterion => params.append('criteria', criterion));

        const response = await fetch(`/api/buscarCuartos/?${params.toString()}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setCuartos(data);
        } else {
          setCuartos([]);
          console.error('Error: los datos obtenidos no son un array:', data);
        }
      } catch (error) {
        console.error('Error al buscar cuartos:', error);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      handleSearch(query, searchCriteria, estado);
    }, 300);
  };

  const handleCriteriaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setSearchCriteria(options);
  };

  const handleEstadoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEstado(value);
  };

  const handleCardClick = (id: number) => {
    setSelectedRoomId(id);
    localStorage.setItem('cuartoId', id.toString()); // Guardar el ID del cuarto seleccionado en el localStorage
  };

  const toggleShowCriteria = () => {
    setShowCriteria(!showCriteria);
  };

  return (
    <div className="cuartos-view">
      {selectedRoomId ? (
        <AboutRoom  onBack={() => { 
          setSelectedRoomId(null); 
          localStorage.removeItem('selectedRoomId'); // Limpiar el ID del cuarto seleccionado del localStorage
        }} />
      ) : (
        <>
          <h2 className="cuartos-title">Cuartos en Alquiler</h2>
          <div className="search-container">
            <button className="search-button" onClick={toggleShowCriteria}>Buscar</button>
            {showCriteria && (
              <div className={`search-options-wrapper ${showCriteria ? 'show' : ''}`}>
                <div className="search-options">
                  <select multiple className="search-criteria" value={searchCriteria} onChange={handleCriteriaChange}>
                    <option value="">Selecciona un filtro de busqueda</option>
                    <option value="precio">Precio</option>
                    <option value="direccion">Dirección</option>
                    <option value="estadoCuarto">Estado</option>
                    <option value="nombrePropietario">Nombre del Propietario</option>
                  </select>
                  {searchCriteria.includes('estadoCuarto') && (
                    <select className="estado-select" value={estado} onChange={handleEstadoChange}>
                      <option value="">Selecciona un estado</option>
                      <option value="DESOCUPADO">Desocupado</option>
                      <option value="EN_CONTRATO">En contrato</option>
                      <option value="ALQUILADO">Alquilado</option>
                    </select>
                  )}
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar cuartos..."
                    value={searchQuery}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="cuartos-grid">
            {cuartos.length > 0 ? (
              cuartos.map((cuarto) => (
                <CardCuarto key={cuarto.id} cuarto={cuarto} onClick={() => handleCardClick(cuarto.id)} />
              ))
            ) : (
              <p>No se encontraron cuartos disponibles.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CuartosView;
