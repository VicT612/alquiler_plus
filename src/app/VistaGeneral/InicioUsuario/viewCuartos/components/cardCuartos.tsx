import React from 'react';
import { Cuarto } from '../../../types';
import './cardCuarto.css';

const CardCuarto = ({ cuarto, onClick }: { cuarto: Cuarto, onClick: (id: number) => void }) => {
  return (
    <div className="card" onClick={() => onClick(cuarto.id)}>
      <div className="card-image-container">
        <img src={cuarto.fotoUrlcuarto} alt={cuarto.direccion} className="card-image" />
      </div>
      <div className="card-content">
        <h3 className="card-title">{cuarto.direccion}</h3>
        <p className="card-description">{cuarto.caracteristicas}</p>
        <div className="card-footer">
          <span className="card-price">{cuarto.precio} Bs.</span>
          <button className="card-button">Ver</button>
        </div>
      </div>
    </div>
  );
};

export default CardCuarto;
