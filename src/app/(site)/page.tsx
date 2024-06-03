'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Entrada from './componentes/Entradas';
import Boton from './componentes/Boton';
import GoogleButton from './componentes/GoogleBoton';
import MicrosoftButton from './componentes/MicrosoftBoton';
import { Toaster, toast } from 'react-hot-toast';
import MapaModal from './componentes/MapaModal';
import Cookies from 'js-cookie';
import './page.css'; 

type Variant = 'LOGIN' | 'REGISTER' | 'REGISTERALQUILANTE';

const AuthForm: React.FC = () => {
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [fotoUrl, setFotoUrl] = useState<string>('');
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [ubicacionId, setUbicacionId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const theme = Cookies.get('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const handleSignIn = async (provider: 'google' | 'azure-ad') => {
    setIsLoading(true);
    const result = await signIn(provider, { redirect: false });
    if (result && result.url) {
      const user = await axios.get(result.url);
      if (provider === 'google') {
        setValue('nombre', user.data.name);
        setValue('email', user.data.email);
        setFotoUrl(user.data.image);
      } else if (provider === 'azure-ad') {
        setValue('nombre', user.data.name);
        setValue('email', user.data.email);
      }
    }
    setIsLoading(false);
  };

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      contrasena: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      fechaNacimiento: '',
      ci: '',
    },
  });

  const inputFields: Array<{ id: string; label: string; type: 'text' | 'email' | 'password' | 'file' | 'date' }> = [
    { id: 'nombre', label: 'Nombre', type: 'text' },
    { id: 'apellido', label: 'Apellido', type: 'text' },
    { id: 'telefono', label: 'Teléfono', type: 'text' },
    { id: 'fechaNacimiento', label: 'Fecha de Nacimiento', type: 'date' },
    { id: 'ci', label: 'Carnet de Identidad', type: 'text' }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && (variant === 'REGISTER' || variant === 'REGISTERALQUILANTE')) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoUrl(reader.result as string);
        setShowPhotoUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (variant === 'REGISTERALQUILANTE') {
      const storedAddress = localStorage.getItem('Mapeado');
      if (storedAddress) {
        const addressData = JSON.parse(storedAddress);
        const calle = addressData.calle || addressData.barrio;
        setAddress(calle as string);
        setCity(addressData.ciudad as string);
        setValue('direccion', calle as string);
        setValue('ciudad', addressData.ciudad as string);
      }
    }
  }, [variant, setValue]);

  useEffect(() => {
    if (!showModal) {
      const storedAddress = localStorage.getItem('Mapeado');
      if (storedAddress) {
        const addressData = JSON.parse(storedAddress);
        const calle = addressData.calle || addressData.barrio;
        setAddress(calle as string);
        setCity(addressData.ciudad as string);
        setValue('direccion', calle as string);
        setValue('ciudad', addressData.ciudad as string);
      }
    }
  }, [showModal, setValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (data, event) => {
    try {
      if (event) {
        event.preventDefault();
      }
      setIsLoading(true);

      let response;
      if (variant === 'LOGIN') {
        response = await axios.post('/api/inicio', { email: data.email, contrasena: data.contrasena });
        const { token, rol, user } = response.data;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        Cookies.set('rol', user.rol);

        switch (rol) {
          case 'USUARIO':
            router.push('/VistaGeneral/InicioUsuario');
            break;
          case 'PROPIETARIO':
            router.push('/VistaGeneral/InicioPropietario');
            break;
          case 'ADMIN':
            router.push('/VistaGeneral/InicioAdmin');
            break;
          case 'BANEADO':
            router.push('/InicioBaneado');
            break;
          default:
            router.push('/');
            break;
        }
      } else if (variant === 'REGISTERALQUILANTE') {
        const storedAddress = localStorage.getItem('Mapeado');
        if (storedAddress) {
          const addressData = JSON.parse(storedAddress);
          const { latitud, longitud, calle, barrio, ciudad, provincia, Departamento, pais, beneficios } = addressData;
          const addressResponse = await axios.post('/api/agregarDireccion', {
            latitud,
            longitud,
            calle: calle as string,
            barrio: barrio as string,
            ciudad: ciudad as string,
            provincia,
            Departamento,
            pais,
            beneficios,
          });

          const ubicacionId = addressResponse.data.id;

          const propietarioResponse = await axios.post('/api/agregarArrendador', {
            ...data,
            fotoUrl,
            ubicacionId,
          });
          toast.success('Arrendador registrado exitosamente');
          router.push('/');
        }
      } else {
        response = await axios.post('/api/agregarCliente', { ...data, fotoUrl });
        toast.success('Cliente registrado exitosamente');
        router.push('/');
      }
    } catch (error) {
      toast.error(axios.isAxiosError(error) ? error.response?.data.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSwitchLinks = () => {
    switch (variant) {
      case 'LOGIN':
        return (
          <>
            <div onClick={() => setVariant('REGISTER')} className="auth-form-link">
              ¿No tienes una cuenta? Regístrate
            </div>
            <div onClick={() => setVariant('REGISTERALQUILANTE')} className="auth-form-link">
              ¿Quieres ser alquilante? Regístrate aquí
            </div>
          </>
        );
      case 'REGISTER':
        return (
          <>
            <div onClick={() => setVariant('LOGIN')} className="auth-form-link">
              ¿Ya tienes una cuenta? Iniciar Sesión
            </div>
          </>
        );
      case 'REGISTERALQUILANTE':
        return (
          <>
            <div onClick={() => setVariant('LOGIN')} className="auth-form-link">
              ¿Ya tienes una cuenta? Iniciar Sesión
            </div>
          </>
        );
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <h2 className="auth-form-title">
          {variant === 'LOGIN' ? 'Inicia Sesión' : 'Regístrate'}
        </h2>
        {variant !== 'LOGIN' && showPhotoUpload && (
          <div className="photo-upload">
            <label htmlFor="upload-photo" className="upload-label">
              <img src='./upload_icon.png' alt="Subir foto" />
              <input id="upload-photo" type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        )}
        <form className="auth-form-content" onSubmit={handleSubmit(onSubmit)}>
          {variant !== 'LOGIN' && (
            <>
              {inputFields.slice(0, variant === 'REGISTERALQUILANTE' ? 5 : 2).map((field) => (
                <Entrada
                  key={field.id}
                  disabled={false}
                  register={register}
                  errors={errors}
                  required
                  id={field.id}
                  label={field.label}
                  type={field.type}
                />
              ))}
              {variant === 'REGISTERALQUILANTE' && (
                <>
                  <div>
                    <label className="auth-form-label">Dirección</label>
                    <button
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="auth-form-button"
                    >
                      {address || "Selecciona tu dirección"}
                    </button>
                  </div>
                  <div>
                    <label className="auth-form-label">Ciudad</label>
                    <input
                      type="text"
                      value={city}
                      disabled
                      className="auth-form-input"
                    />
                  </div>
                </>
              )}
            </>
          )}
          <Entrada
            disabled={false}
            register={register}
            errors={errors}
            required
            id="email"
            label="Correo Electrónico"
            type="email"
          />
          <Entrada
            disabled={false}
            register={register}
            errors={errors}
            required
            id="contrasena"
            label="Contraseña"
            type="password"
          />

          <Boton fullWidth type="submit">
            {variant === 'LOGIN' ? 'Iniciar Sesión' : 'Registrarse'}
          </Boton>
          <div className="auth-form-switch">
            {renderSwitchLinks()}
          </div>
        </form>
        {variant !== 'LOGIN' && (
          <div className="auth-form-divider">
            <div className="">
              <div className="">
                <div className="" />
              </div>
              <div className="">
                <span className="auth-form-divider-text">Regístrate con</span>
              </div>
            </div>
            <div className="auth-form-buttons">
              <div>
                <GoogleButton onClick={() => handleSignIn('google')} />
              </div>
              <div>
                <MicrosoftButton onClick={() => handleSignIn('azure-ad')} />
              </div>
            </div>
          </div>
        )}
      </div>
      <MapaModal show={showModal} onClose={() => setShowModal(false)} />
      <Toaster toastOptions={{ duration: 3000, position: 'top-left' }} />
    </div>
  );
};

export default AuthForm;

