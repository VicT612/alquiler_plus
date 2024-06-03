'use client'
import { useRouter } from 'next/navigation';
import './Baneado.css'; // Importando el archivo CSS

const BaneadoPage = () => {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); 
    router.push('/');
  };
  return (
    <div className="baneado-page-container">
      <div className="baneado-card">
        <div className="baneado-card-header">
          <div className="baneado-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg"
              className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="baneado-card-text">
            <div className="baneado-card-title">No puedes ingresar a otras rutas</div>
            <p className="baneado-card-subtitle">Para ingresar debes de iniciar sesion</p>
          </div>
        </div>
        <button onClick={handleLogout} className="baneado-card-button">
          Iniciar Sesion
        </button>
      </div>
    </div>
  );
};

export default BaneadoPage;
