'use client'
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { useSession } from 'next-auth/react';
import MapaModalCuarto from "../../../(site)/componentes/MapaModalCuarto";
import { Cuarto } from '../../types';
import { toast, Toaster } from 'react-hot-toast';
import './registrarCuarto.css';

const steps = [
  { id: 'precio', label: 'Precio', type: 'number' },
  { id: 'descripcion', label: 'Características', type: 'text' },
  { id: 'tipoCuarto', label: 'Tipo de Cuarto', type: 'select', options: ['GARZONIER', 'RECIDENCIA ESTUDINATIL', 'CUARTO DE ALQUILER'] },
  { id: 'estadoCuarto', label: 'Estado', type: 'select', options: ['DESOCUPADO', 'EN_CONTRATO', 'ALQUILADO'] },
  { id: 'foto', label: 'Foto', type: 'file' },
  { id: 'direccion', label: 'Ubicación', type: 'button', action: 'map' }
];

const RegistrarCuarto = () => {
  const [cuartos, setCuartos] = useState<Cuarto[]>([]);
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    precio: '',
    descripcion: '',
    condiciones: '',
    tipoCuarto: 'GARZONIER',
    estadoCuarto: 'DESOCUPADO',
    email: '',
    direccion: ''
  });

  const [fotoUrlcuarto, setFotoUrlcuarto] = useState<string>('');
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: session.user?.email ?? ''
      }));
    }

    const darkMode = localStorage.getItem('theme') === 'dark';
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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
    const storedAddress = localStorage.getItem('MapeadoCuartos');
    if (storedAddress) {
      const addressData = JSON.parse(storedAddress);
      setFormData({
        ...formData,
        direccion: `${addressData.calle}, ${addressData.barrio}, ${addressData.ciudad}, ${addressData.provincia}, ${addressData.Departamento}, ${addressData.pais}`
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const storedAddress = localStorage.getItem('MapeadoCuartos');
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
          precio: parseFloat(formData.precio),
          fotoUrlcuarto,
          ubicacionId,
          direccion: `${calle}`
        });

        setFotoUrlcuarto('');
        toast.success('Cuarto registrado exitosamente');
      } catch (error) {
        console.error('Error al agregar cuarto:', error);
        toast.error('Error al registrar el cuarto');
      }
    } else {
      console.log('No se ha seleccionado ninguna ubicación.');
      toast.error('No se ha seleccionado ninguna ubicación');
    }
  };

  const currentField = steps[currentStep];

  return (
    <div className="registrar-cuarto-container">
      <h1 className="title">Registrar Cuartos</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-step">
            {currentField.type === 'text' && (
              <div className="form-group">
                <label htmlFor={currentField.id}>{currentField.label}</label>
                <input
                  type="text"
                  id={currentField.id}
                  name={currentField.id}
                  value={(formData as any)[currentField.id]}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            )}
            {currentField.type === 'number' && (
              <div className="form-group">
                <label htmlFor={currentField.id}>{currentField.label}</label>
                <input
                  type="number"
                  id={currentField.id}
                  name={currentField.id}
                  value={(formData as any)[currentField.id]}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            )}
            {currentField.type === 'select' && (
              <div className="form-group">
                <label htmlFor={currentField.id}>{currentField.label}</label>
                <select
                  id={currentField.id}
                  name={currentField.id}
                  value={(formData as any)[currentField.id]}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  {currentField.options?.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            )}
            {currentField.type === 'file' && (
              <div className="form-group">
                <label htmlFor={currentField.id}>{currentField.label}</label>
                <input 
                  type="file"
                  id="foto"
                  name="foto"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="form-input-file"
                />
              </div>
            )}
            {currentField.type === 'button' && (
              <div className="form-group">
                <button type="button" onClick={handleOpenMapModal} className="form-button">{currentField.label}</button>
              </div>
            )}
          </div>
          {currentStep === steps.length - 1 && (
            <div className="form-summary">
              <h2>Resumen de los Datos Ingresados</h2>
              <p><strong>Precio:</strong> {formData.precio}</p>
              <p><strong>Descripción:</strong> {formData.descripcion}</p>
              <p><strong>Tipo de Cuarto:</strong> {formData.tipoCuarto}</p>
              <p><strong>Estado del Cuarto:</strong> {formData.estadoCuarto}</p>
              <p><strong>Dirección:</strong> {formData.direccion}</p>
            </div>
          )}
          <div className="form-navigation">
            {currentStep > 0 && (
              <button type="button" onClick={() => setCurrentStep(currentStep - 1)} className="form-button">Anterior</button>
            )}
            {currentStep < steps.length - 1 && (
              <button type="button" onClick={() => setCurrentStep(currentStep + 1)} className="form-button">Siguiente</button>
            )}
            {currentStep === steps.length - 1 && (
              <button type="submit" className="form-button">Agregar Cuarto</button>
            )}
          </div>
        </form>
      </div>
      <div className="cuartos-grid">
        {cuartos.map((cuarto) => (
          <div key={cuarto.id} className="cuarto-card">
            <img src={cuarto.fotoUrlcuarto} alt={cuarto.direccion} className="cuarto-image" />
            <div className="cuarto-details">
              <h3>{cuarto.direccion}</h3>
              <p>{cuarto.caracteristicas}</p>
              <div className="cuarto-footer">
                <span>{cuarto.precio} $</span>
                <button className="cuarto-button">Ver</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <MapaModalCuarto show={showMapModal} onClose={handleCloseMapModal} />
      <Toaster />
    </div>
  );
};

export default RegistrarCuarto;
