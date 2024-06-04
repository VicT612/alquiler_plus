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
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
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

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="cuartos-view">
      {selectedRoomId ? (
        <AboutRoom />
      ) : (
        <>
          <h2 className="cuartos-title">Cuartos en Alquiler</h2>
          <div className="search-container">
            <button className="search-button" onClick={() => toggleAccordion('filtroBusqueda')}>Buscar</button>
            {activeAccordion === 'filtroBusqueda' && (
              <div className={`search-options-wrapper ${activeAccordion === 'filtroBusqueda' ? 'show' : ''}`}>
                <div className="search-options">
                  <div className="accordion">
                    <div className="accordion-item">
                      <button className="accordion-header" onClick={() => toggleAccordion('filtroBusqueda')}>
                        Selecciona un filtro de búsqueda
                      </button>
                      <div className={`accordion-content ${activeAccordion === 'filtroBusqueda' ? 'show' : ''}`}>
                        <input 
                          type="text" 
                          value={searchQuery} 
                          onChange={handleInputChange} 
                          placeholder="Buscar..." 
                          className="search-input"
                        />
                        <select multiple value={searchCriteria} onChange={handleCriteriaChange}>
                          <option value="descripcion">Descripción</option>
                          <option value="direccion">Dirección</option>
                          <option value="caracteristicas">Características</option>
                        </select>
                        <select value={estado} onChange={handleEstadoChange}>
                          <option value="">Todos</option>
                          <option value="disponible">Disponible</option>
                          <option value="ocupado">Ocupado</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="card-list">
            {cuartos.map((cuarto) => (
              <CardCuarto key={cuarto.id} cuarto={cuarto} onClick={handleCardClick} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CuartosView;
