'use client';
import React from 'react';
import './page.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BaneadoPage = () => {
  const router = useRouter();

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
          <span className="advice-text"> Revisa nuestras 
            <Link href="/Normas">
              <a className="advice-link">normas comunitarias</a>
            </Link> para evitar futuros problemas.
          </span>
        </div>
        <Link href="/contact-support">
          <a className="support-link">
            Contacta con el soporte
          </a>
        </Link>
      </div>
    </div>
  );
};

export default BaneadoPage;
