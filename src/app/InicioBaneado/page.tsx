'use client'
import React from 'react';
import './page.css'; // Importando el archivo CSS

const BaneadoPage = () => {
  return (
    <div className="container">
      <div className="card">
        <h1 className="title">¡Cuenta Baneada!</h1>
        <p className="message">
          Tu cuenta ha sido baneada debido a violaciones de nuestras políticas.
        </p>
        <div className="warning">
          <strong className="warning-bold">Advertencia:</strong>
          <span className="warning-text"> Esta acción no es permanente pero no se puede revertir.</span>
        </div>
        <div className="advice">
          <strong className="advice-bold">Consejo:</strong>
          <span className="advice-text"> Revisa nuestras <a href="/guidelines" className="advice-link">normas comunitarias</a> para evitar futuros problemas.</span>
        </div>
        <a href="/contact-support" className="support-link">
          Contacta con el soporte
        </a>
      </div>
    </div>
  );
};

export default BaneadoPage;
