// Card.tsx
'use client'
import React from 'react';
import { Cuarto } from './types';

interface CardProps {
  cuartos: Cuarto[];
}

const Card: React.FC<CardProps> = ({ cuartos }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cuartos.map((cuarto) => (
        <div key={cuarto.id} className="bg-white p-4 rounded-lg shadow-md">
          <img src={cuarto.fotoUrlcuarto} alt={`Imagen de ${cuarto.tipo}`} className="w-full h-48 object-cover rounded-lg" />
          <h3 className="text-xl font-bold mt-2">{cuarto.tipo} - {cuarto.direccion}</h3>
          <p>{cuarto.caracteristicas}</p>
          <p className="text-lg font-semibold">{cuarto.precio} USD</p>
        </div>
      ))}
    </div>
  );
};

export default Card;
