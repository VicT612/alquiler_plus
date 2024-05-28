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
import { Toaster, toast } from 'react-hot-toast';
import MapaModal from './componentes/MapaModal';
import Cookies from 'js-cookie';

type Variant = 'LOGIN' | 'REGISTER' | 'REGISTERALQUILANTE';

const AuthForm: React.FC = () => {
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [fotoUrl, setFotoUrl] = useState<string>('');
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState<string>('');
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

  useEffect(() => {
    if (variant === 'REGISTERALQUILANTE') {
      const storedAddress = localStorage.getItem('Mapeado');
      if (storedAddress) {
        const addressData = JSON.parse(storedAddress);
        const calle = addressData.calle || addressData.barrio;
        setAddress(calle as string);
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
                    <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2">Dirección</label>
                    <button
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="bg-white text-black w-full px-3 py-2 border rounded-md shadow-sm text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-300"
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
          <div className="flex justify-center">
            <div onClick={() => setVariant(variant === 'LOGIN' ? 'REGISTER' : variant === 'REGISTER' ? 'REGISTERALQUILANTE' : 'LOGIN')} className="cursor-pointer text-sm text-cyan-500 hover:text-cyan-300">
              {variant === 'LOGIN' ? '¿No tienes una cuenta? Regístrate' : variant === 'REGISTER' ? '¿Quieres ser alquilante? Regístrate aquí' : '¿Ya tienes una cuenta? Iniciar Sesión'}
            </div>
          </div>
        </form>
        {variant === 'LOGIN' && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
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
      </div>
      <MapaModal show={showModal} onClose={() => setShowModal(false)} />
      <Toaster toastOptions={{ duration: 3000, position: 'top-left' }} />
    </div>
  );
};

export default AuthForm;
