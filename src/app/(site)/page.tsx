// src/app/(site)/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import axios from 'axios';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Entrada from './componentes/Entradas';
import Boton from './componentes/Boton';
import GoogleButton from './componentes/GoogleBoton';
import MicrosoftButton from './componentes/MicrosoftBoton';
import { toast } from 'react-hot-toast';
import MapaModal from './componentes/MapaModal';

type Variant = 'LOGIN' | 'REGISTER' | 'REGISTERALQUILANTE';

interface Position {
  lat: number;
  lng: number;
}

const AuthForm: React.FC = () => {
  const session = useSession();
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [fotoUrl, setFotoUrl] = useState<string>('');
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const handleSignIn = async (provider: 'google' | 'azure-ad') => {
    setIsLoading(true);
    signIn(provider);
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

  const handleAddressSave = (position: Position) => {
    setAddress(`${position.lat}, ${position.lng}`);
    setValue('direccion', `${position.lat}, ${position.lng}`);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data, event) => {
    try {
      if (event) {
        event.preventDefault();
      }
      setIsLoading(true);

      let response;
      if (variant === 'LOGIN') {
        response = await axios.post('/api/inicio', { email: data.email, contrasena: data.contrasena });
        const { token, rol } = response.data;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);

        switch (rol) {
          case 'USUARIO':
            router.push('/InicioUsuario');
            break;
          case 'PROPIETARIO':
            router.push('/InicioPropietario');
            break;
          case 'ADMIN':
            router.push('/InicioAdmin');
            break;
          case 'BANEADO':
            router.push('/InicioBaneado');
            break;
          default:
            router.push('/');
            break;
        }
      } else if (variant === 'REGISTERALQUILANTE') {
        response = await axios.post('/api/agregarArrendador', { ...data, fotoUrl });
        toast.success('Arrendador registrado exitosamente');
        router.push('/');
      } else {
        response = await axios.post('/api/agregarCliente', { ...data, fotoUrl });
        toast.success('Cliente registrado exitosamente');
        router.push('/');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/');
    }
  }, [session, router]);

  useEffect(() => {
    if (session?.data?.user) {
      setValue('nombre', session.data.user.name);
      setValue('email', session.data.user.email);
      if (session.data.user.image) {
        setFotoUrl(session.data.user.image);
      } else {
        setShowPhotoUpload(true);
      }
    } else {
      setShowPhotoUpload(true);
    }
  }, [session, setValue]);

  return (
    <div className="flex justify-center items-center min-h-screen relative">
      <div className="bg-white dark:bg-sky-950 bg-opacity-80 p-6 rounded-lg shadow-lg z-10 max-w-md w-full space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          {variant === 'LOGIN' ? 'Inicia Sesión' : 'Regístrate'}
        </h2>
        {variant !== 'LOGIN' && showPhotoUpload && (
          <div className="flex justify-center mb-4">
            <label htmlFor="upload-photo" className="cursor-pointer">
              <img src='./upload_icon.png' alt="Subir foto" />
              <input id="upload-photo" type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant !== 'LOGIN' && (
            <>
              <Entrada
                disabled={false}
                register={register}
                errors={errors}
                required
                id="nombre"
                label="Nombre"
              />
              <Entrada
                disabled={false}
                register={register}
                errors={errors}
                required
                id="apellido"
                label="Apellido"
              />
              {variant === 'REGISTERALQUILANTE' && (
                <>
                  <Entrada
                    disabled={false}
                    register={register}
                    errors={errors}
                    required
                    id="telefono"
                    label="Teléfono"
                  />
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Dirección</label>
                    <button
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="w-full px-3 py-2 border rounded-md shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {address || "Selecciona tu dirección"}
                    </button>
                  </div>
                  <Entrada
                    disabled={false}
                    register={register}
                    errors={errors}
                    required
                    id="ciudad"
                    label="Ciudad"
                  />
                  <Entrada
                    disabled={false}
                    register={register}
                    errors={errors}
                    required
                    id="fechaNacimiento"
                    label="Fecha de Nacimiento"
                    type="date"
                  />
                  <Entrada
                    disabled={false}
                    register={register}
                    errors={errors}
                    required
                    id="ci"
                    label="Carnet de Identidad"
                  />
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
          <div className="flex justifycenter">
            <div onClick={() => setVariant(variant === 'LOGIN' ? 'REGISTER' : variant === 'REGISTER' ? 'REGISTERALQUILANTE' : 'LOGIN')} className="cursor-pointer text-sm text-cyan-500 hover:text-cyan-300">
              {variant === 'LOGIN' ? '¿No tienes una cuenta? Regístrate' : variant === 'REGISTER' ? '¿Quieres ser alquilante? Regístrate aquí' : '¿Ya tienes una cuenta? Iniciar Sesión'}
            </div>
          </div>
        </form>
        {variant === 'LOGIN' && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-sky-950 px-2 text-black dark:text-white">Iniciar sesión con</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <GoogleButton onClick={() => handleSignIn('google')} />
              </div>
              <div>
                <MicrosoftButton onClick={() => handleSignIn('azure-ad')} />
              </div>
            </div>
          </div>
        )}
        <button
          onClick={toggleDarkMode}
          className="mt-6 w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 rounded-lg shadow-md"
        >
          {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
        </button>
      </div>
      <MapaModal show={showModal} onClose={() => setShowModal(false)} onSave={handleAddressSave} />
    </div>
  );
};

export default AuthForm;
