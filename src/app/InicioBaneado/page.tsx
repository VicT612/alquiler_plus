const BaneadoPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
      <div className="bg-sky-950 p-8 rounded shadow-md max-w-md text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">¡Cuenta Baneada!</h1>
        <p className="text-hite-600 mb-4">
          Tu cuenta ha sido baneada debido a violaciones de nuestras políticas.
        </p>
        <div className="bg-red-500 border border-red-900 text-red-200 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Advertencia:</strong>
          <span className="block sm:inline"> Esta acción no es permanente pero no se puede revertir.</span>
        </div>
        <div className="bg-yellow-400 border border-yellow-900 text-yellow-100 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Consejo:</strong>
          <span className="block sm:inline"> Revisa nuestras <a href="/guidelines" className="underline">normas comunitarias</a> para evitar futuros problemas.</span>
        </div>
        <a href="/contact-support" className="text-blue-500 hover:underline">
          Contacta con el soporte
        </a>
      </div>
    </div>
    );
  };
  
  export default BaneadoPage;