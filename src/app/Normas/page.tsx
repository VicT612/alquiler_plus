'use client';
import React from 'react';

const PoliciesPage: React.FC = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-gray-600 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Políticas y Normas de Uso</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Generalidades</h2>
          <p className="text-white">
            Bienvenido a nuestra plataforma de alquiler de cuartos para estudiantes en Sucre, Bolivia. Al utilizar nuestra página web, aceptas cumplir con las siguientes políticas y normas de uso.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Registro y Cuentas</h2>
          <p className="text-white">
            Todos los usuarios deben registrarse con información veraz y actualizada. Cada usuario es responsable de mantener la confidencialidad de su cuenta y contraseña.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Publicación de Anuncios</h2>
          <p className="text-white">
            Los propietarios deben proporcionar descripciones precisas y completas de los cuartos en alquiler. No se permite la publicación de información falsa o engañosa.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Comportamiento del Usuario</h2>
          <p className="text-white">
            Todos los usuarios deben comportarse de manera respetuosa y profesional. No se tolerará ningún tipo de acoso, abuso o comportamiento inadecuado.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Pagos y Tarifas</h2>
          <p className="text-white">
            Los pagos y tarifas se deben realizar de acuerdo con los términos especificados en cada anuncio. Nuestra plataforma no se hace responsable de transacciones realizadas fuera de nuestro sistema.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Cancelaciones y Reembolsos</h2>
          <p className="text-white">
            Las políticas de cancelación y reembolso varían según el propietario. Revisa cuidadosamente los términos antes de realizar una reserva.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Modificaciones de las Políticas</h2>
          <p className="text-white">
            Nos reservamos el derecho de modificar estas políticas en cualquier momento. Las modificaciones serán efectivas inmediatamente después de su publicación en nuestro sitio web.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Contacto</h2>
          <p className="text-white">
            Si tienes alguna pregunta o inquietud acerca de nuestras políticas y normas de uso, por favor contáctanos a través de nuestra página de contacto.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PoliciesPage;

